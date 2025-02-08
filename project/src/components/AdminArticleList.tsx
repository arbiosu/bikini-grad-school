import { redirect } from 'next/navigation'
import { getArticles } from "@/lib/supabase/model"
import { ArticleItem } from './Admin'

export default async function ArticleList() {
    const { data, error } = await getArticles()
    if (error) {
        redirect('/admin/error')
    }
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                {data?.map((article) => (
                    <ArticleItem key={article.id} article={article} />
                ))}
                </div>
            </div>
        </div>

    )
}