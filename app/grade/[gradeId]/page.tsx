


// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { useParams } from "next/navigation"

// type Topic = { id: string; title: string }

// type Exercise = {
//   prompt: string
//   answer: number | string // מספר או "a/b"
//   topicId: string
// }

// type ProgressData = {
//   totalSolved: number
//   solvedByTopic: Record<string, number>
// }

// const TARGET = 1_000_000
// const POINTS_PER_EXERCISE = 500


// // ✅ נושאים חדשים לפי מה שביקשת
// const GRADE_TOPICS: Record<string, Topic[]> = {
//   a: [
//     { id: "add_10", title: "חיבור עד 10" },
//     { id: "sub_10", title: "חיסור עד 10" },
//   ],
//   b: [
//     { id: "mul_0", title: "כפל ב־0" },
//     { id: "mul_1", title: "כפל ב־1" },
//     { id: "mul_2", title: "כפל ב־2" },
//   ],
//   c: [
//     { id: "mul_4", title: "כפל עד 4" },
//     { id: "div_4", title: "חילוק עד 4" },
//   ],
//   d: [
//     { id: "scale_10", title: "כפל וחילוק ב־10" },
//     { id: "scale_100", title: "כפל וחילוק ב־100" },
//     { id: "scale_1000", title: "כפל וחילוק ב־1000" },
//   ],
//   e: [
//     { id: "frac_add", title: "שברים פשוטים - חיבור" },
//     { id: "frac_sub", title: "שברים פשוטים - חיסור" },
//   ],
//   f: [
//     { id: "frac_mul", title: "כפל שברים פשוטים" },
//     { id: "frac_div", title: "חילוק שברים פשוטים" },
//   ],
// }

// const GRADE_COLORS: Record<string, { bg: string; accent: string; border: string }> = {
//   a: { bg: "from-red-500/20", accent: "text-red-400", border: "border-red-500/30" },
//   b: { bg: "from-blue-500/20", accent: "text-blue-400", border: "border-blue-500/30" },
//   c: { bg: "from-green-500/20", accent: "text-green-400", border: "border-green-500/30" },
//   d: { bg: "from-amber-500/20", accent: "text-amber-400", border: "border-amber-500/30" },
//   e: { bg: "from-purple-500/20", accent: "text-purple-400", border: "border-purple-500/30" },
//   f: { bg: "from-cyan-500/20", accent: "text-cyan-400", border: "border-cyan-500/30" },
// }

// const GRADE_ICONS: Record<string, string> = {
//   a: "🏁",
//   b: "🏎️",
//   c: "⚡",
//   d: "🔥",
//   e: "🚀",
//   f: "🏆",
// }

// function clampGradeId(raw: string) {
//   const id = (raw || "").toLowerCase()
//   return ["a", "b", "c", "d", "e", "f"].includes(id) ? id : "a"
// }

// function formatGradeName(gradeId: string) {
//   const map: Record<string, string> = {
//     a: "שכבה א׳",
//     b: "שכבה ב׳",
//     c: "שכבה ג׳",
//     d: "שכבה ד׳",
//     e: "שכבה ה׳",
//     f: "שכבה ו׳",
//   }
//   return map[gradeId] ?? "שכבה"
// }

// function randInt(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

// /* ---------- שברים ---------- */

// function gcd(a: number, b: number) {
//   a = Math.abs(a)
//   b = Math.abs(b)
//   while (b) {
//     const t = b
//     b = a % b
//     a = t
//   }
//   return a || 1
// }

// type Frac = { n: number; d: number }

// function simp(f: Frac): Frac {
//   const g = gcd(f.n, f.d)
//   const n = f.n / g
//   const d = f.d / g
//   return d < 0 ? { n: -n, d: -d } : { n, d }
// }

// function fracToString(f: Frac) {
//   const s = simp(f)
//   return `${s.n}/${s.d}`
// }

// function parseFrac(input: string): Frac | null {
//   const m = input.trim().match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
//   if (!m) return null
//   const n = Number(m[1])
//   const d = Number(m[2])
//   if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null
//   return simp({ n, d })
// }

// function randDenom() {
//   const denoms = [2, 3, 4, 5, 6, 8, 10]
//   return denoms[randInt(0, denoms.length - 1)]
// }

// function randFracProper(): Frac {
//   const d = randDenom()
//   const n = randInt(1, d - 1)
//   return simp({ n, d })
// }

// function addFrac(a: Frac, b: Frac): Frac {
//   return simp({ n: a.n * b.d + b.n * a.d, d: a.d * b.d })
// }

// function subFrac(a: Frac, b: Frac): Frac {
//   return simp({ n: a.n * b.d - b.n * a.d, d: a.d * b.d })
// }

// function mulFrac(a: Frac, b: Frac): Frac {
//   return simp({ n: a.n * b.n, d: a.d * b.d })
// }

// function divFrac(a: Frac, b: Frac): Frac {
//   return simp({ n: a.n * b.d, d: a.d * b.n })
// }

// /* ---------- Last topic local storage ---------- */

// function lastTopicStorageKey(gradeId: string) {
//   return `race_last_topic_${gradeId}`
// }

// function loadLastTopicId(gradeId: string) {
//   try {
//     return localStorage.getItem(lastTopicStorageKey(gradeId)) || ""
//   } catch {
//     return ""
//   }
// }

