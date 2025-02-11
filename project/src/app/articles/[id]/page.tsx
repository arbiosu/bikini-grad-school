import { Article } from "@/components/Articles"
import { getArticleById } from "@/lib/supabase/model"
import { redirect } from "next/navigation"


export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const articleId = (await params).id
  const { data, error } = await getArticleById(articleId)

  if (error || !data) {
    redirect('/articles')
  }

  return (
    <main className="container mx-auto px-4 py-8">
        <Article article={data} />
    </main>
  )
}
