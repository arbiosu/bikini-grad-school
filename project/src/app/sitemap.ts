import { MetadataRoute } from 'next';
import { queryArticles } from '@/lib/supabase/model/articles';
import { queryIssues } from '@/lib/supabase/model/issues';

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
  const { data: issues, error: issuesError } = await queryIssues({
    select: ['id', 'created_at', 'updated_at'],
    filter: {
      published: true,
    },
  });
  if (issuesError || !issues) {
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

  const { data: articles, error: articlesError } = await queryArticles({
    select: ['id', 'created_at'],
    filter: {
      published: true,
    },
  });
  if (articlesError || !articles) {
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