// function saveLastTopicId(gradeId: string, topicId: string) {
//   try {
//     localStorage.setItem(lastTopicStorageKey(gradeId), topicId)
//   } catch {}
// }

// /* ---------- Cloud progress ---------- */

// async function fetchCloudProgress(gradeId: string, topicIds: string[]) {
//   const res = await fetch(`/api/progress/get?gradeId=${gradeId}`, { cache: "no-store" })
//   const json = await res.json()
//   const row = json?.data
//   if (!row) return null

//   const solvedByTopic: Record<string, number> = { ...(row.solved_by_topic ?? {}) }
//   for (const t of topicIds) {
//     if (typeof solvedByTopic[t] !== "number") solvedByTopic[t] = 0
//   }

//   return {
//     totalSolved: Number(row.total_solved ?? 0),
//     solvedByTopic,
//   } as ProgressData
// }

// /* ---------- Generate exercise by grade/topic ---------- */

// function generateExercise(gradeId: string, topicId: string): Exercise {
//   // שכבה א׳ - חיבור/חיסור עד 10
//   if (gradeId === "a") {
//     if (topicId === "add_10") {
//       const a = randInt(0, 10)
//       const b = randInt(0, 10 - a)
//       return { prompt: `${a} + ${b} = ?`, answer: a + b, topicId }
//     }
//     const a = randInt(0, 10)
//     const b = randInt(0, a)
//     return { prompt: `${a} - ${b} = ?`, answer: a - b, topicId }
//   }

//   // שכבה ב׳ - כפל ב-0/1/2
//   if (gradeId === "b") {
//     const a = randInt(0, 12)
//     if (topicId === "mul_0") return { prompt: `${a} × 0 = ?`, answer: 0, topicId }
//     if (topicId === "mul_1") return { prompt: `${a} × 1 = ?`, answer: a, topicId }
//     return { prompt: `${a} × 2 = ?`, answer: a * 2, topicId } // mul_2
//   }

//   // שכבה ג׳ - כפל/חילוק עד 4
//   if (gradeId === "c") {
//     if (topicId === "mul_4") {
//       const a = randInt(0, 10)
//       const b = randInt(0, 4)
//       return { prompt: `${a} × ${b} = ?`, answer: a * b, topicId }
//     }
//     // div_4
//     const b = randInt(1, 4)
//     const ans = randInt(0, 10)
//     const a = b * ans
//     return { prompt: `${a} ÷ ${b} = ?`, answer: ans, topicId }
//   }

//   // שכבה ד׳ - כפל/חילוק ב-10/100/1000
//   if (gradeId === "d") {
//     const k = topicId === "scale_10" ? 10 : topicId === "scale_100" ? 100 : 1000

//     if (Math.random() < 0.5) {
//       const a = randInt(1, 200)
//       return { prompt: `${a} × ${k} = ?`, answer: a * k, topicId }
//     } else {
//       const ans = randInt(1, 200)
//       const a = ans * k
//       return { prompt: `${a} ÷ ${k} = ?`, answer: ans, topicId }
//     }
//   }

//   // שכבה ה׳ - חיבור/חיסור שברים פשוטים
//   if (gradeId === "e") {
//     const a = randFracProper()
//     const b = randFracProper()

//     if (topicId === "frac_add") {
//       const c = addFrac(a, b)
//       return { prompt: `${fracToString(a)} + ${fracToString(b)} = ?`, answer: fracToString(c), topicId }
//     }

//     // frac_sub - נוודא חיובי
//     let x = a,
//       y = b
//     const diff = subFrac(x, y)
//     if (diff.n < 0) {
//       x = b
//       y = a
//     }
//     const c = subFrac(x, y)
//     return { prompt: `${fracToString(x)} - ${fracToString(y)} = ?`, answer: fracToString(c), topicId }
//   }

//   // שכבה ו׳ - כפל/חילוק שברים פשוטים
//   if (gradeId === "f") {
//     const a = randFracProper()
//     const b = randFracProper()

//     if (topicId === "frac_mul") {
//       const c = mulFrac(a, b)
//       return { prompt: `${fracToString(a)} × ${fracToString(b)} = ?`, answer: fracToString(c), topicId }
//     }

//     // frac_div
//     const c = divFrac(a, b)
//     return { prompt: `${fracToString(a)} ÷ ${fracToString(b)} = ?`, answer: fracToString(c), topicId }
//   }

//   // fallback
//   const a = randInt(1, 10)
//   const b = randInt(1, 10)
//   return { prompt: `${a} + ${b} = ?`, answer: a + b, topicId }
// }

// /* ---------- UI Icons ---------- */

// function MathLogo({ size = 32 }: { size?: number }) {
//   return (
//     <div className="relative rounded-full overflow-hidden border-2 border-zinc-600" style={{ width: size, height: size }}>
//       <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
//         <div className="bg-red-500 flex items-center justify-center text-white font-bold" style={{ fontSize: size / 4 }}>
//           ×
//         </div>
//         <div className="bg-green-500 flex items-center justify-center text-white font-bold" style={{ fontSize: size / 4 }}>
//           =
//         </div>
//         <div className="bg-blue-500 flex items-center justify-center text-white font-bold" style={{ fontSize: size / 4 }}>
//           ÷
//         </div>
//         <div className="bg-amber-500 flex items-center justify-center text-white font-bold" style={{ fontSize: size / 4 }}>
//           +
//         </div>
//       </div>
//     </div>
//   )
// }

