'use server';

import type {
  Tables,
  TablesInsert,
  Count,
  SortOrder,
} from '@/lib/supabase/database/types';
import { createClient } from '@/lib/supabase/clients/server';
import { createServiceClient } from '@/lib/supabase/clients/service';

interface QueryFeatureImagesOptions {
  count?: Count;
  onlyCount?: boolean;
  filter?: {
    featureId?: number;
  };
  select?: (keyof Tables<'feature_images'>)[];
  sort?: {
    column?: keyof Tables<'feature_images'>;
    order: SortOrder;
  };
  limit?: number;
}

export async function createFeatureImage(data: TablesInsert<'feature_images'>) {
  const supabase = await createServiceClient();
  return await supabase.from('feature_images').insert(data).select().single();
}

export async function queryFeatureImages(
  options: QueryFeatureImagesOptions = { sort: { order: 'desc' } }
) {
  const supabase = await createClient();

  const selectColumns = options.select?.length
    ? options.select.join(', ')
    : '*';

  let query = supabase.from('feature_images').select(selectColumns as '*', {
    count: options.count,
    head: options.onlyCount ?? false,
  });

  if (options.filter?.featureId) {
    query = query.eq('feature_id', options.filter.featureId);
  }

  const sortColumn = options.sort?.column ?? 'position';
  const sortOrder = options.sort?.order ?? 'desc';

  query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return await query;
}

export async function updateFeatureImage(data: Tables<'feature_images'>) {
  const supabase = await createServiceClient();
  return await supabase
    .from('feature_images')
    .update({ ...data })
    .eq('id', data.id)
    .select()
    .single();
}

export async function deleteFeatureImage(id: number) {
  const supabase = await createServiceClient();
  return await supabase
    .from('feature_images')
    .delete()
    .eq('id', id)
    .select()
    .single();
}
