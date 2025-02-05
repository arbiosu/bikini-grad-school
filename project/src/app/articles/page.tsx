import { ArticlePreview } from "@/components/Articles"
import { getArticles } from "@/lib/supabase/model"
import { redirect } from 'next/navigation'



export default async function Page() {
    const { data, error } = await getArticles()
    if (error) {
        redirect('/admin/error')
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-pink-600">Articles</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {data.map((article) => (
                    <ArticlePreview key={article.id} article={article} />
                ))}
            </div>
        </main>
    )
}