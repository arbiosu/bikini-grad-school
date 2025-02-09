"use server";


import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveContributeMessage } from "@/lib/supabase/model";


export async function addContributeMessage(formData: FormData) {
    const data = {
        email: formData.get('email')?.toString() ?? "No email",
        subject: formData.get('subject')?.toString() ?? "No Subject",
        message: formData.get('message')?.toString() ?? "No message",
    }

    const { error } = await saveContributeMessage(data)
    if (error) {
        console.log(error)
        return
    }

    revalidatePath('/admin', 'layout')
    redirect('/')

}