import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: Error;
}

export function uploadPortfolioImage(
  file: File,
  onProgress: (progress: UploadProgress) => void,
): Promise<{ downloadURL: string; storagePath: string }> {
  return new Promise((resolve, reject) => {
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storagePath = `portfolio/${filename}`;
    const storageRef = ref(storage, storagePath);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snap) => {
        const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
        onProgress({ progress });
      },
      (err) => {
        onProgress({ progress: 0, error: err });
        reject(err);
      },
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        onProgress({ progress: 100, downloadURL });
        resolve({ downloadURL, storagePath });
      },
    );
  });
}

export async function deletePortfolioFile(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}
