"use client";

import { useState, useRef } from 'react'
import { Pencil, Trash2 } from "lucide-react"
import type { Tables } from "@/lib/supabase/database"
import { login } from "@/app/admin/login/actions"
import { createArticle } from '@/lib/supabase/model'
import { Button } from "@/components/Buttons"
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
                <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
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
                <Button label={loading ? 'Logging in...' : 'Log in'} />
                </div>
            </form>
        </div>
    )
}

export function SignOutForm() {
    return (
        <form action="/admin/signout" method="post">
            <Button label={"Sign Out"} />
        </form>
    )
}

export function ArticleItem({ article }: ArticleItemProps) {
    const handleDelete = () => {
        // Implement delete functionality
        console.log(`Delete post with id: ${article.id}`)
    }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/images/${article.img_path}`

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


export function UploadArticle() {
    const [article, setArticle] = useState({
        title: '',
        author: '',
        excerpt: '',
        content: ''
    })
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setArticle({ ...article, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            alert('Please upload an image')
            return
        }

        setLoading(true)

        try {
            const newArticle = await createArticle(article, file)

            if (newArticle) {
                alert('Article created successfully!')
                setArticle({ title: '', author: '', excerpt: '', content: '' })
                setFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
            }
        } catch (error) {
            console.error('Error submitting article:', error)
            alert('Failed to create article')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Upload an Article</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={article.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-black"
                    required
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={article.author}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-black"
                    required
                />
                <textarea
                    name="excerpt"
                    placeholder="Excerpt"
                    value={article.excerpt}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-black"
                    required
                />
                <textarea
                    name="content"
                    placeholder="Content"
                    value={article.content}
                    onChange={handleChange}
                    className="w-full border p-2 rounded h-32 text-black"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full border p-2 rounded text-black"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Submit Article'}
                </button>
                
            </form>
        </div>
    )
}
