import { MetadataRoute } from 'next';
import { getArticlesSitemap, getIssuesSitemap } from '@/lib/supabase/model';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'www.bikinigradschool.com';

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
  const { data: issues } = await getIssuesSitemap();
  if (issues == null) {
    console.error('Sitemap generation failed: could not fetch issues.');
    return staticPages;
  }
  const dynamicIssuePages: MetadataRoute.Sitemap = issues.map((issue) => ({
    url: `${baseUrl}/issues/${issue.id}`,
    lastModified: issue.updated_at ? issue.updated_at : issue.created_at,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));
  const issuePages: MetadataRoute.Sitemap = [
    ...dynamicIssuePages,
    {
      url: `${baseUrl}/issues`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  const { data: articles } = await getArticlesSitemap();
  if (articles == null) {
    console.error(
      'Sitemap generation partially failed: could not fetch articles'
    );
    return [...staticPages, ...issuePages];
  }

  const dynamicArticlesPages: MetadataRoute.Sitemap = articles.map(
    (article) => ({
      url: `${baseUrl}/articles/${article.id}`,
      lastModified: article.created_at,
      changeFrequency: 'yearly',
      priority: 0.9,
    })
  );
  const articlePages: MetadataRoute.Sitemap = [
    ...dynamicArticlesPages,
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  return [...staticPages, ...issuePages, ...articlePages];
}
