'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cropper, { Area } from 'react-easy-crop';
import { AiOutlineCamera, AiOutlineDelete, AiOutlineClose } from 'react-icons/ai';

// Helper function to create cropped image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // Set canvas size to the cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert to blob
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      'image/jpeg',
      0.95
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile');
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, status, router]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

    if (!validTypes.includes(file.type) && !isHeic) {
      setMessage('Invalid file type. Allowed: JPG, PNG, WebP, GIF, or HEIC.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('File too large. Max size: 10MB');
      return;
    }

    // Read file and show cropper
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setImageLoading(true);
    setMessage('');

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error('Failed to crop image');

      const formData = new FormData();
      formData.append('file', croppedBlob, 'profile.jpg');

      const res = await fetch('/api/profile/image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const { url } = await res.json();
      await update({ profileImage: url });
      setMessage('Profile image updated!');
      setShowCropper(false);
      setImageSrc(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleImageDelete = async () => {
    if (!confirm('Are you sure you want to remove your profile image?')) return;

    setImageLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile/image', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete image');
      }

      await update({ profileImage: null });
      setMessage('Profile image removed!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      await update({ name });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-3xl font-bold text-gray-200">Your Profile</h1>

        <div className="rounded-xl bg-gray-800 p-6">
          {message && (
            <div
              className={`mb-6 rounded-lg p-3 ${
                message.includes('success') || message.includes('updated') || message.includes('removed')
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {message}
            </div>
          )}

          {/* Profile Image Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              {session.user.profileImage ? (
                <Image
                  src={session.user.profileImage}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="h-30 w-30 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-30 w-30 items-center justify-center rounded-full bg-yellow-300 text-4xl font-bold text-gray-900">
                  {session.user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-300 border-t-transparent"></div>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="profile-image-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageLoading}
                className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-gray-600 disabled:opacity-50"
              >
                <AiOutlineCamera />
                {session.user.profileImage ? 'Change' : 'Upload'}
              </button>
              {session.user.profileImage && (
                <button
                  type="button"
                  onClick={handleImageDelete}
                  disabled={imageLoading}
                  className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50"
                >
                  <AiOutlineDelete />
                  Remove
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Max 10MB. JPG, PNG, WebP, GIF, or HEIC.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm text-gray-400"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={session.user.email || ''}
                disabled
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm text-gray-400"
              >
                Display Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-yellow-300 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">Role</label>
              <div className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-gray-400">
                {session.user.role === 'admin' ? 'Administrator' : 'User'}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-yellow-300 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* Cropper Modal */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-gray-800 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-200">
                Adjust Your Photo
              </h2>
              <button
                onClick={handleCropCancel}
                className="text-gray-400 transition-colors hover:text-gray-200"
              >
                <AiOutlineClose className="text-2xl" />
              </button>
            </div>

            <div className="relative h-80 w-full overflow-hidden rounded-xl bg-gray-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-gray-400">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-yellow-300"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCropCancel}
                className="flex-1 rounded-lg border border-gray-600 py-2 text-gray-300 transition-colors hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                disabled={imageLoading}
                className="flex-1 rounded-lg bg-yellow-300 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400 disabled:opacity-50"
              >
                {imageLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
