interface ButtonProps {
    label: React.ReactNode
}

export function Button({ label }: ButtonProps) {
    return (
        <button
            className="py-3 px-5 text-sm font-medium text-center text-white 
            rounded-lg bg-pink-600 sm:w-fit hover:bg-primary-800 focus:ring-4 
            focus:outline-none focus:ring-primary-300"
            >
                {label}
        </button>
    )
}