// function ArrowRightIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//     </svg>
//   )
// }

// function RotateCcwIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6M23 20v-6h-6" />
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M20.49 9A9 9 0 105.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
//       />
//     </svg>
//   )
// }

// function TrophyIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M5 3h14M7 3v5a5 5 0 0010 0V3M5 3a2 2 0 00-2 2v2a4 4 0 004 4M19 3a2 2 0 012 2v2a4 4 0 01-4 4M12 13v4M8 21h8M10 17h4"
//       />
//     </svg>
//   )
// }

// function TargetIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <circle cx="12" cy="12" r="10" />
//       <circle cx="12" cy="12" r="6" />
//       <circle cx="12" cy="12" r="2" />
//     </svg>
//   )
// }

// function ZapIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
//     </svg>
//   )
// }

// function SparklesIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7z"
//       />
//     </svg>
//   )
// }

// /* ---------- Page ---------- */

// export default function GradePage() {
//   const p = useParams<{ gradeId?: string }>()
//   const gradeId = clampGradeId(p?.gradeId ?? "a")
//   const gradeName = formatGradeName(gradeId)
//   const colors = GRADE_COLORS[gradeId] || GRADE_COLORS.a
//   const gradeIcon = GRADE_ICONS[gradeId] || "🏁"

//   const topics = useMemo(() => GRADE_TOPICS[gradeId] ?? GRADE_TOPICS.a, [gradeId])
//   const topicIds = useMemo(() => topics.map((t) => t.id), [topics])

//   const [progress, setProgress] = useState<ProgressData | null>(null)
//   const [topicId, setTopicId] = useState<string>(topics[0]?.id ?? topicIds[0] ?? "add_10")

//   const [exercise, setExercise] = useState<Exercise | null>(null)
//   const [answerInput, setAnswerInput] = useState<string>("")
//   const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)
//   const [streak, setStreak] = useState(0)

//   // נושא אחרון (מקומי)
//   useEffect(() => {
//     const last = loadLastTopicId(gradeId)
//     const preferred = last && topicIds.includes(last) ? last : (topics[0]?.id ?? topicIds[0])
//     setTopicId(preferred)
//   }, [gradeId, topicIds, topics])

//   // progress גלובלי מהענן (polling)
//   useEffect(() => {
//     let alive = true

//     const refresh = async () => {
//       const pr = await fetchCloudProgress(gradeId, topicIds)
//       if (!alive || !pr) return
//       setProgress(pr)
//     }

//     refresh()
//     const id = window.setInterval(refresh, 5000)

//     return () => {
//       alive = false
//       window.clearInterval(id)
//     }
//   }, [gradeId, topicIds])

//   // יצירת תרגיל חדש כשהנושא משתנה
//   useEffect(() => {
//     if (!topicId) return
//     setExercise(generateExercise(gradeId, topicId))
//     setAnswerInput("")
//     setFeedback(null)
//   }, [gradeId, topicId])
// const totalSolved = progress?.totalSolved ?? 0
// const totalPoints = totalSolved * POINTS_PER_EXERCISE
// const totalPct = Math.min(100, (totalPoints / TARGET) * 100)

//   function nextExercise() {
//     setExercise(generateExercise(gradeId, topicId))
//     setAnswerInput("")
//     setFeedback(null)
//   }

//   async function submitAnswer() {
//     if (!exercise || !progress) return

//     const normalized = answerInput.trim()
//     if (!normalized) {
//       setFeedback({ ok: false, msg: "נא להכניס תשובה" })
//       return
//     }

//     const expected = exercise.answer

//     // מספר
//     if (typeof expected === "number") {
//       const user = Number(normalized)
//       if (!Number.isFinite(user)) {
//         setFeedback({ ok: false, msg: "התשובה חייבת להיות מספר" })
//         return
//       }
//       if (user !== expected) {
//         setFeedback({ ok: false, msg: "לא נכון. נסו שוב 🙂" })
//         setStreak(0)
//         return
//       }
//     } else {
//       // שבר "a/b"
//       const userF = parseFrac(normalized)
//       if (!userF) {
//         setFeedback({ ok: false, msg: "בשברים יש לרשום בצורה a/b (לדוגמה 3/4)" })
//         return
//       }
//       const expF = parseFrac(expected)
//       if (!expF || userF.n !== expF.n || userF.d !== expF.d) {
//         setFeedback({ ok: false, msg: "לא נכון. נסו שוב 🙂" })
//         setStreak(0)
//         return
//       }
//     }

//     saveLastTopicId(gradeId, topicId)

//     try {
//       await fetch("/api/progress/increment", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ gradeId, topicId: exercise.topicId }),
//       })

//       const pr = await fetchCloudProgress(gradeId, topicIds)
//       if (pr) setProgress(pr)
//     } catch {
//       // לא מפילים את המשחק אם יש תקלה רגעית
//     }

//     setStreak((s) => {
//       const next = s + 1
//       setFeedback({ ok: true, msg: next >= 3 ? `מדהים! רצף של ${next}! 🔥` : "נכון! ✅" })
//       return next
//     })

//     setTimeout(() => nextExercise(), 450)
//   }

