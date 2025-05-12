import type { IssueContent } from '@/lib/supabase/model/types';
import { ArticleCard } from './Article';
import { PhotoshootCard } from './Photoshoots';

export function IssueContentCard({ item }: { item: IssueContent }) {
  switch (item.kind) {
    case 'article':
      return <ArticleCard article={item.payload} />;
    case 'photoshoot':
      return <PhotoshootCard photoshoot={item.payload} />;
    default:
      return null;
  }
}
