import ContactForm from "@/components/Contact";

export default function Page() {
    return(
        <div className="px-4 mx-auto max-w-screen-md">
            <div className="p-6">
                <h2 className="mb-4 text-5xl tracking-tight text-center font-bold text-custom-pink-text">
                    Contribute
                </h2>
                <p className="mb-8 lg:mb-16 text-center text-custom-pink-text text-2xl">
                    Get in touch
                </p>
                <ContactForm />
            </div>
        </div>
    )
}