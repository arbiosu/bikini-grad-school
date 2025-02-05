"use client";

import { useState } from 'react'
import { Pencil, Trash2 } from "lucide-react"
import type { Tables } from "@/lib/supabase/database"
import { login } from "@/app/admin/login/actions"
import Link from 'next/link'
import Image from 'next/image';


interface ArticleItemProps {
    article: Tables<'articles'>
}

export default function LoginForm() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        await login(formData)
        setLoading(false)
    }

    return (
        <div className="py-20">
            <form action={handleSubmit} className="space-y-4">
                <label className="block mb-2 text-sm font-medium text-pink-600" htmlFor="email">Email:</label>
                <input 
                    id="email"
                    name="email"
                    type="email" 
                    className="shadow-sm bg-gray-50 border border-gray-300 text-pink-600 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    required />

                <label className="block mb-2 text-sm font-medium text-pink-600" htmlFor="password">Password:</label>
                <input 
                id="password" 
                name="password" 
                type="password" 
                className="shadow-sm bg-gray-50 border border-gray-300 text-pink-600 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                required />

                <button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Logging in...' : 'Log in'}
                </button>
            </form>

        </div>

    )
}

export function ArticleItem({ article }: ArticleItemProps) {
    const handleDelete = () => {
        // Implement delete functionality
        console.log(`Delete post with id: ${article.id}`)
    }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${article.img_path}`

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex items-center p-4 border-b">
            <Image
              src={url || "/placeholder.svg"}
              alt={article.title}
              width={80}
              height={80}
              className="rounded-md object-cover mr-4"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{article.title}</h2>
              <p className="text-sm text-gray-600">
                By {article.author} | {new Date(article.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{article.excerpt}</p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Link href={`/admin/edit/${article.id}`}>
                  <button className="p-2 text-green-600 hover:bg-green-100 rounded">
                    <Pencil className="h-5 w-5" />
                  </button>
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-900 hover:bg-green-100 rounded"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
