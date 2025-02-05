import { createServiceClient } from "@/lib/supabase/service"

export async function getArticles() {
    const supabase = await createServiceClient()
    return await supabase
    .from("articles")
    .select()
    .order('created_at', { ascending: false })
}
