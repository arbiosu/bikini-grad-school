export interface FileUpload {
  filename: string;
  contentType: string;
  size: number;
  folder: 'covers' | 'avatars' | 'features' | 'articles';
}

export interface PresignedUpload {
  uploadUrl: string; // Presigned URL for PUT request
  publicUrl: string; // Final public URL to store in database
  key: string; // Object key in R2
}
