import fs from 'fs';
import path from 'path';
import MarkdownRenderer from '@/components/md-renderer';

export default function PrivacyPolicy() {
  const filePath = path.join(
    process.cwd(),
    'src',
    'app',
    '(tos)',
    'data',
    'privacy-policy.md'
  );
  const terms = fs.readFileSync(filePath, 'utf-8');
  return <MarkdownRenderer content={terms} />;
}
