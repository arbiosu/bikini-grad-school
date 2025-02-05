import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import ArticleList from '@/components/AdminArticleList'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    console.log('Auth Data:', data)
    console.log('Auth Error:', error)

    if (error || !data.user) {
        redirect('/admin/login')
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-pink-600 mb-6 py-20">Admin Dashboard</h1>
            <Link href="/admin/create">
                <button className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-pink-600 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300">
                    <PlusCircle className="mr-2 h-4 w-4"/> Create New Article
                </button>
            </Link>
            <div className="flex items-center mb-4 py-4">
                <ArticleList />
            </div>
        </div>

    )
}