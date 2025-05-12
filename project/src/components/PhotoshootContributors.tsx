import type { PhotoshootContributorNames } from '@/lib/supabase/model/types';

export function PhotoshootContributorCredits({
  pcData,
}: {
  pcData: PhotoshootContributorNames[];
}) {
  const grouped: Map<string, string[]> = new Map();
  for (const item of pcData) {
    const roleName = item.role.name;
    const contributorName = item.contributor.name;

    if (!roleName || !contributorName) continue;

    const check = grouped.get(roleName);
    if (!check) {
      grouped.set(roleName, [contributorName]);
    }

    check?.push(contributorName);
  }
  return (
    <div className='mx-auto'>
      {Array.from(grouped.entries()).map((entry) => {
        const [key, value] = entry;

        return (
          <p className='text-sm md:text-base lg:text-lg' key={key}>
            <span className='text-gray-500'>
              {key === 'Model' && value.length > 1 ? 'Models' : key}
            </span>
            {'- '}
            {value.join(', ')}
          </p>
        );
      })}
    </div>
  );
}
