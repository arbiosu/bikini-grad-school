import { MetadataRoute } from 'next';
import { createServiceClient } from '@/lib/supabase/service';

const baseUrl = 'www.bikinigradschool.com';

async function queryArticlesSitemap() {
  const supabase = await createServiceClient();
  return await supabase
    .from('articles')
    .select('id, created_at')
    .eq('is_published', true);
}

async function queryIssuesSitemap() {
  const supabase = await createServiceClient();
  return await supabase
    .from('issues')
    .select('id, created_at, updated_at')
    .eq('is_published', true);
}

async function queryPhotoshootsSitemap() {
  const supabase = await createServiceClient();
  return await supabase
    .from('photoshoots')
    .select('id, created_at, updated_at');
}

async function generateArticlesSitemap() {
  const { data: articles, error: articlesError } = await queryArticlesSitemap();
  if (articlesError || !articles) {
    console.error(
      'Sitemap generation partially failed: could not fetch articles'
    );
    return [];
  }

  const dynamicArticlesPages: MetadataRoute.Sitemap = articles.map(
    (article) => ({
      url: `${baseUrl}/articles/${article.id}`,
      lastModified: article.created_at,
      changeFrequency: 'yearly',
      priority: 0.9,
    })
  );
  return dynamicArticlesPages;
}

async function generateIssuesSitemap() {
  const { data: issues, error: issuesError } = await queryIssuesSitemap();
  if (issuesError || !issues) {
    console.error('Sitemap generation failed: could not fetch issues.');
    return [];
  }
  const dynamicIssuePages: MetadataRoute.Sitemap = issues.map((issue) => ({
    url: `${baseUrl}/past-issues/${issue.id}`,
    lastModified: issue.updated_at ? issue.updated_at : issue.created_at,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));
  return dynamicIssuePages;
}

async function generatePhotoshootsSitemap() {
  const { data: photoshoots, error: photoshootsError } =
    await queryPhotoshootsSitemap();
  if (photoshootsError || !photoshoots) {
    console.error('Sitemap generation failed: could not fetch photoshoots.');
    return [];
  }
  const dynamicPhotoshootPages: MetadataRoute.Sitemap = photoshoots.map(
    (photoshoot) => ({
      url: `${baseUrl}/photoshoots/${photoshoot.id}`,
      lastModified: photoshoot.updated_at
        ? photoshoot.updated_at
        : photoshoot.created_at,
      changeFrequency: 'monthly',
      priority: 0.9,
    })
  );
  return dynamicPhotoshootPages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/get-involved`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/digimedia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const [dynamicIssuePages, dynamicArticlesPages, dynamicPhotoshootPages] =
    await Promise.all([
      generateIssuesSitemap(),
      generateArticlesSitemap(),
      generatePhotoshootsSitemap(),
    ]);
  const issuePages: MetadataRoute.Sitemap = [
    ...dynamicIssuePages,
    {
      url: `${baseUrl}/past-issues`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = [
    ...dynamicArticlesPages,
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  const photoshootPages: MetadataRoute.Sitemap = [
    ...dynamicPhotoshootPages,
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  return [...staticPages, ...issuePages, ...articlePages, ...photoshootPages];
}
