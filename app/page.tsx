
// "use client"

// import { useEffect, useMemo, useState } from "react"
// import Image from "next/image"

// const TARGET = 1_000_000

// type GradeInfo = { id: string; name: string; icon: string }

// type ProgressData = {
//   totalSolved?: number
//   solvedByTopic?: Record<string, number>
//   lastTopicId?: string
// }

// function storageKey(gradeId: string) {
//   return `race_progress_${gradeId}`
// }

// function loadTotalSolved(gradeId: string): number {
//   try {
//     const raw = localStorage.getItem(storageKey(gradeId))
//     if (!raw) return 0
//     const parsed = JSON.parse(raw) as ProgressData
//     return Number(parsed.totalSolved || 0)
//   } catch {
//     return 0
//   }
// }

// function ProgressBar({ value, max }: { value: number; max: number }) {
//   const pct = Math.min(100, (value / max) * 100)

//   return (
//     <div>
//       <div className="mb-2 flex items-center justify-between text-xs text-amber-200/70">
//         <span>{value.toLocaleString()}</span>
//         <span>{max.toLocaleString()}</span>
//       </div>

//       <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
//         <div
//           className="h-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-500 relative"
//           style={{ width: `${pct}%` }}
//         >
//           <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
//         </div>
//       </div>

//       <div className="mt-2 text-sm font-bold text-amber-400">{pct.toFixed(3)}%</div>
//     </div>
//   )
// }

// function MathLogo({ size = 48 }: { size?: number }) {
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

// function CheckeredFlag() {
//   return (
//     <div className="w-8 h-10 relative">
//       <div className="absolute inset-0 grid grid-cols-4 grid-rows-5">
//         {Array.from({ length: 20 }).map((_, i) => (
//           <div key={i} className={`${(Math.floor(i / 4) + i) % 2 === 0 ? "bg-white" : "bg-zinc-900"}`} />
//         ))}
//       </div>
//     </div>
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

// function ZapIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
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

// function ChevronLeftIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//     </svg>
//   )
// }

// export default function HomePage() {
//   useEffect(() => {
//     ; (async () => {
//       const res = await fetch("/api/progress/get")
//       const json = await res.json()
//       console.log("DB TEST VIA API:", json)
//     })()
//   }, [])

//   const grades: GradeInfo[] = useMemo(
//     () => [
//       { id: "a", name: "שכבה א׳", icon: "🏁" },
//       { id: "b", name: "שכבה ב׳", icon: "🏎️" },
//       { id: "c", name: "שכבה ג׳", icon: "⚡" },
//       { id: "d", name: "שכבה ד׳", icon: "🔥" },
//       { id: "e", name: "שכבה ה׳", icon: "🚀" },
//       { id: "f", name: "שכבה ו׳", icon: "🏆" },
//     ],
//     [],
//   )

//   const [totals, setTotals] = useState<Record<string, number>>({})
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)

//     const refresh = async () => {
//       try {
//         const res = await fetch("/api/progress/get", { cache: "no-store" })
//         const json = await res.json()

//         const next: Record<string, number> = {}
//         for (const row of json?.data ?? []) {
//           const POINTS_PER_EXERCISE = 500
//           next[row.grade_id] = Number(row.total_solved ?? 0) * POINTS_PER_EXERCISE

//         }
//         setTotals(next)
//       } catch {
//         // לא מפילים את האתר אם יש בעיית רשת
//       }
//     }

//     refresh()
//     const id = setInterval(refresh, 5000) // כמעט realtime
//     return () => clearInterval(id)
//   }, [])


//   const totalAll = Object.values(totals).reduce((a, b) => a + b, 0)

//   return (
//     <main className="min-h-screen bg-zinc-950 text-white" dir="rtl">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_50px,rgba(255,255,255,0.1)_50px,rgba(255,255,255,0.1)_100px)]" />
//         </div>

//         {/* Racing stripes */}
//         <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500" />
//         <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500" />

