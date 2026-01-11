export const dynamic = "force-dynamic"

import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return Response.json({ error: "Missing env" }, { status: 500 })

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const { data, error } = await supabase
    .from("grade_progress")
    .select("*")
    .order("grade_id")

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true, data })
}
