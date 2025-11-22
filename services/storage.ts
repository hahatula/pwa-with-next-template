import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/lib/firebase/client';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client-db';

// Resize image on client before upload
export async function resizeImage(file: File, maxSize: number = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions (square crop)
      const size = Math.min(img.width, img.height);

      canvas.width = maxSize;
      canvas.height = maxSize;

      // Draw image (centered crop if not square)
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;
      ctx?.drawImage(img, x, y, size, size, 0, 0, maxSize, maxSize);

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        'image/jpeg', // JPEG for better compression
        0.85 // 85% quality - good balance
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Delete old avatar from storage
async function deleteOldAvatar(uid: string, oldPhotoURL: string | null) {
  if (!oldPhotoURL) return;

  // Only delete if it's in our storage (starts with firebasestorage)
  if (oldPhotoURL.includes('firebasestorage.googleapis.com')) {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        await fetch('/api/user/avatar', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldPhotoURL }),
        });
      }
    } catch (error) {
      console.warn('Failed to delete old avatar:', error);
      // Don't throw - not critical if old file can't be deleted
    }
  }
}

// Main upload function
export async function uploadUserAvatar(uid: string, file: File): Promise<string> {
  // 1. Get old avatar URL (if exists)
  const userDoc = await getDoc(doc(db, 'users', uid));
  const oldPhotoURL = userDoc.data()?.customPhotoURL;

  // 2. Resize image to 512x512 @ 85% quality
  const resizedBlob = await resizeImage(file, 512);

  // 3. Upload new avatar
  const ext = 'jpg'; // Always use jpg for consistency
  const storageRef = ref(storage, `avatars/${uid}/${Date.now()}.${ext}`);
  await uploadBytes(storageRef, resizedBlob);

  // 4. Get download URL
  const downloadURL = await getDownloadURL(storageRef);

  // 5. Update Firestore
  await updateDoc(doc(db, 'users', uid), { customPhotoURL: downloadURL });

  // 6. Delete old avatar (async, don't await)
  deleteOldAvatar(uid, oldPhotoURL);

  return downloadURL;
}

// File validation
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  // Max 5MB before compression
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File too large (max 5MB)' };
  }

  // Only images
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  return { valid: true };
}