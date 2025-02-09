"use client";


import { useState } from "react";
import { Button } from "@/components/Buttons";
import { addContributeMessage } from "@/app/contribute/actions";


export default function ContactForm() {
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log(email)
        return emailRegex.test(email);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!validateEmail(email)) {
            alert('Invalid email address. Please try again.')
            setError("Invalid email address. Please try again.")
            return
        }

        setError(null)

        const formData = new FormData();
        formData.append("email", email);
        formData.append("subject", subject);
        formData.append("message", message);

        await addContributeMessage(formData)
        
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label htmlFor="email" className="block mb-2 text-lg font-bold text-custom-pink-text">Email</label>
                <input 
                    type="email"
                    id="email" 
                    className="shadow-sm bg-gray-50 border border-gray-300 text-custom-pink-text text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(() => e.target.value)}
                    required />
            </div>
            <div>
                <label htmlFor="subject" className="block mb-2 text-lg font-bold text-custom-pink-text">Subject</label>
                <input 
                    type="text"
                    id="subject"
                    className="block p-3 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell us whats on your mind"
                    value={subject}
                    onChange={(e) => setSubject(() => e.target.value)}
                    required />
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="message" className="block mb-2 text-lg font-bold text-custom-pink-text">Your message</label>
                <textarea 
                    id="message"
                    rows={6} 
                    className="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Leave a comment"
                    value={message}
                    onChange={(e) => setMessage(() => e.target.value)}
                    required
                    >
                </textarea>
            </div>
            <Button label={"Send Message"} />
        </form>
    )
}