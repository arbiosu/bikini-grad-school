import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlusCircle } from "lucide-react"
import { SignOutForm } from '@/components/Admin'
import { Button } from "@/components/Buttons"
import Link from "next/link"
import ArticleList from '@/components/AdminArticleList'


export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
        console.log('Auth Error:', error)
        redirect('/admin/login')
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-pink-600 mb-6 py-20">Admin Dashboard</h1>
            <Link href="/admin/create">
                <Button label={
                    <div>
                        <PlusCircle className="mr-2 h-4 w-4"/>{"Create New Article"}
                    </div>
                } />
            </Link>
            <div className="flex items-center mb-4 py-4">
                <ArticleList />
            </div>
            <SignOutForm />
        </div>

    )
}