"use client";

import { useState } from 'react'
import { login } from "@/app/admin/login/actions"

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