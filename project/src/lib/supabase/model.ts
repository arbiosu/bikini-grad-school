"use server";

import { createServiceClient } from "@/lib/supabase/service"

export async function getArticles() {
    const supabase = await createServiceClient()
    return await supabase
    .from("articles")
    .select()
    .order('created_at', { ascending: false })
}


export async function getArticleById(id: string) {
    const supabase = await createServiceClient()
    return await supabase
    .from("articles")
    .select()
    .eq('id', id)
}

interface Article {
    title: string,
    author: string,
    excerpt: string,
    content: string,
    img_path: string
}


export async function createArticle(article: Omit<Article, "img_path">, file: File) {
    const img_path = await uploadImage(file)
    if (!img_path) {
        throw new Error('Image upload failed. Article was not created.')
    }

    const supabase = await createServiceClient()

    return await supabase
    .from('articles')
    .insert([{...article, img_path}])
}

export async function uploadImage(file: File) {
    const fileName = `articles/${file.name}`
    const supabase = await createServiceClient()
    const { data, error } =  await supabase
    .storage
    .from('images')
    .upload(fileName, file)

    if (error) {
        console.error(error.message)
    }

    return data?.path
}