//   function resetProgress() {
//     // איפוס מקומי בלבד: רצף + הודעה + נושא אחרון
//     setFeedback(null)
//     setStreak(0)
//     saveLastTopicId(gradeId, topics[0]?.id ?? topicIds[0] ?? "")
//   }

//   return (
//     <main className="min-h-screen bg-zinc-950 text-white" dir="rtl">
//       {/* Racing stripes */}
//       <div className="fixed top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 z-50" />
//       <div className="fixed top-0 right-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 z-50" />

//       <div className="mx-auto max-w-4xl px-6 py-8">
//         {/* Navigation */}
//         <div className="mb-6 flex items-center justify-between gap-3">
//           <a
//             href="/"
//             className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 transition-all"
//           >
//             <ArrowRightIcon className="w-4 h-4" />
//             חזרה לבית
//           </a>

//           <button
//             onClick={resetProgress}
//             className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-red-400"
//             title="איפוס רצף ונושא במחשב הזה"
//           >
//             <RotateCcwIcon className="w-4 h-4" />
//             איפוס
//           </button>
//         </div>

//         {/* Header */}
//         <header className={`mb-8 rounded-2xl bg-gradient-to-br ${colors.bg} to-zinc-900 p-6 border ${colors.border}`}>
//           <div className="flex items-center gap-4 mb-3">
//             <div className="text-5xl">{gradeIcon}</div>
//             <div>
//               <h1 className="text-3xl font-black text-white">{gradeName}</h1>
//               <p className="text-zinc-400">תרגילים ואתגרים מתמטיים</p>
//             </div>
//             <div className="mr-auto">
//               <MathLogo size={48} />
//             </div>
//           </div>
//         </header>

//         {/* Overall Progress */}
//         <section className="mb-6 rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-amber-500/20">
//                 <TrophyIcon className="w-5 h-5 text-amber-400" />
//               </div>
//               <div>
//                 <div className="text-lg font-bold">התקדמות כללית (גלובלי)</div>
//                 <div className="text-sm text-zinc-500">
//                   {totalPoints.toLocaleString()} / {TARGET.toLocaleString()} נקודות

//                 </div>
//               </div>
//             </div>
//             <div className="text-2xl font-black text-amber-400">{totalPct.toFixed(3)}%</div>
//           </div>

//           <div className="h-4 w-full rounded-full bg-zinc-800 overflow-hidden">
//             <div
//               className="h-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-500 relative"
//               style={{ width: `${totalPct}%` }}
//             >
//               <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_15px,rgba(255,255,255,0.1)_15px,rgba(255,255,255,0.1)_30px)]" />
//             </div>
//           </div>
//         </section>

//         {/* Topics */}
//         <section className="mb-6 rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
//           <div className="flex items-center gap-2 mb-4">
//             <TargetIcon className="w-5 h-5 text-amber-400" />
//             <span className="text-lg font-bold">נושאים</span>
//           </div>

//           <div className="flex flex-wrap gap-2 mb-6">
//             {topics.map((t) => {
//               const active = t.id === topicId
//               return (
//                 <button
//                   key={t.id}
//                   onClick={() => {
//                     setTopicId(t.id)
//                     saveLastTopicId(gradeId, t.id)
//                   }}
//                   className={
//                     active
//                       ? "rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-zinc-900 shadow-lg shadow-amber-500/25"
//                       : "rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all"
//                   }
//                 >
//                   {t.title}
//                 </button>
//               )
//             })}
//           </div>

//           <div className="space-y-3">
//             {topics.map((t) => {
//               const solved = progress?.solvedByTopic?.[t.id] ?? 0
//               const displayTarget = Math.max(1, Math.floor(TARGET / Math.max(1, topics.length)))
//               const pct = Math.min(100, (solved / displayTarget) * 100)
//               const isActive = t.id === topicId

//               return (
//                 <div
//                   key={t.id}
//                   className={`rounded-xl p-4 border transition-all ${
//                     isActive ? "bg-zinc-800 border-amber-500/50" : "bg-zinc-800/50 border-zinc-700/50"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between text-sm mb-2">
//                     <div className="font-semibold flex items-center gap-2">
//                       {isActive && <SparklesIcon className="w-4 h-4 text-amber-400" />}
//                       {t.title}
//                     </div>
//                     <div className="text-zinc-400">
//                       {solved.toLocaleString()} / {displayTarget.toLocaleString()}
//                     </div>
//                   </div>

//                   <div className="h-2 w-full rounded-full bg-zinc-700 overflow-hidden">
//                     <div
//                       className={`h-2 rounded-full transition-all ${
//                         isActive ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-zinc-500"
//                       }`}
//                       style={{ width: `${pct}%` }}
//                     />
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </section>

//         {/* Exercise */}
//         <section className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <ZapIcon className="w-5 h-5 text-amber-400" />
//               <span className="text-lg font-bold">תרגיל נוכחי</span>
//             </div>
//             {streak > 0 && (
//               <div className="flex items-center gap-1 bg-orange-500/20 px-3 py-1 rounded-full">
//                 <span className="text-orange-400 text-sm font-bold">🔥 רצף: {streak}</span>
//               </div>
//             )}
//           </div>

//           <div className="whitespace-pre-line rounded-xl bg-zinc-800 p-6 text-xl font-semibold text-center border border-zinc-700 mb-5">
//             {exercise?.prompt ?? "טוען..."}
//           </div>

