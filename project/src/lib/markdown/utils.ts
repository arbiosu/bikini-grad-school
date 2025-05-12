// https://github.com/uiwjs/react-md-editor/issues/83

import type { SetStateAction } from 'react';
import { uploadImage } from '../supabase/model/storage';

const supabaseBucket = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images`;

export function insertToTextArea(s: string) {
  const textarea = document.querySelector('textarea');
  if (!textarea) {
    return '';
  }

  let sentence = textarea.value;
  const len = sentence.length;
  const pos = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const front = sentence.slice(0, pos);
  const back = sentence.slice(pos, len);

  sentence = front + s + back;

  textarea.value = sentence;
  textarea.selectionEnd = end + s.length;

  return sentence;
}

// TODO: add file extension?????
export async function onImagePasted(
  dataTransfer: DataTransfer,
  setMarkdown: (value: SetStateAction<string | undefined>) => void
) {
  const files: File[] = [];
  for (let i = 0; i < dataTransfer.items.length; i++) {
    const file = dataTransfer.files.item(i);
    if (file) {
      files.push(file);
    }
  }

  await Promise.all(
    files.map(async (file) => {
      const url = await uploadImage(file, '/content');
      const insertedMarkdown = insertToTextArea(
        `![alt](${supabaseBucket}${url})`
      );
      if (!insertedMarkdown) {
        return;
      }
      setMarkdown(insertedMarkdown);
    })
  );
}
