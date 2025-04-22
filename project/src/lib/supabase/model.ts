'use server';

import { parse } from 'path';
import sharp from 'sharp';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from './server';
import type { TablesInsert } from '@/lib/supabase/database';

const widths = [320, 640, 960, 1280, 1920];

export async function getAllArticles() {
  const supabase = await createClient();
  return await supabase
    .from('articles')
    .select()
    .order('created_at', { ascending: true });
}

export async function getArticleById(id: string) {
  const supabase = await createClient();
  return await supabase.from('articles').select().eq('id', id).single();
}

export async function getAllIssues() {
  const supabase = await createClient();
  return await supabase
    .from('issues')
    .select()
    .order('publication_date', { ascending: false });
}

export async function getCurrentIssue() {
  const supabase = await createClient();
  return await supabase
    .from('issues')
    .select()
    .eq('is_published', true)
    .order('publication_date', { ascending: false })
    .limit(1);
}

export async function getIssueById(id: number) {
  const supabase = await createClient();
  return await supabase.from('issues').select().eq('id', id).single();
}

export async function getIssueArticles(issueId: number) {
  const supabase = await createClient();
  return await supabase.from('articles').select().eq('issue_id', issueId);
}

export async function createIssue(issue: TablesInsert<'issues'>, file: File) {
  const cover_image_path = await uploadImage(file, '/content');
  if (!cover_image_path) {
    throw new Error('Image upload failed. Article was not created.');
  }

  const supabase = await createServiceClient();

  return await supabase.from('issues').insert([{ ...issue, cover_image_path }]);
}

export async function editIssue(issue: TablesInsert<'issues'>) {
  const supabase = createServiceClient();

  return (await supabase)
    .from('issues')
    .update({ ...issue })
    .eq('id', issue.id!);
}

export async function deleteIssue(id: number) {
  const supabase = await createServiceClient();
  return await supabase.from('issues').delete().eq('id', id);
}

export async function createArticle(
  article: TablesInsert<'articles'>,
  file: File
) {
  const img_path = await uploadImage(file, '/articles');
  if (!img_path) {
    throw new Error('Image upload failed. Article was not created.');
  }

  const supabase = await createServiceClient();

  return await supabase.from('articles').insert([{ ...article, img_path }]);
}

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

export async function editArticle(article: TablesInsert<'articles'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('articles')
    .update({ ...article })
    .eq('id', article.id!);
}

export async function deleteArticle(id: string) {
  const supabase = await createServiceClient();
  return await supabase.from('articles').delete().eq('id', id);
}

export async function getArticlesSitemap() {
  const supabase = await createClient();
  return await supabase.from('articles').select('id, created_at');
}

export async function getIssuesSitemap() {
  const supabase = await createClient();
  return await supabase.from('issues').select('id, updated_at, created_at');
}
