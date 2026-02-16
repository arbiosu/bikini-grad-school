import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageHandler } from '../domain/storage/handlers/storage-handler';
import { Result, success, failure } from '@/lib/common/result';
import { ValidationError, StorageError } from '@/lib/common/errors';
import type {
  FileUpload,
  PresignedUpload,
  ListObjectsResult,
} from '../domain/storage/types';

const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = 'bgs';
const PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL;

export class StorageService {
  private handler = new StorageHandler();

  async getPresignedUploadUrl(
    data: FileUpload
  ): Promise<Result<PresignedUpload, ValidationError | StorageError>> {
    const validation = this.handler.validate(data);
    if (!validation.isValid) {
      return failure(new ValidationError(validation.errors));
    }

    const key = this.handler.generateKey(data);

    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: data.contentType,
      });
      const url = await getSignedUrl(R2, command, {
        expiresIn: 3600,
      });

      return success({
        uploadUrl: url,
        publicUrl: `${PUBLIC_URL}/${key}`,
        key,
      });
    } catch (error) {
      return failure(new StorageError('Failed to generate upload URL'));
    }
  }
  // todo: add continuation/delimiter for large folders
  async getFilesInFolder(
    folder: string
  ): Promise<Result<ListObjectsResult[], StorageError>> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: folder,
      });
      const response = await R2.send(command);

      if (!response.Contents || response.Contents.length === 0) {
        return success([]);
      }

      const keys = response.Contents.map((result) => ({
        key: result.Key ?? 'Undefined Key',
        size: result.Size ?? 0,
      }));

      return success(keys);
    } catch (error) {
      return failure(
        new StorageError(
          `Failed to get files in folder ${folder}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
    }
  }

  async delete(url: string): Promise<Result<void, StorageError>> {
    const key = url.replace(`${PUBLIC_URL}/`, '');
    try {
      await R2.send(
        new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: key,
        })
      );
      return success(undefined);
    } catch (error) {
      return failure(new StorageError('Failed to delete file', error));
    }
  }
}

export const storageService = new StorageService();
