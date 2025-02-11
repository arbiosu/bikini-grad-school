"use client";

import { useState, useRef } from 'react'
import { Pencil, Trash2, LogOut } from "lucide-react"
import type { Tables } from "@/lib/supabase/database"
import { login } from "@/app/admin/login/actions"
import { createArticle, editArticle, deleteArticle } from '@/lib/supabase/model'
import { Button } from "@/components/Buttons"
import Link from 'next/link'
import Image from 'next/image';


interface ArticleItemProps {
    article: Tables<'articles'>
}


interface ContributeMessageProps {
    message: Tables<'contribute'>
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
                    <label 
                        className="block mb-2 text-lg text-custom-pink-text font-bold" 
                        htmlFor="email">Email:
                    </label>
                    <input 
                        id="email"
                        name="email"
                        type="email" 
                        className="shadow-sm bg-gray-50 border border-gray-300
                        text-custom-pink-text text-2xl rounded-lg focus:ring-primary-500
                        focus:border-primary-500 block w-full p-2.5"
                        required />

                    <label 
                        className="block mb-2 text-lg font-bold text-custom-pink-text"
                        htmlFor="password">Password:
                    </label>
                    <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        className="shadow-sm bg-gray-50 border border-gray-300
                        text-custom-pink-text text-2xl rounded-lg focus:ring-primary-500
                        focus:border-primary-500 block w-full p-2.5"
                        required />
                    <div className="py-4">
                        <Button label={loading ? 'Logging in...' : 'Log in'} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export function SignOutForm() {
    return (
        <form action="/admin/signout" method="post">
            <Button label={
                <div>
                    <LogOut />{"Log Out"}
                </div>
            } 
            />
        </form>
    )
}

export function ArticleItem({ article }: ArticleItemProps) {
    const handleDelete = async () => {
        // Implement delete functionality
        const { error } = await deleteArticle(article.id)
        if (error) {
            console.error('Error deleting article:', error)
        }
        console.log(`Delete post with id: ${article.id}`)
        alert('Article deleted successfully! Refresh the page (TODO: implement revalidation)')
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
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-custom-pink-text">
                Upload an Article - all fields are required
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block mb-2 text-lg font-bold text-black">
                Title of the Article*
                </label>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={article.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-black"
                    required
                />
                <label className="block mb-2 text-lg font-bold text-black">
                Author of the Article*
                </label>
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={article.author}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-black"
                    required
                />
                <label className="block mb-2 text-lg font-bold text-black">
                Excerpt* - a brief description of the article for article previews
                </label>
                <textarea
                    name="excerpt"
                    placeholder="Excerpt"
                    value={article.excerpt}
                    onChange={handleChange}
                    className="w-full border p-2 rounded text-black"
                    required
                />
                <label className="block mb-2 text-lg font-bold text-black">
                Content* - please use 2 line breaks when separating paragraphs
                </label>
                <textarea
                    name="content"
                    placeholder="Content"
                    value={article.content}
                    onChange={handleChange}
                    className="w-full border p-2 rounded h-32 text-black"
                    required
                />
                <label className="block mb-2 text-lg font-bold text-black">
                Image upload* - keep filenames unique
                </label>
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
                    className="w-full bg-blue-500 text-white p-2 rounded font-bold"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Submit Article'}
                </button>
            </form>
        </div>
    )
}


export function EditArticleForm({ article }: ArticleItemProps) {
    const [data, setData] = useState({
        id: article.id,
        title: article.title,
        author: article.author,
        excerpt: article.excerpt,
        content: article.content
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const updatedArticle = await editArticle(data)
            if (updatedArticle) {
                alert('Article updated successfully!')
            }
        } catch (error) {
            console.error('Error updating article:', error)
            alert('Failed to update article')
        }
    }
    
    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-4 text-custom-pink-text">Edit Article</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block mb-2 text-lg font-bold text-black">
                    Title
                </label>
                <input className="w-full border p-2 rounded text-black"
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                />
                <label className="block mb-2 text-lg font-bold text-black">
                    Author
                </label>
                <input className="w-full border p-2 rounded text-black"
                    type="text"
                    name="author"
                    value={data.author}
                    onChange={handleChange}
                />
                <label className="block mb-2 text-lg font-bold text-black">
                    Excerpt
                </label>
                <textarea className="w-full border p-2 rounded text-black"
                    name="excerpt"
                    value={data.excerpt}
                    onChange={handleChange}
                />
                <label className="block mb-2 text-lg font-bold text-black">
                    Content
                </label>
                <textarea className="w-full border p-2 rounded text-black"
                    name="content"
                    value={data.content}
                    onChange={handleChange}
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded font-bold">
                    Submit
                </button>
            </form>
        </div>
    )
}


export function ContributeMessage({ message }: ContributeMessageProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <h2 className="text-4xl font-bold mb-2 text-custom-pink-text">SUBJECT: {message.subject}</h2>
                <p className="text-gray-600 mb-6">
                    From {message.email}
                </p>
                <p className="text-gray-600 mb-6">
                    {message.message}
                </p>
                <p className="text-gray-600 mb-6">
                    Message sent on {new Date(message.created_at).toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}


export function ContributeMessageItem({ message }: ContributeMessageProps) {
    return (
        <ContributeMessage message={message} />
    )
}
