// export const dynamic = "force-dynamic"

// import { createClient } from "@supabase/supabase-js"

// export async function POST(req: Request) {
//   const url = process.env.NEXT_PUBLIC_SUPABASE_URL
//   const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
//   if (!url || !serviceKey) return Response.json({ error: "Missing env" }, { status: 500 })

//   const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

//   const { gradeId, topicId } = await req.json()

//   if (!gradeId || !topicId) {
//     return Response.json({ error: "Missing gradeId/topicId" }, { status: 400 })
//   }

//   // קוראים את השורה
//   const { data: row, error: readErr } = await supabase
//     .from("grade_progress")
//     .select("total_solved, solved_by_topic")
//     .eq("grade_id", gradeId)
//     .single()

//   if (readErr || !row) return Response.json({ error: readErr?.message ?? "not found" }, { status: 500 })

//   const solvedByTopic = (row.solved_by_topic ?? {}) as Record<string, number>
//   const nextSolvedByTopic = {
//     ...solvedByTopic,
//     [topicId]: (solvedByTopic[topicId] ?? 0) + 1,
//   }

//   // מעדכנים
//   const { error: updErr } = await supabase
//     .from("grade_progress")
//     .update({
//       total_solved: Number(row.total_solved ?? 0) + 1,
//       solved_by_topic: nextSolvedByTopic,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("grade_id", gradeId)

//   if (updErr) return Response.json({ error: updErr.message }, { status: 500 })

//   return Response.json({ ok: true })
// }
export const dynamic = "force-dynamic"

import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return Response.json({ error: "Missing env" }, { status: 500 })

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const { gradeId, topicId } = await req.json()

  if (!gradeId || !topicId) {
    return Response.json({ error: "Missing gradeId/topicId" }, { status: 400 })
  }

  const { error } = await supabase.rpc("increment_grade_progress", {
    p_grade_id: String(gradeId).toLowerCase(),
    p_topic_id: String(topicId),
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true })
}
