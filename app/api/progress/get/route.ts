// // export const dynamic = "force-dynamic"

// // import { createClient } from "@supabase/supabase-js"

// // export async function GET() {
// //   const url = process.env.NEXT_PUBLIC_SUPABASE_URL
// //   const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
// //   if (!url || !serviceKey) return Response.json({ error: "Missing env" }, { status: 500 })

// //   const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

// //   const { data, error } = await supabase
// //     .from("grade_progress")
// //     .select("*")
// //     .order("grade_id")

// //   if (error) return Response.json({ error: error.message }, { status: 500 })
// //   return Response.json({ ok: true, data })
// // }
// export const dynamic = "force-dynamic"

// import { createClient } from "@supabase/supabase-js"

// export async function GET(req: Request) {
//   const url = process.env.NEXT_PUBLIC_SUPABASE_URL
//   const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
//   if (!url || !serviceKey) return Response.json({ error: "Missing env" }, { status: 500 })

//   const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

//   const { searchParams } = new URL(req.url)
//   const gradeId = (searchParams.get("gradeId") || "").toLowerCase()

//   // אם ביקשו שכבה ספציפית – נחזיר רק אותה
//   if (gradeId) {
//     const { data, error } = await supabase
//       .from("grade_progress")
//       .select("*")
//       .eq("grade_id", gradeId)
//       .single()

//     if (error) return Response.json({ error: error.message }, { status: 500 })
//     return Response.json({ ok: true, data })
//   }

//   // אחרת – כמו שהיה: כל השכבות
//   const { data, error } = await supabase
//     .from("grade_progress")
//     .select("*")
//     .order("grade_id")

//   if (error) return Response.json({ error: error.message }, { status: 500 })
//   return Response.json({ ok: true, data })
// }
export const dynamic = "force-dynamic"

import { createClient } from "@supabase/supabase-js"

const GRADES = new Set(["a", "b", "c", "d", "e", "f"])

export async function GET(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      console.error("Missing env:", { hasUrl: !!url, hasServiceKey: !!serviceKey })
      return Response.json({ ok: false, error: "Missing env" }, { status: 500 })
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { searchParams } = new URL(req.url)
    const raw = (searchParams.get("gradeId") || "").toLowerCase().trim()
    const gradeId = raw && GRADES.has(raw) ? raw : ""

    // ✅ אם ביקשו שכבה ספציפית – נחזיר אובייקט תמיד, בלי single/maybeSingle
    if (gradeId) {
      const { data, error } = await supabase
        .from("grade_progress")
        .select("*")
        .eq("grade_id", gradeId)
        .limit(1)

      if (error) {
        console.error("progress/get grade error:", error)
        return Response.json({ ok: false, error: error.message }, { status: 500 })
      }

      const row = (data && data[0]) || null

      // ✅ אם אין שורה בטבלה – מחזירים ברירת מחדל במקום 500
      const safe = row ?? { grade_id: gradeId, total_solved: 0, solved_by_topic: {} }
      return Response.json({ ok: true, data: safe })
    }

    // ✅ אחרת – כל השכבות (מערך)
    const { data, error } = await supabase
      .from("grade_progress")
      .select("*")
      .order("grade_id")

    if (error) {
      console.error("progress/get list error:", error)
      return Response.json({ ok: false, error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true, data: data ?? [] })
  } catch (err) {
    console.error("progress/get crashed:", err)
    return Response.json({ ok: false, error: "progress/get crashed" }, { status: 500 })
  }
}

