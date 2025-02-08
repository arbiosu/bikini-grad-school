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
            <h1 className="text-5xl mx-3 font-bold text-custom-pink-text mb-6">Admin Dashboard</h1>
            <div className="">
                <ArticleList />
            </div>
            <div className="flex gap-10 mx-3">
            <Link href="/admin/create">
                <Button label={
                    <div>
                        <PlusCircle />{"Create New Article"}
                    </div>
                } />
            </Link>
            <SignOutForm />
            </div>
        </div>

    )
}