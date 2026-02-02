import { getPlaiceholder } from 'plaiceholder';

/**
 * Generate a blur data URL for an image
 * Use this for dynamic images loaded from external sources
 */
export async function getBlurDataURL(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch {
    // Return a generic gray placeholder on error
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIhAAAQMEAQUBAAAAAAAAAAAAAQIDBAAFBhEhEjEyQWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESITH/2gAMAwEAAhEDEQA/ANS7b2JAsmyaZbcN556PBbKfcv8AKlqJJUo8QByST116x1pdWk1t+p//2Q==';
  }
}

/**
 * Generate a simple shimmer SVG data URL for loading states
 * This is synchronous and doesn't require image fetching
 */
export function getShimmerDataURL(width: number, height: number): string {
  const shimmerSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#374151;stop-opacity:1">
            <animate attributeName="offset" values="-2;1" dur="1.5s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" style="stop-color:#4b5563;stop-opacity:1">
            <animate attributeName="offset" values="-1;2" dur="1.5s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:#374151;stop-opacity:1">
            <animate attributeName="offset" values="0;3" dur="1.5s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shimmer)"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(shimmerSvg).toString('base64')}`;
}

/**
 * Static blur placeholder for when you can't async generate
 * Generic gray/dark placeholder
 */
export const DEFAULT_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIhAAAQMEAQUBAAAAAAAAAAAAAQIDBAAFBhEhEjEyQWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESITH/2gAMAwEAAhEDEQA/ANS7b2JAsmyaZbcN556PBbKfcv8AKlqJJUo8QByST116x1pdWk1t+p//2Q==';
