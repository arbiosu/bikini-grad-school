import { ArticlePreview, mockArticles } from "@/components/Articles"


export default function Page() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-pink-600">Articles</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {mockArticles.map((article) => (
                    <ArticlePreview key={article.id} article={article} />
                ))}
            </div>
        </main>
    )
}