import { NextRequest, NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';
import { extractText } from 'unpdf';

const OPENWEBUI_URL = process.env.OPENWEBUI_URL || 'http://192.168.1.203:8080';
const OPENWEBUI_API_KEY = process.env.OPENWEBUI_API_KEY || '';
const VISION_MODEL = process.env.RECEIPT_VISION_MODEL || 'llama3.2-vision';
const FALLBACK_MODEL = process.env.AI_MODEL || 'qwen2.5:14b';

interface ParsedReceipt {
  vendor: string | null;
  date: string | null;
  items: Array<{ name: string; price: number }>;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  toolAmount: number;
  materialAmount: number;
  raw_text?: string;
  method: 'vision' | 'ocr' | 'pdf';
}

const RECEIPT_PARSE_PROMPT = `You are a receipt parsing assistant. Analyze the receipt and extract the following information in JSON format:

{
  "vendor": "store/company name",
  "date": "YYYY-MM-DD format if found",
  "items": [{"name": "item description", "price": 0.00}],
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "toolAmount": 0.00,
  "materialAmount": 0.00
}

Rules:
- For toolAmount: sum prices of POWER TOOLS and HAND TOOLS only (drills, saws, hammers, screwdrivers, wrenches, pliers, measuring tools, clamps, etc.)
- For materialAmount: sum prices of everything else including: lumber, screws, nails, paint, sandpaper, hardware (handles, pulls, knobs, hinges, brackets), adhesives, caulk, tape, brushes, rollers, safety equipment, cleaning supplies
- If an item doesn't clearly fit either category, put it in materialAmount
- Cabinet/drawer pulls, handles, and knobs are ALWAYS materials, not tools
- Use 0 for any values you can't determine
- Return ONLY valid JSON, no other text`;

async function tryVisionModel(base64Image: string): Promise<string | null> {
  try {
    const response = await fetch(`${OPENWEBUI_URL}/api/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(OPENWEBUI_API_KEY && {
          Authorization: `Bearer ${OPENWEBUI_API_KEY}`,
        }),
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: RECEIPT_PARSE_PROMPT },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error('Vision model error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Vision model failed:', error);
    return null;
  }
}

async function extractTextWithOCR(base64Image: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Image, 'base64');
    const result = await Tesseract.recognize(buffer, 'eng', {
      logger: () => {}, // Suppress logs
    });
    return result.data.text;
  } catch (error) {
    console.error('OCR failed:', error);
    throw new Error('OCR extraction failed');
  }
}

async function extractTextFromPDF(base64Pdf: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Pdf, 'base64');
    const uint8Array = new Uint8Array(buffer);
    const { text } = await extractText(uint8Array);
    // text is an array of strings (one per page), join them
    return Array.isArray(text) ? text.join('\n') : text;
  } catch (error) {
    console.error('PDF parsing failed:', error);
    throw new Error('PDF text extraction failed');
  }
}

async function parseWithTextModel(ocrText: string): Promise<string | null> {
  try {
    const response = await fetch(`${OPENWEBUI_URL}/api/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(OPENWEBUI_API_KEY && {
          Authorization: `Bearer ${OPENWEBUI_API_KEY}`,
        }),
      },
      body: JSON.stringify({
        model: FALLBACK_MODEL,
        messages: [
          {
            role: 'system',
            content: RECEIPT_PARSE_PROMPT,
          },
          {
            role: 'user',
            content: `Here is the OCR-extracted text from a receipt. Parse it and return the JSON:\n\n${ocrText}`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error('Text model error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Text model failed:', error);
    return null;
  }
}

function extractJSON(text: string): ParsedReceipt | null {
  try {
    // Try to find JSON in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        vendor: parsed.vendor || null,
        date: parsed.date || null,
        items: Array.isArray(parsed.items) ? parsed.items : [],
        subtotal: parsed.subtotal || null,
        tax: parsed.tax || null,
        total: parsed.total || null,
        toolAmount: parsed.toolAmount || 0,
        materialAmount: parsed.materialAmount || 0,
        method: 'vision',
      };
    }
  } catch (error) {
    console.error('JSON parsing failed:', error);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { image, file } = await request.json();
    const inputData = file || image;

    if (!inputData) {
      return NextResponse.json(
        { error: 'Image or PDF file is required (base64 encoded)' },
        { status: 400 }
      );
    }

    // Detect if it's a PDF
    const isPdf =
      inputData.startsWith('data:application/pdf') ||
      inputData.startsWith('JVBERi'); // PDF magic bytes in base64

    let result: ParsedReceipt | null = null;
    let rawText: string | undefined;

    if (isPdf) {
      // PDF processing path
      console.log('Processing PDF...');
      const base64Pdf = inputData.replace(/^data:application\/pdf;base64,/, '');
      rawText = await extractTextFromPDF(base64Pdf);

      if (rawText && rawText.trim().length > 50) {
        // Good text extraction, use text model
        console.log('PDF text extracted, parsing with text model...');
        const textResponse = await parseWithTextModel(rawText);
        if (textResponse) {
          result = extractJSON(textResponse);
          if (result) {
            result.method = 'pdf';
            result.raw_text = rawText;
            console.log('PDF text parsing succeeded');
          }
        }
      } else {
        // PDF has minimal text (likely scanned) - return error with suggestion
        return NextResponse.json(
          {
            error:
              'PDF appears to be scanned/image-based. Please upload as an image (PNG/JPG) for OCR processing.',
            raw_text: rawText,
          },
          { status: 422 }
        );
      }
    } else {
      // Image processing path
      const base64Image = inputData.replace(/^data:image\/\w+;base64,/, '');

      // Try vision model first
      console.log('Attempting vision model parsing...');
      const visionResponse = await tryVisionModel(base64Image);

      if (visionResponse) {
        result = extractJSON(visionResponse);
        if (result) {
          result.method = 'vision';
          console.log('Vision model succeeded');
        }
      }

      // Fallback to OCR + text model
      if (!result) {
        console.log('Falling back to OCR...');
        rawText = await extractTextWithOCR(base64Image);

        const textResponse = await parseWithTextModel(rawText);
        if (textResponse) {
          result = extractJSON(textResponse);
          if (result) {
            result.method = 'ocr';
            result.raw_text = rawText;
            console.log('OCR + text model succeeded');
          }
        }
      }
    }

    if (!result) {
      return NextResponse.json(
        {
          error: 'Failed to parse receipt',
          raw_text: rawText,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Receipt parse error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