//         <div className="relative mx-auto max-w-6xl px-6 py-12">
//           {/* Header with Logo */}
//           <header className="text-center mb-12">
//             <div className="flex items-center justify-center gap-6 mb-6">
//               <CheckeredFlag />
//               <div className="relative overflow-hidden rounded-2xl border border-zinc-700 shadow-xl shadow-black/40">
//                 <Image
//                   src="/logo.jpg"
//                   alt="לוגו המרוץ למיליון"
//                   width={560}
//                   height={140}
//                   priority
//                   className="h-[120px] w-auto object-contain"
//                 />
//               </div>

//               <CheckeredFlag />
//             </div>

//             <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-3">
//               המרוץ למיליון
//             </h1>
//             <p className="text-xl text-amber-500 font-semibold mb-2">אופק מתמטי 2026</p>
//             <p className="text-zinc-400">שערי ציון רמלה</p>
//           </header>


//           {/* Description */}
//           <div className="text-center mb-10">
//             <p className="text-zinc-300 text-lg max-w-2xl mx-auto">בוחרים שכבה, פותרים תרגילים, ועוקבים אחרי ההתקדמות! 🏁</p>
//           </div>

//           {/* Grade Cards */}
//           <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//             {grades.map((g, index) => {
//               const solved = totals[g.id] ?? 0
//               const colors = [
//                 "from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/60",
//                 "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60",
//                 "from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/60",
//                 "from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60",
//                 "from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/60",
//                 "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/60",
//               ]

//               return (
//                 <a
//                   key={g.id}
//                   href={`/grade/${g.id}`}
//                   className={`group relative rounded-2xl bg-gradient-to-br ${colors[index]} backdrop-blur-sm p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50`}
//                 >
//                   <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <ChevronLeftIcon className="w-5 h-5 text-zinc-400" />
//                   </div>

//                   <div className="mb-5 flex items-center gap-4">
//                     <div className="text-4xl">{g.icon}</div>
//                     <div>
//                       <div className="text-2xl font-bold text-white">{g.name}</div>
//                       <div className="text-sm text-zinc-400">כניסה לאזור השכבה</div>
//                     </div>
//                   </div>

//                   <div className="rounded-xl bg-zinc-900/80 p-4 border border-zinc-800">
//                     <div className="mb-3 flex items-center gap-2">
//                       <TargetIcon className="w-4 h-4 text-amber-400" />
//                       <span className="text-sm font-semibold text-zinc-300">התקדמות השכבה</span>
//                     </div>
//                     <ProgressBar value={solved} max={TARGET} />
//                   </div>

//                   <div className="mt-4 flex items-center justify-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
//                     <span>התחל לתרגל</span>
//                     <ZapIcon className="w-4 h-4" />
//                   </div>
//                 </a>
//               )
//             })}
//           </section>

//           {/* Footer */}
//           <footer className="mt-16 text-center text-zinc-600 text-sm">
//             <div className="flex items-center justify-center gap-3 mb-2">
//               <MathLogo size={24} />
//               <span>המרוץ למיליון © 2026</span>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </main>
//   )
// }
"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"

const TARGET = 1_000_000
const POINTS_PER_EXERCISE = 100 // ⭐ 100 נק׳ לתרגיל (גם בדף הבית)

type GradeInfo = { id: string; name: string; icon: string }

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-amber-200/70">
        <span>{value.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>

      <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-500 relative"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
        </div>
      </div>

      <div className="mt-2 text-sm font-bold text-amber-400">{pct.toFixed(3)}%</div>
    </div>
  )
}

function MathLogo({ size = 48 }: { size?: number }) {
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

function CheckeredFlag() {
  return (
    <div className="w-8 h-10 relative">
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`${(Math.floor(i / 4) + i) % 2 === 0 ? "bg-white" : "bg-zinc-900"}`} />
        ))}
      </div>
    </div>
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

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

