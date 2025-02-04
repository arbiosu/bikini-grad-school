import { Article, mockArticles } from "@/components/Articles"

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = mockArticles.find((a) => a.id === params.id)

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
        <Article article={article} />
    </main>
  )
}