//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//             <input
//               value={answerInput}
//               onChange={(e) => setAnswerInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") submitAnswer()
//               }}
//               className="flex-1 rounded-xl border-2 border-zinc-700 bg-zinc-800 px-5 py-4 text-lg font-semibold outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-500"
//               placeholder={typeof exercise?.answer === "string" ? "כתבי תשובה בצורה a/b (למשל 3/4)" : "הכנס תשובה..."}
//               inputMode="decimal"
//               autoFocus
//             />

//             <button
//               onClick={submitAnswer}
//               className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-base font-bold text-zinc-900 hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
//             >
//               בדיקה ✓
//             </button>

//             <button
//               onClick={nextExercise}
//               className="rounded-xl bg-zinc-800 px-6 py-4 text-base font-semibold text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-all"
//             >
//               דלג ⟫
//             </button>
//           </div>

//           {feedback && (
//             <div
//               className={`mt-5 rounded-xl p-4 text-center font-semibold ${
//                 feedback.ok
//                   ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
//                   : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
//               }`}
//             >
//               {feedback.msg}
//             </div>
//           )}
//         </section>

//         {/* Footer */}
//         <footer className="mt-12 text-center text-zinc-600 text-sm">
//           <div className="flex items-center justify-center gap-3">
//             <MathLogo size={20} />
//             <span>המרוץ למיליון © 2026</span>
//           </div>
//         </footer>
//       </div>
//     </main>
//   )
// }
"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"

type Topic = { id: string; title: string }

type Exercise = {
  prompt: string
  answer: number | string // מספר או "a/b"
  topicId: string
}

type ProgressData = {
  totalSolved: number
  solvedByTopic: Record<string, number>
}

const TARGET = 1_000_000 // ✅ יעד בנקודות
const POINTS_PER_EXERCISE = 100 // ✅ כל תרגיל = 500 נקודות

// ✅ נושאים חדשים לפי מה שביקשת
const GRADE_TOPICS: Record<string, Topic[]> = {
  a: [
    { id: "add_10", title: "חיבור עד 10" },
    { id: "sub_10", title: "חיסור עד 10" },
  ],
  b: [
    { id: "mul_0", title: "כפל ב־0" },
    { id: "mul_1", title: "כפל ב־1" },
    { id: "mul_2", title: "כפל ב־2" },
  ],
  c: [
    { id: "mul_4", title: "כפל עד 4" },
    { id: "div_4", title: "חילוק עד 4" },
  ],
  d: [
    { id: "scale_10", title: "כפל וחילוק ב־10" },
    { id: "scale_100", title: "כפל וחילוק ב־100" },
    { id: "scale_1000", title: "כפל וחילוק ב־1000" },
  ],
  e: [
    { id: "frac_add", title: "שברים פשוטים - חיבור" },
    { id: "frac_sub", title: "שברים פשוטים - חיסור" },
  ],
  f: [
    { id: "frac_mul", title: "כפל שברים פשוטים" },
    { id: "frac_div", title: "חילוק שברים פשוטים" },
  ],
}

const GRADE_COLORS: Record<string, { bg: string; accent: string; border: string }> = {
  a: { bg: "from-red-500/20", accent: "text-red-400", border: "border-red-500/30" },
  b: { bg: "from-blue-500/20", accent: "text-blue-400", border: "border-blue-500/30" },
  c: { bg: "from-green-500/20", accent: "text-green-400", border: "border-green-500/30" },
  d: { bg: "from-amber-500/20", accent: "text-amber-400", border: "border-amber-500/30" },
  e: { bg: "from-purple-500/20", accent: "text-purple-400", border: "border-purple-500/30" },
  f: { bg: "from-cyan-500/20", accent: "text-cyan-400", border: "border-cyan-500/30" },
}

const GRADE_ICONS: Record<string, string> = {
  a: "🏁",
  b: "🏎️",
  c: "⚡",
  d: "🔥",
  e: "🚀",
  f: "🏆",
}

function clampGradeId(raw: string) {
  const id = (raw || "").toLowerCase()
  return ["a", "b", "c", "d", "e", "f"].includes(id) ? id : "a"
}

function formatGradeName(gradeId: string) {
  const map: Record<string, string> = {
    a: "שכבה א׳",
    b: "שכבה ב׳",
    c: "שכבה ג׳",
    d: "שכבה ד׳",
    e: "שכבה ה׳",
    f: "שכבה ו׳",
  }
  return map[gradeId] ?? "שכבה"
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/* ---------- שברים ---------- */

function gcd(a: number, b: number) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a || 1
}

type Frac = { n: number; d: number }

function simp(f: Frac): Frac {
  const g = gcd(f.n, f.d)
  const n = f.n / g
  const d = f.d / g
  return d < 0 ? { n: -n, d: -d } : { n, d }
}

function fracToString(f: Frac) {
  const s = simp(f)
  return `${s.n}/${s.d}`
}

function parseFrac(input: string): Frac | null {
  const m = input.trim().match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (!m) return null
  const n = Number(m[1])
  const d = Number(m[2])
  if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null
  return simp({ n, d })
}

function randDenom() {
  const denoms = [2, 3, 4, 5, 6, 8, 10]
  return denoms[randInt(0, denoms.length - 1)]
}

function randFracProper(): Frac {
  const d = randDenom()
  const n = randInt(1, d - 1)
  return simp({ n, d })
}

