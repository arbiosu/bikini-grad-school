import { getAllIssues } from '@/lib/supabase/model';
import IssueAdminCard from '@/components/admin/Issue';
import Grid from '@/components/Grid';

export default async function IssueAdminGrid() {
  const { data, error } = await getAllIssues();

  if (error) {
    return <h1 className='text-xl'>Error retrieving issues from database.</h1>;
  }

  return (
    <Grid items={data} renderItem={(issue) => <IssueAdminCard {...issue} />} />
  );
}
