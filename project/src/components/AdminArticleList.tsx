import { redirect } from 'next/navigation'
import { getArticles } from "@/lib/supabase/model"
import { ArticleItem } from './Admin'

export default async function ArticleList() {
    const { data, error } = await getArticles()
    if (error) {
        redirect('/admin/error')
    }
    return (
        <div className="space-y-6">
        {data?.map((article) => (
            <ArticleItem key={article.id} article={article} />
        ))}
        </div>

    )
}