function addFrac(a: Frac, b: Frac): Frac {
  return simp({ n: a.n * b.d + b.n * a.d, d: a.d * b.d })
}

function subFrac(a: Frac, b: Frac): Frac {
  return simp({ n: a.n * b.d - b.n * a.d, d: a.d * b.d })
}

function mulFrac(a: Frac, b: Frac): Frac {
  return simp({ n: a.n * b.n, d: a.d * b.d })
}

function divFrac(a: Frac, b: Frac): Frac {
  // b הוא שבר תקין (מגרילים proper => n!=0), אבל נשמור בטיחות
  if (b.n === 0) return simp({ n: 0, d: 1 })
  return simp({ n: a.n * b.d, d: a.d * b.n })
}

/* ---------- Last topic local storage ---------- */

function lastTopicStorageKey(gradeId: string) {
  return `race_last_topic_${gradeId}`
}

function loadLastTopicId(gradeId: string) {
  try {
    return localStorage.getItem(lastTopicStorageKey(gradeId)) || ""
  } catch {
    return ""
  }
}

function saveLastTopicId(gradeId: string, topicId: string) {
  try {
    localStorage.setItem(lastTopicStorageKey(gradeId), topicId)
  } catch {}
}

/* ---------- Cloud progress ---------- */

async function fetchCloudProgress(gradeId: string, topicIds: string[]) {
  const res = await fetch(`/api/progress/get?gradeId=${gradeId}`, { cache: "no-store" })
  const json = await res.json()
  const row = json?.data
  if (!row) return null

  const solvedByTopic: Record<string, number> = { ...(row.solved_by_topic ?? {}) }
  for (const t of topicIds) {
    if (typeof solvedByTopic[t] !== "number") solvedByTopic[t] = 0
  }

  return {
    totalSolved: Number(row.total_solved ?? 0),
    solvedByTopic,
  } as ProgressData
}

/* ---------- Generate exercise by grade/topic ---------- */

function generateExercise(gradeId: string, topicId: string): Exercise {
  // שכבה א׳ - חיבור/חיסור עד 10
  if (gradeId === "a") {
    if (topicId === "add_10") {
      const a = randInt(0, 10)
      const b = randInt(0, 10 - a)
      return { prompt: `${a} + ${b} = ?`, answer: a + b, topicId }
    }
    const a = randInt(0, 10)
    const b = randInt(0, a)
    return { prompt: `${a} - ${b} = ?`, answer: a - b, topicId }
  }

  // שכבה ב׳ - כפל ב-0/1/2
  if (gradeId === "b") {
    const a = randInt(0, 12)
    if (topicId === "mul_0") return { prompt: `${a} × 0 = ?`, answer: 0, topicId }
    if (topicId === "mul_1") return { prompt: `${a} × 1 = ?`, answer: a, topicId }
    return { prompt: `${a} × 2 = ?`, answer: a * 2, topicId } // mul_2
  }

  // שכבה ג׳ - כפל/חילוק עד 4
  if (gradeId === "c") {
    if (topicId === "mul_4") {
      const a = randInt(0, 10)
      const b = randInt(0, 4)
      return { prompt: `${a} × ${b} = ?`, answer: a * b, topicId }
    }
    // div_4
    const b = randInt(1, 4)
    const ans = randInt(0, 10)
    const a = b * ans
    return { prompt: `${a} ÷ ${b} = ?`, answer: ans, topicId }
  }

  // שכבה ד׳ - כפל/חילוק ב-10/100/1000
  if (gradeId === "d") {
    const k = topicId === "scale_10" ? 10 : topicId === "scale_100" ? 100 : 1000

    if (Math.random() < 0.5) {
      const a = randInt(1, 200)
      return { prompt: `${a} × ${k} = ?`, answer: a * k, topicId }
    } else {
      const ans = randInt(1, 200)
      const a = ans * k
      return { prompt: `${a} ÷ ${k} = ?`, answer: ans, topicId }
    }
  }

  // שכבה ה׳ - חיבור/חיסור שברים פשוטים
  if (gradeId === "e") {
    const a = randFracProper()
    const b = randFracProper()

    if (topicId === "frac_add") {
      const c = addFrac(a, b)
      return { prompt: `${fracToString(a)} + ${fracToString(b)} = ?`, answer: fracToString(c), topicId }
    }

    // frac_sub - נוודא חיובי
    let x = a
    let y = b
    const diff = subFrac(x, y)
    if (diff.n < 0) {
      x = b
      y = a
    }
    const c = subFrac(x, y)
    return { prompt: `${fracToString(x)} - ${fracToString(y)} = ?`, answer: fracToString(c), topicId }
  }

  // שכבה ו׳ - כפל/חילוק שברים פשוטים
  if (gradeId === "f") {
    const a = randFracProper()
    const b = randFracProper()

    if (topicId === "frac_mul") {
      const c = mulFrac(a, b)
      return { prompt: `${fracToString(a)} × ${fracToString(b)} = ?`, answer: fracToString(c), topicId }
    }

    // frac_div
    const c = divFrac(a, b)
    return { prompt: `${fracToString(a)} ÷ ${fracToString(b)} = ?`, answer: fracToString(c), topicId }
  }

  // fallback
  const a = randInt(1, 10)
  const b = randInt(1, 10)
  return { prompt: `${a} + ${b} = ?`, answer: a + b, topicId }
}

