import { Button } from "./Buttons"

export default function ContactUs() {
    return (
        <div className="px-4 mx-auto max-w-screen-md">
            <div className="p-6">
                <h2 className="mb-4 text-5xl tracking-tight text-center font-bold text-custom-pink-text">
                    Contact Us
                </h2>
                <p className="mb-8 lg:mb-16 text-center text-custom-pink-text text-2xl">
                    Get in touch
                </p>
                <form action="#" className="space-y-8">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-lg font-bold text-custom-pink-text">Email</label>
                        <input 
                            type="email"
                            id="email" 
                            className="shadow-sm bg-gray-50 border border-gray-300 text-custom-pink-text text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            placeholder="name@example.com"
                            required />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block mb-2 text-lg font-bold text-custom-pink-text">Subject</label>
                        <input 
                            type="text"
                            id="subject"
                            className="block p-3 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Tell us whats on your mind"
                            required />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block mb-2 text-lg font-bold text-custom-pink-text">Your message</label>
                        <textarea 
                            id="message"
                            rows={6} 
                            className="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Leave a comment">
                        </textarea>
                    </div>
                    <Button label={"Send Message"} />
                </form>
            </div>
        </div>
    )
}