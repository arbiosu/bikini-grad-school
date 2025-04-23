'use server';

import { parse } from 'path';
import sharp from 'sharp';
import { createServiceClient } from '@/lib/supabase/service';
import { widths } from '@/lib/supabase/model/constants';

/**
 *
 * @param file image file
 * @param folderPath the folder the image will be stored in the bucket
 * @returns the full path of the image minus the file ext, adds cache control to 1 year
 */
export async function uploadImage(file: File, folderPath: string) {
  const supabase = await createServiceClient();

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = parse(file.name).name;
  console.log('Filename:', filename);

  for (const width of widths) {
    const finalPath = `${folderPath}/${filename}-${width}w.webp`;
    const resizedFile = await sharp(buffer)
      .resize(width)
      .webp({ quality: 80 })
      .toBuffer();
    const { error } = await supabase.storage
      .from('images')
      .upload(finalPath, resizedFile, {
        cacheControl: 'max-age=31536000',
        contentType: 'image/webp',
      });
    if (error) throw new Error('Failed to upload to image');
  }

  return folderPath + '/' + filename;
}
