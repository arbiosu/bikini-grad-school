import Image from "next/image"
import Link from "next/link"
import type { Tables } from "@/lib/supabase/database"


interface ArticleProps {
  article: Tables<'articles'>
}

export function ArticlePreview({ article }: ArticleProps) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${article.img_path}`

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Image
          src={url || "/placeholder.svg"}
          alt={article.title}
          width={200}
          height={200}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-pink-600">{article.title}</h2>
          <p className="text-black mb-4">
            By {article.author} | {new Date(article.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4">{article.excerpt}</p>
          <Link
            href={`/articles/${article.id}`}
            className="inline-block bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    )
  }
  
export function Article({ article }: ArticleProps) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${article.img_path}`

    return (
        <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <Image
            src={url || "/placeholder.svg"}
            alt={article.title}
            width={800}
            height={400}
            className=""
        />
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 text-pink-600">{article.title}</h1>
            <p className="text-gray-600 mb-6">
            By {article.author} | {new Date(article.created_at).toLocaleDateString()}
            </p>
            <div className="prose prose-pink max-w-none">
              {article.content.split('\n').map((line, index) => 
                <p key={index} className="mb-4 text-black">{line}</p>
              )}
            </div>
        </div>
        </article>
    )
}
  
  