export default function HomePage() {
  const grades: GradeInfo[] = useMemo(
    () => [
      { id: "a", name: "שכבה א׳", icon: "🏁" },
      { id: "b", name: "שכבה ב׳", icon: "🏎️" },
      { id: "c", name: "שכבה ג׳", icon: "⚡" },
      { id: "d", name: "שכבה ד׳", icon: "🔥" },
      { id: "e", name: "שכבה ה׳", icon: "🚀" },
      { id: "f", name: "שכבה ו׳", icon: "🏆" },
    ],
    [],
  )

  // totals מחזיק נקודות (לא תרגילים)
  const [totals, setTotals] = useState<Record<string, number>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const refresh = async () => {
      try {
        const res = await fetch("/api/progress/get", { cache: "no-store" })
        const json = await res.json()

        const next: Record<string, number> = {}
        for (const row of json?.data ?? []) {
          next[row.grade_id] = Number(row.total_solved ?? 0) * POINTS_PER_EXERCISE
        }
        setTotals(next)
      } catch {
        // ignore
      }
    }

    refresh()
    const id = setInterval(refresh, 5000)
    return () => clearInterval(id)
  }, [])

  const totalAll = Object.values(totals).reduce((a, b) => a + b, 0)

  return (
    <main className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_50px,rgba(255,255,255,0.1)_50px,rgba(255,255,255,0.1)_100px)]" />
        </div>

        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500" />
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500" />

        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-6 mb-6">
              <CheckeredFlag />

              <div className="relative overflow-hidden rounded-2xl border border-zinc-700 shadow-xl shadow-black/40">
                <Image
                  src="/logo.jpg"
                  alt="לוגו המרוץ למיליון"
                  width={560}
                  height={140}
                  priority
                  className="h-[120px] w-auto object-contain"
                />
              </div>

              <CheckeredFlag />
            </div>

            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-3">
              המרוץ למיליון
            </h1>
            <p className="text-xl text-amber-500 font-semibold mb-2">אופק מתמטי 2026</p>
            <p className="text-zinc-400">שערי ציון רמלה</p>

            <div className="mt-6 text-sm text-zinc-400">
              תרגיל = <span className="text-amber-400 font-bold">{POINTS_PER_EXERCISE}</span> נק׳ • סה״כ כל השכבות:{" "}
              <span className="text-amber-400 font-bold">{totalAll.toLocaleString()}</span> נק׳
            </div>
          </header>

          <div className="text-center mb-10">
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto">בוחרים שכבה, פותרים תרגילים, ועוקבים אחרי ההתקדמות! 🏁</p>
          </div>

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grades.map((g, index) => {
              const points = totals[g.id] ?? 0

              const colors = [
                "from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/60",
                "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60",
                "from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/60",
                "from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60",
                "from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/60",
                "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/60",
              ]

              return (
                <a
                  key={g.id}
                  href={`/grade/${g.id}`}
                  className={`group relative rounded-2xl bg-gradient-to-br ${colors[index]} backdrop-blur-sm p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50`}
                >
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeftIcon className="w-5 h-5 text-zinc-400" />
                  </div>

                  <div className="mb-5 flex items-center gap-4">
                    <div className="text-4xl">{g.icon}</div>
                    <div>
                      <div className="text-2xl font-bold text-white">{g.name}</div>
                      <div className="text-sm text-zinc-400">כניסה לאזור השכבה</div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-900/80 p-4 border border-zinc-800">
                    <div className="mb-3 flex items-center gap-2">
                      <TargetIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-zinc-300">התקדמות השכבה (נקודות)</span>
                    </div>

                    <ProgressBar value={points} max={TARGET} />

                    <div className="mt-3 text-xs text-zinc-500">
                      {mounted ? (
                        <>
                          נקודות: <span className="text-zinc-300 font-semibold">{points.toLocaleString()}</span>
                        </>
                      ) : (
                        "טוען..."
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
                    <span>התחל לתרגל</span>
                    <ZapIcon className="w-4 h-4" />
                  </div>
                </a>
              )
            })}
          </section>

          <footer className="mt-16 text-center text-zinc-600 text-sm">
            <div className="flex items-center justify-center gap-3 mb-2">
              <MathLogo size={24} />
              <span>המרוץ למיליון © 2026</span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
