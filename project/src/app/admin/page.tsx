import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'


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
        </div>
    )
}