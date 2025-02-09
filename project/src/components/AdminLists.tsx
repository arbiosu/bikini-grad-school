import { redirect } from 'next/navigation'
import { getArticles, getContributeMessages } from "@/lib/supabase/model"
import { ArticleItem, ContributeMessageItem } from '@/components/Admin'


export async function ArticleList() {
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


export async function ContributeMessageList() {
    const { data, error } = await getContributeMessages()
    if (error) {
        redirect('/admin/error')
    }
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    {data?.map((message) => (
                        <ContributeMessageItem key={message.id} message={message} />
                    ))}
                </div>
            </div>
        </div>
    )
}