/* ---------- UI Icons ---------- */

function MathLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="relative rounded-full overflow-hidden border-2 border-zinc-600" style={{ width: size, height: size }}>
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="bg-red-500 flex items-center justify-center text-white font-bold" style={{ fontSize: size / 4 }}>
          ×
        </div>
        <div className="bg-green-500 flex items-center justify-center text-white font-bold" style={{ fontSize: size / 4 }}>
          =
        </div>
        <div className="bg-blue-500 flex items-center justify-center text-white font-bold" style={{ fontSize: size / 4 }}>
          ÷
        </div>
        <div className="bg-amber-500 flex items-center justify-center text-white font-bold" style={{ fontSize: size / 4 }}>
          +
        </div>
      </div>
    </div>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function RotateCcwIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6M23 20v-6h-6" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.49 9A9 9 0 105.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
      />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3h14M7 3v5a5 5 0 0010 0V3M5 3a2 2 0 00-2 2v2a4 4 0 004 4M19 3a2 2 0 012 2v2a4 4 0 01-4 4M12 13v4M8 21h8M10 17h4"
      />
    </svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7z"
      />
    </svg>
  )
}

/* ---------- Page ---------- */

export default function GradePage() {
  const p = useParams<{ gradeId?: string }>()
  const gradeId = clampGradeId(p?.gradeId ?? "a")
  const gradeName = formatGradeName(gradeId)
  const colors = GRADE_COLORS[gradeId] || GRADE_COLORS.a
  const gradeIcon = GRADE_ICONS[gradeId] || "🏁"

  const topics = useMemo(() => GRADE_TOPICS[gradeId] ?? GRADE_TOPICS.a, [gradeId])
  const topicIds = useMemo(() => topics.map((t) => t.id), [topics])

  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [topicId, setTopicId] = useState<string>(topics[0]?.id ?? topicIds[0] ?? "add_10")

  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [answerInput, setAnswerInput] = useState<string>("")
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)
  const [streak, setStreak] = useState(0)

  // נושא אחרון (מקומי)
  useEffect(() => {
    const last = loadLastTopicId(gradeId)
    const preferred = last && topicIds.includes(last) ? last : (topics[0]?.id ?? topicIds[0])
    setTopicId(preferred)
  }, [gradeId, topicIds, topics])

  // progress גלובלי מהענן (polling)
  useEffect(() => {
    let alive = true

    const refresh = async () => {
      const pr = await fetchCloudProgress(gradeId, topicIds)
      if (!alive || !pr) return
      setProgress(pr)
    }

    refresh()
    const id = window.setInterval(refresh, 5000)

    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [gradeId, topicIds])

  // יצירת תרגיל חדש כשהנושא משתנה
  useEffect(() => {
    if (!topicId) return
    setExercise(generateExercise(gradeId, topicId))
    setAnswerInput("")
    setFeedback(null)
  }, [gradeId, topicId])

  // ✅ נקודות גלובליות
  const totalSolved = progress?.totalSolved ?? 0
  const totalPoints = totalSolved * POINTS_PER_EXERCISE
  const totalPct = Math.min(100, (totalPoints / TARGET) * 100)

  function nextExercise() {
    setExercise(generateExercise(gradeId, topicId))
    setAnswerInput("")
    setFeedback(null)
  }

  async function submitAnswer() {
    if (!exercise || !progress) return

    const normalized = answerInput.trim()
    if (!normalized) {
      setFeedback({ ok: false, msg: "נא להכניס תשובה" })
      return
    }

    const expected = exercise.answer

    // מספר
    if (typeof expected === "number") {
      const user = Number(normalized)
      if (!Number.isFinite(user)) {
        setFeedback({ ok: false, msg: "התשובה חייבת להיות מספר" })
        return
      }
      if (user !== expected) {
        setFeedback({ ok: false, msg: "לא נכון. נסו שוב 🙂" })
        setStreak(0)
        return
      }
    } else {
      // שבר "a/b"
      const userF = parseFrac(normalized)
      if (!userF) {
        setFeedback({ ok: false, msg: "בשברים יש לרשום בצורה a/b (לדוגמה 3/4)" })
        return
      }
      const expF = parseFrac(expected)
      if (!expF || userF.n !== expF.n || userF.d !== expF.d) {
        setFeedback({ ok: false, msg: "לא נכון. נסו שוב 🙂" })
        setStreak(0)
        return
      }
    }

    saveLastTopicId(gradeId, topicId)

    // ✅ עדכון מיידי במסך (אופטימי): יזיז את כל הגרפים ב־+500 מיד
    setProgress((prev) => {
      if (!prev) return prev
      return {
        totalSolved: prev.totalSolved + 1,
        solvedByTopic: {
          ...prev.solvedByTopic,
          [exercise.topicId]: (prev.solvedByTopic[exercise.topicId] ?? 0) + 1,
        },
      }
    })

    try {
      await fetch("/api/progress/increment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gradeId, topicId: exercise.topicId }),
      })
      // לא חייבים למשוך מיד (הפולינג ישווה), אבל נשאיר דיוק:
      const pr = await fetchCloudProgress(gradeId, topicIds)
      if (pr) setProgress(pr)
    } catch {
      // אם יש תקלה רגעית - לא מפילים את המשחק
    }

    setStreak((s) => {
      const next = s + 1
      setFeedback({ ok: true, msg: next >= 3 ? `מדהים! רצף של ${next}! 🔥` : "נכון! ✅ +500" })
      return next
    })

    setTimeout(() => nextExercise(), 450)
  }

  function resetProgress() {
    // איפוס מקומי בלבד: רצף + הודעה + נושא אחרון
    setFeedback(null)
    setStreak(0)
    saveLastTopicId(gradeId, topics[0]?.id ?? topicIds[0] ?? "")
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      {/* Racing stripes */}
      <div className="fixed top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 z-50" />
      <div className="fixed top-0 right-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 z-50" />

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <a
            href="/"
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 transition-all"
          >
            <ArrowRightIcon className="w-4 h-4" />
            חזרה לבית
          </a>

          <button
            onClick={resetProgress}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-red-400"
            title="איפוס רצף ונושא במחשב הזה"
          >
            <RotateCcwIcon className="w-4 h-4" />
            איפוס
          </button>
        </div>

        {/* Header */}
        <header className={`mb-8 rounded-2xl bg-gradient-to-br ${colors.bg} to-zinc-900 p-6 border ${colors.border}`}>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-5xl">{gradeIcon}</div>
            <div>
              <h1 className="text-3xl font-black text-white">{gradeName}</h1>
              <p className="text-zinc-400">תרגילים ואתגרים מתמטיים</p>
            </div>
            <div className="mr-auto">
              <MathLogo size={48} />
            </div>
          </div>
        </header>

        {/* Overall Progress */}
        <section className="mb-6 rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <TrophyIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-lg font-bold">התקדמות כללית (גלובלי)</div>
                <div className="text-sm text-zinc-500">
                  {totalPoints.toLocaleString()} / {TARGET.toLocaleString()} נקודות
                </div>
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400">{totalPct.toFixed(3)}%</div>
          </div>

          <div className="h-4 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-500 relative"
              style={{ width: `${totalPct}%` }}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_15px,rgba(255,255,255,0.1)_15px,rgba(255,255,255,0.1)_30px)]" />
            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="mb-6 rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <TargetIcon className="w-5 h-5 text-amber-400" />
            <span className="text-lg font-bold">נושאים</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {topics.map((t) => {
              const active = t.id === topicId
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTopicId(t.id)
                    saveLastTopicId(gradeId, t.id)
                  }}
                  className={
                    active
                      ? "rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-zinc-900 shadow-lg shadow-amber-500/25"
                      : "rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all"
                  }
                >
                  {t.title}
                </button>
              )
            })}
          </div>

          <div className="space-y-3">
            {topics.map((t) => {
              const solved = progress?.solvedByTopic?.[t.id] ?? 0
              const solvedPoints = solved * POINTS_PER_EXERCISE

              // ✅ יעד לנושא בנקודות (מחלקים את מיליון הנקודות בין הנושאים)
              const displayTargetPoints = Math.max(1, Math.floor(TARGET / Math.max(1, topics.length)))
              const pct = Math.min(100, (solvedPoints / displayTargetPoints) * 100)

              const isActive = t.id === topicId

              return (
                <div
                  key={t.id}
                  className={`rounded-xl p-4 border transition-all ${
                    isActive ? "bg-zinc-800 border-amber-500/50" : "bg-zinc-800/50 border-zinc-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="font-semibold flex items-center gap-2">
                      {isActive && <SparklesIcon className="w-4 h-4 text-amber-400" />}
                      {t.title}
                    </div>
                    <div className="text-zinc-400">
                      {solvedPoints.toLocaleString()} / {displayTargetPoints.toLocaleString()} נק׳
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-zinc-700 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isActive ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-zinc-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Exercise */}
        <section className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ZapIcon className="w-5 h-5 text-amber-400" />
              <span className="text-lg font-bold">תרגיל נוכחי</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/20 px-3 py-1 rounded-full">
                <span className="text-orange-400 text-sm font-bold">🔥 רצף: {streak}</span>
              </div>
            )}
          </div>

          <div className="whitespace-pre-line rounded-xl bg-zinc-800 p-6 text-xl font-semibold text-center border border-zinc-700 mb-5">
            {exercise?.prompt ?? "טוען..."}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitAnswer()
              }}
              className="flex-1 rounded-xl border-2 border-zinc-700 bg-zinc-800 px-5 py-4 text-lg font-semibold outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-500"
              placeholder={typeof exercise?.answer === "string" ? "כתבי תשובה בצורה a/b (למשל 3/4)" : "הכנס תשובה..."}
              inputMode={typeof exercise?.answer === "string" ? "text" : "decimal"}
              autoFocus
            />

            <button
              onClick={submitAnswer}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-base font-bold text-zinc-900 hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25"
            >
              בדיקה ✓
            </button>

            <button
              onClick={nextExercise}
              className="rounded-xl bg-zinc-800 px-6 py-4 text-base font-semibold text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-all"
            >
              דלג ⟫
            </button>
          </div>

          {feedback && (
            <div
              className={`mt-5 rounded-xl p-4 text-center font-semibold ${
                feedback.ok
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}
            >
              {feedback.msg}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-zinc-600 text-sm">
          <div className="flex items-center justify-center gap-3">
            <MathLogo size={20} />
            <span>המרוץ למיליון © 2026</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
