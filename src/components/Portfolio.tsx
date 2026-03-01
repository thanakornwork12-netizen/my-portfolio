"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
      :root {
        --ff-display: 'Playfair Display', Georgia, serif;
        --ff-mono: 'DM Mono', 'Courier New', monospace;
        --ff-impact: 'Bebas Neue', Impact, sans-serif;
        --white:   #f5f4ef;
        --black:   #080806;
        --bg:      #f5f4ef;
        --bg-dark: #080806;
        --mid:     #8a8a8a;
        --rule:    #d4d4d0;
        --amber:   #f59e0b;
        --rose:    #f43f5e;
        --sky:     #0ea5e9;
        --emerald: #10b981;
        --violet:  #8b5cf6;
        --pink:    #ec4899;
        --orange:  #f97316;
        --cyan:    #06b6d4;
        --lime:    #a3e635;
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
      body { background: var(--bg); color: var(--black); overflow-x: hidden; }
      ::selection { background: var(--black); color: var(--white); }
      a { color: inherit; text-decoration: none; }
      img { display: block; max-width: 100%; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-thumb { background: var(--amber); }

      /* Grain texture */
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.032;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 200px 200px;
      }

      .hide-mobile { display: flex; }

      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .nav-pad { padding: 16px 20px !important; }
        .section-pad { padding: 80px 20px !important; }
        .hero-pad { padding: 0 20px 60px !important; }
        .contact-grid { grid-template-columns: 1fr !important; gap: 32px 0 !important; }
        .skills-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
        .project-modal { width: 100vw !important; }
        .footer-row { flex-direction: column !important; gap: 8px !important; }
        .mosaic-row { grid-template-columns: 1fr !important; }
        .mosaic-stack { grid-template-rows: auto auto !important; }
        .proj-card-inner { grid-template-columns: 1fr !important; }
        .hero-num { font-size: clamp(100px, 30vw, 200px) !important; }
      }
      @media (min-width: 769px) and (max-width: 1024px) {
        .section-pad { padding: 80px 32px !important; }
        .hero-pad { padding: 0 32px 70px !important; }
      }

      /* Marquee */
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .marquee-track { animation: marquee 18s linear infinite; display: flex; white-space: nowrap; }

      /* Cursor blink */
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    `}</style>
  )
}

const ACTIVITIES = [
  { no: "01", year: "2024", title: "สตาฟรับน้องรุ่น 2568", role: "Staff / Organizer", tags: ["Leadership", "University", "Event"], accent: "var(--amber)", image: "images/สตาฟรับน้องรุ่น 2568.JPG" },
  { no: "02", year: "2024", title: "พิธีกรในงาน IT Night 2568", role: "Master of Ceremony", tags: ["Presentation", "Public Speaking"], accent: "var(--sky)", image: "images/พิธีกรในงาน it night 2568.JPG" },
  { no: "03", year: "2024", title: "แข่งขันการเขียนโปรแกรมคอมพิวเตอร์", role: "Competitor", tags: ["Programming", "Python"], accent: "var(--rose)", image: "images/แข่งขันการเขียนโปรแกรมคอมพิวเตอร์ด้วยภาษาpython.JPEG" },
  { no: "04", year: "2024", title: "แข่งขันบาสเกตบอล SCI", role: "Athlete", tags: ["Sports", "Teamwork"], accent: "var(--emerald)", image: "images/แข่งขันบาสเกตบอลภายในคณะ.jpg" },
  { no: "05", year: "2024", title: "แข่งขันฟุตซอลปี 2568", role: "Athlete", tags: ["Football", "Teamwork"], accent: "var(--violet)", image: "images/แข่งขันฟุตซอลปี 2568.JPG" },
  { no: "06", year: "2023", title: "ดนตรีในงาน IT Night 2567", role: "Performer", tags: ["Music", "Stage"], accent: "var(--pink)", image: "images/ดนตรีในงาน it night 2567.JPEG" },
  { no: "07", year: "2024", title: "ถ่ายทำโครงการของคณะวิทย์", role: "Media Team", tags: ["Media", "Production"], accent: "var(--cyan)", image: "images/ถ่ายทำโครงการของคณะวิทย์.JPG" },
  { no: "08", year: "2024", title: "เดินขบวนวันวิทยาศาสตร์", role: "Representative", tags: ["Ceremony", "Activity"], accent: "var(--orange)", image: "images/ถือป้ายในงานเดินขบวนวิทยาศาตร์.JPEG" },
  { no: "09", year: "2024", title: "Open House 2568", role: "Staff", tags: ["Open House", "Event"], accent: "var(--amber)", image: "images/open house 2568.jpg" },
  { no: "10", year: "2023", title: "สตาฟในงาน Open House 2567", role: "Staff", tags: ["Open House", "University"], accent: "var(--sky)", image: "images/สตาฟในงาน open house 2567.JPG" },
  { no: "11", year: "2024", title: "แข่งขันฟุตซอล SCI", role: "Athlete", tags: ["Football", "Teamwork"], accent: "var(--emerald)", image: "images/แข่งขันฟุตซอล SCi.JPEG" },
  { no: "12", year: "2024", title: "วิ่งงานโนนคูณ 2568", role: "Participant", tags: ["Marathon", "Sports", "Endurance"], accent: "var(--emerald)", image: "images/วิ่งงานโนนคูณ.JPG" },
  { no: "13", year: "2024", title: "ถ่ายคลิปโปรโมทกิจกรรม", role: "Content Creator", tags: ["Media", "Video Production", "Creative"], accent: "var(--emerald)", image: "images/ถ่ายคลิปโมทโมท.jpg" },
]

const PROJECTS = [
  {
    no: "01", title: "DadBuddy Mobile Application", client: "Boromarajonani College of Nursing, Yala", year: "2024",
    tags: ["Flutter", "Firebase", "Hive", "Mobile App"], accent: "var(--emerald)",
    imageBg: "linear-gradient(135deg,#10b98128,#10b98106)",
    images: ["images/dadbuddy1.png","images/dadbuddylogin.png","images/dadbuddy2.png","images/dadbuddy3.png","images/dadbuddy4.png","images/dadbuddy5.png","images/dadbuddy6.png","images/dadbuddy7.png"],
    shortDesc: "แอปสำหรับคุณพ่อมือใหม่ เรียนรู้การดูแลทารก พร้อมระบบเก็บข้อมูลออนไลน์และออฟไลน์",
    fullDesc: `DadBuddy เป็นแอปพลิเคชันสำหรับคุณพ่อมือใหม่\nที่พัฒนาขึ้นเพื่อส่งเสริมความรู้ด้านการดูแลทารก\nและเสริมสร้างความมั่นใจในการเลี้ยงดูบุตรอย่างถูกต้อง\n\n• **Learning Modules** — รวมบทเรียนเกี่ยวกับการอุ้มทารก การอาบน้ำ การให้นม\n\n• **Progress Tracking** — บันทึก Favorite ติดตามบทเรียนที่เรียนจบแล้ว\n\n• **Cloud Logging (Firebase)** — จัดเก็บ Log การใช้งานบน Cloud\n\n• **Offline Storage (Hive)** — จัดเก็บข้อมูลแบบออฟไลน์`,
    outcome: "ช่วยเพิ่มความมั่นใจให้คุณพ่อมือใหม่", duration: "3 เดือน", link: "#",
  },
  {
    no: "02", title: "Part-Time Staff – The Pizza Company", client: "The Pizza Company", year: "2024",
    tags: ["Order Management", "Delivery Coordination", "Customer Service"], accent: "var(--rose)",
    imageBg: "linear-gradient(135deg,#f43f5e28,#f43f5e06)",
    images: ["images/pizza4.JPG","images/pizza1.JPG","images/pizza2.JPG","images/pizza3.JPG"],
    shortDesc: "ดูแลจัดการออเดอร์และประสานงานการจัดส่งในช่วงเวลาเร่งด่วน",
    fullDesc: `ปฏิบัติงานในตำแหน่งพนักงานพาร์ทไทม์ที่ The Pizza Company\n\n• **Order Management** — ตรวจสอบออเดอร์ทั้งหน้าร้านและเดลิเวอรี่\n\n• **Delivery Coordination** — ประสานงานกับไรเดอร์และทีมครัว\n\n• **Quality Control** — ตรวจสอบความถูกต้องของสินค้า\n\n• **Peak Hour Handling** — บริหารจัดการออเดอร์จำนวนมากในช่วงเวลาเร่งด่วน`,
    outcome: "จัดการออเดอร์ได้แม่นยำและตรงเวลา", duration: "2 เดือน", link: "#",
  },
  {
    no: "03", title: "UBU Green – Campus Sustainability Platform", client: "Ubon Ratchathani University", year: "2026",
    tags: ["Web App", "Sustainability", "Dashboard", "Gamification"], accent: "var(--lime)",
    imageBg: "linear-gradient(135deg,#a3e63528,#a3e63506)",
    images: ["images/ubugreen.png"],
    shortDesc: "แพลตฟอร์มส่งเสริมพฤติกรรมรักษ์โลก พร้อมระบบสะสมแต้มและ dashboard วิเคราะห์ข้อมูล",
    fullDesc: `UBU Green เป็นแพลตฟอร์มสนับสนุนแนวคิด Green University\n\n• **Activity Tracking** — บันทึกกิจกรรมรักษ์โลก\n\n• **Point & Reward System** — ระบบสะสมคะแนน Gamification\n\n• **Dashboard & Analytics** — แสดงสถิติการมีส่วนร่วม\n\n• **User-Centered Design** — รองรับมือถือและเดสก์ท็อป`,
    outcome: "เพิ่มการมีส่วนร่วมในกิจกรรมสิ่งแวดล้อม", duration: "2 เดือน", link: "#",
  },
  {
    no: "04", title: "Photography Portfolio", client: "Freelance Photographer", year: "2023",
    tags: ["Next.js", "Framer Motion", "Cloudinary"], accent: "var(--violet)",
    imageBg: "linear-gradient(135deg,#8b5cf628,#8b5cf606)",
    images: [] as string[],
    shortDesc: "เว็บ portfolio รูปภาพ โหลดเร็ว gallery masonry และ lightbox full-screen",
    fullDesc: `เว็บ portfolio สำหรับช่างภาพ freelance:\n\n• **Masonry Gallery** — grid ปรับ layout อัตโนมัติ\n\n• **Lightbox** — full-screen พร้อม swipe gesture\n\n• **Cloudinary CDN** — ปรับขนาดและ format อัตโนมัติ (WebP/AVIF)\n\n• **CMS** — เพิ่มผลงานได้เองผ่าน Sanity`,
    outcome: "Lighthouse 98/100 · FCP < 0.8s", duration: "3 สัปดาห์", link: "#",
  },
]

// tier: "strong" | "good" | "learning"
const HARD_SKILLS = [
  // Strong — used in real shipped projects
  { label: "Flutter & Dart",       tier: "strong",   accent: "var(--sky)",     proof: "DadBuddy App" },
  { label: "Firebase",             tier: "strong",   accent: "var(--amber)",   proof: "DadBuddy — Cloud Logging" },
  { label: "Hive (Local Storage)", tier: "strong",   accent: "var(--orange)",  proof: "DadBuddy — Offline Data" },
  { label: "React / Next.js",      tier: "strong",   accent: "var(--rose)",    proof: "Photography Portfolio" },
  { label: "Python",               tier: "strong",   accent: "var(--emerald)", proof: "Programming Competition" },
  { label: "UI/UX Design (Figma)", tier: "strong",   accent: "var(--violet)",  proof: "DadBuddy · UBU Green" },
  // Good — used but not production-shipped solo
  { label: "TypeScript",           tier: "good",     accent: "var(--sky)",     proof: "Portfolio Projects" },
  { label: "Node.js / Express",    tier: "good",     accent: "var(--emerald)", proof: "UBU Green Backend" },
  { label: "Tailwind CSS",         tier: "good",     accent: "var(--pink)",    proof: "UBU Green · Web Projects" },

]
const SOFT_SKILLS = [
  { label: "Public Speaking & MC",    tier: "strong",   accent: "var(--amber)",   proof: "IT Night 2568 — MC บนเวที" },
  { label: "Leadership & Organizing", tier: "strong",   accent: "var(--rose)",    proof: "สตาฟรับน้อง · Open House" },
  { label: "Teamwork & Collaboration",tier: "strong",   accent: "var(--sky)",     proof: "Basketball · Futsal · Media Team" },
  { label: "Media & Video Production",tier: "strong",   accent: "var(--violet)",  proof: "ถ่ายทำโปรโมท · Content Creator" },
  { label: "Work Under Pressure",     tier: "good",     accent: "var(--emerald)", proof: "Pizza Company — Peak Hours" },
  { label: "Event Management",        tier: "good",     accent: "var(--pink)",    proof: "Open House · IT Night" },
  { label: "Attention to Detail",     tier: "good",     accent: "var(--cyan)",    proof: "QC at Pizza · App Testing" },
  { label: "Self-Directed Learning",  tier: "good",     accent: "var(--orange)",  proof: "Flutter เรียนเอง → Shipped App" },
]

// Tools grouped by project
const TOOL_GROUPS = [
  {
    project: "DadBuddy App",
    accent: "var(--emerald)",
    tools: ["Flutter", "Dart", "Firebase", "Hive", "Figma", "VS Code"],
  },
  {
    project: "UBU Green Platform",
    accent: "var(--lime)",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
  },
]

/* ─── Shared ── */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: delay * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function Mono({ children, style = {} }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ fontFamily: "var(--ff-mono)", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "var(--mid)", ...style }}>
      {children}
    </span>
  )
}

/* ─── Marquee ticker ── */
function Marquee({ items, bg, color }: { items: string[]; bg: string; color: string }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ background: bg, overflow: "hidden", padding: "12px 0", borderTop: `1px solid ${color}22`, borderBottom: `1px solid ${color}22` }}>
      <div className="marquee-track" style={{ display: "flex", gap: 0 }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "var(--ff-impact)", fontSize: 18, letterSpacing: "0.08em", color, padding: "0 24px", display: "flex", alignItems: "center", gap: 24 }}>
            {item}
            <span style={{ color: `${color}40`, fontSize: 10 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Section label strip ── */
function SectionLabel({ number, label, color = "var(--mid)" }: { number: string; label: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
      <span style={{ fontFamily: "var(--ff-impact)", fontSize: 48, color, lineHeight: 1, opacity: 0.18 }}>{number}</span>
      <div style={{ flex: 1, height: 1, background: `${color}33` }} />
      <Mono style={{ color }}>{label}</Mono>
    </div>
  )
}

/* ─── PROJECT MODAL ── */
type Project = typeof PROJECTS[0]

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0)
  const totalImgs = project?.images.length ?? 0

  useEffect(() => {
    setImgIdx(0)
    document.body.style.overflow = project ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [project])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (!project) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setImgIdx(i => Math.min(i + 1, totalImgs - 1))
      if (e.key === "ArrowLeft") setImgIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [project, onClose, totalImgs])

  const renderDesc = (text: string) =>
    text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} style={{ marginBottom: line.startsWith("•") ? "10px" : line === "" ? "14px" : "3px", fontFamily: "var(--ff-mono)", fontSize: "12px", color: "#999", lineHeight: 1.85 }}>
          {parts.map((p, j) => j % 2 === 1 ? <span key={j} style={{ color: "#e0e0e0", fontWeight: 500 }}>{p}</span> : p)}
        </p>
      )
    })

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 200, backdropFilter: "blur(12px)" }}
          />
          <motion.div key="panel"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="project-modal"
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(680px,100vw)", background: "#080806", zIndex: 201, overflowY: "auto", display: "flex", flexDirection: "column", borderLeft: `3px solid ${project.accent}` }}
          >
            {/* Accent top strip */}
            <div style={{ height: 4, background: project.accent, flexShrink: 0 }} />

            {/* Header */}
            <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#080806", borderBottom: "1px solid #1a1a1a", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "var(--ff-impact)", fontSize: 28, color: project.accent, lineHeight: 1 }}>{project.no}</span>
                <span style={{ width: 1, height: 14, background: "#2a2a2a" }} />
                <Mono style={{ color: "#555" }}>{project.year} · {project.client}</Mono>
              </div>
              <button onClick={onClose}
                style={{ width: 34, height: 34, border: `1px solid ${project.accent}40`, background: "transparent", color: "#888", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", fontFamily: "var(--ff-impact)" }}
                onMouseEnter={e => { e.currentTarget.style.background = project.accent; e.currentTarget.style.color = "#000" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888" }}
              >×</button>
            </div>

            {/* Main image */}
            {totalImgs > 0 && (
              <div style={{ position: "relative", background: "#060606", flexShrink: 0 }}>
                <AnimatePresence mode="wait">
                  <motion.img key={imgIdx} src={project.images[imgIdx]} alt={`${project.title} ${imgIdx + 1}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    style={{ width: "100%", height: "auto", display: "block", maxHeight: "70vh", objectFit: "contain" }}
                  />
                </AnimatePresence>
                {totalImgs > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => Math.max(i - 1, 0))} disabled={imgIdx === 0}
                      style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, border: `1px solid ${project.accent}44`, background: "rgba(0,0,0,0.8)", color: project.accent, cursor: imgIdx === 0 ? "default" : "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", opacity: imgIdx === 0 ? 0.25 : 1, fontFamily: "var(--ff-impact)" }}
                    >‹</button>
                    <button onClick={() => setImgIdx(i => Math.min(i + 1, totalImgs - 1))} disabled={imgIdx === totalImgs - 1}
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, border: `1px solid ${project.accent}44`, background: "rgba(0,0,0,0.8)", color: project.accent, cursor: imgIdx === totalImgs - 1 ? "default" : "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", opacity: imgIdx === totalImgs - 1 ? 0.25 : 1, fontFamily: "var(--ff-impact)" }}
                    >›</button>
                    <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.85)", border: `1px solid ${project.accent}33`, padding: "3px 14px" }}>
                      <Mono style={{ color: project.accent, fontSize: 9 }}>{imgIdx + 1} / {totalImgs}</Mono>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Thumbnail strip */}
            {totalImgs > 1 && (
              <div style={{ display: "flex", gap: 3, background: "#050505", padding: "8px 8px 10px", overflowX: "auto", flexShrink: 0 }}>
                {project.images.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ flexShrink: 0, width: 72, height: 52, padding: 0, background: "none", cursor: "pointer", border: i === imgIdx ? `2px solid ${project.accent}` : "2px solid #1e1e1e", overflow: "hidden", transition: "border-color .15s" }}
                  >
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}

            {totalImgs === 0 && (
              <div style={{ width: "100%", padding: "60px 0", background: project.imageBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--ff-impact)", fontSize: "clamp(80px,15vw,140px)", color: project.accent, opacity: 0.12, userSelect: "none", letterSpacing: "0.05em" }}>{project.no}</p>
              </div>
            )}

            {/* Body */}
            <div style={{ padding: "clamp(20px,4vw,36px)", flex: 1 }}>
              <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(22px,4vw,30px)", fontWeight: 900, letterSpacing: "-0.025em", fontStyle: "italic", color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
                {project.title}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                {project.tags.map(t => (
                  <span key={t} style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", border: `1px solid ${project.accent}60`, color: project.accent, padding: "3px 9px", background: `${project.accent}10` }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#181818", marginBottom: 28 }}>
                {[{ l: "Duration", v: project.duration }, { l: "Outcome", v: project.outcome }].map(s => (
                  <div key={s.l} style={{ padding: "16px 18px", background: "#0a0a08" }}>
                    <Mono style={{ display: "block", marginBottom: 6, color: "#3a3a3a", fontSize: 9 }}>{s.l}</Mono>
                    <p style={{ fontFamily: "var(--ff-display)", fontSize: 13, fontWeight: 700, color: project.accent, fontStyle: "italic", lineHeight: 1.4 }}>{s.v}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Mono style={{ color: "#3a3a3a", fontSize: 9 }}>Project Details</Mono>
                <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
              </div>
              <div style={{ marginBottom: 8 }}>{renderDesc(project.fullDesc)}</div>
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #1a1a1a" }}>
                <a href={project.link}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--ff-impact)", fontSize: 14, letterSpacing: "0.15em", background: project.accent, color: "#000", padding: "13px 28px", transition: "opacity .2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >VIEW LIVE ↗</a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── NAV ── */
function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => scrollY.on("change", v => setScrolled(v > 40)), [scrollY])

  return (
    <motion.nav className="nav-pad"
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.1)" : "1px solid transparent",
        background: scrolled ? "rgba(245,244,239,.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all .4s ease",
      }}
    >
      <a href="#" style={{ fontFamily: "var(--ff-impact)", fontSize: 26, letterSpacing: "0.08em", color: "var(--black)" }}>TT.</a>
      <div className="hide-mobile" style={{ alignItems: "center", gap: 32 }}>
        {[["#activities","Activities"],["#projects","Projects"],["#skills","Skills"],["#contact","Contact"]].map(([h, l]) => (
          <a key={h} href={h}
            style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--mid)", transition: "color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--black)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--mid)"}
          >{l}</a>
        ))}
        <a href="#contact"
          style={{ fontFamily: "var(--ff-impact)", fontSize: 14, letterSpacing: "0.15em", border: "2px solid var(--black)", padding: "8px 20px", transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--black)"; e.currentTarget.style.color = "var(--amber)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--black)" }}
        >HIRE ME</a>
      </div>
    </motion.nav>
  )
}

/* ─── HERO ── */
function HeroSection() {
  const { scrollY } = useScroll()
  const yPx = useTransform(scrollY, [0, 700], [0, 100])
  const op  = useTransform(scrollY, [0, 500], [1, 0])

  const [tick, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick(v => v + 1), 70); return () => clearInterval(t) }, [])
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"
  const scramble = (str: string, rev: number) =>
    str.split("").map((c, i) => i < rev ? c : c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]).join("")
  const NAME = "Thanakorn\nThongsa"
  const flat = NAME.replace("\n","")
  const rev = Math.min(tick * 0.35, flat.length)

  const [cursor, setCursor] = useState(true)
  useEffect(() => { const t = setInterval(() => setCursor(v => !v), 530); return () => clearInterval(t) }, [])

  return (
    <section className="hero-pad"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 48px 80px", position: "relative", overflow: "hidden", background: "var(--bg)" }}
    >
      {/* Big background number — watermark */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.028 }} transition={{ delay: 0.5, duration: 1.5 }}
        style={{ position: "absolute", top: "50%", right: "-5%", transform: "translateY(-50%)", fontFamily: "var(--ff-impact)", fontSize: "clamp(200px,35vw,420px)", color: "var(--black)", letterSpacing: "-0.05em", userSelect: "none", pointerEvents: "none", lineHeight: 1 }}
      >2025</motion.div>

      {/* Animated color orbs */}
      <motion.div animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "12%", right: "8%", width: "min(280px,40vw)", height: "min(280px,40vw)", borderRadius: "50%", background: "var(--amber)", opacity: 0.08, filter: "blur(80px)", pointerEvents: "none" }}
      />
      <motion.div animate={{ x: [0, -18, 0], y: [0, 20, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ position: "absolute", bottom: "15%", left: "5%", width: "min(200px,30vw)", height: "min(200px,30vw)", borderRadius: "50%", background: "var(--rose)", opacity: 0.07, filter: "blur(65px)", pointerEvents: "none" }}
      />
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{ position: "absolute", top: "45%", left: "38%", width: "min(160px,25vw)", height: "min(160px,25vw)", borderRadius: "50%", background: "var(--sky)", opacity: 0.05, filter: "blur(55px)", pointerEvents: "none" }}
      />

      {/* Corner label */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ position: "absolute", top: "clamp(90px,13vw,120px)", right: "clamp(20px,4vw,48px)", textAlign: "right", borderRight: "2px solid var(--amber)", paddingRight: 12 }}>
        <Mono style={{ display: "block", color: "var(--amber)" }}>Portfolio</Mono>
        
      </motion.div>

      <motion.div style={{ y: yPx, opacity: op }}>
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} style={{ marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--black)", padding: "6px 14px" }}>
            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--emerald)", flexShrink: 0 }}
            />
            <Mono style={{ color: "var(--white)", fontSize: 9 }}>Business Analyst</Mono>
          </div>
        </motion.div>

        {/* Giant italic name */}
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(3.2rem,12vw,11rem)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.04em", color: "var(--black)", fontStyle: "italic", marginBottom: 0 }}
        >
          {NAME.split("\n").map((line, li) => (
            <span key={li} style={{ display: "block" }}>
              {scramble(line + (li === 0 ? "" : ""), rev - (li === 0 ? 0 : NAME.split("\n")[0].length))}
              {li === 1 && <span style={{ opacity: cursor ? 1 : 0, color: "var(--amber)" }}>_</span>}
            </span>
          ))}
        </motion.h1>

        {/* Rainbow line */}
        <motion.div initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.0, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 4, margin: "28px 0 24px", background: `linear-gradient(90deg,var(--amber),var(--rose),var(--sky),var(--emerald),var(--violet),var(--pink),var(--cyan))` }}
        />

        {/* Tags */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          style={{ display: "flex", gap: 6, marginBottom: 32, flexWrap: "wrap" }}
        >
          {[
            { label: "Next.js", color: "var(--amber)" },
            { label: "TypeScript", color: "var(--sky)" },
            { label: "Node.js", color: "var(--emerald)" },
            { label: "PostgreSQL", color: "var(--violet)" },
            { label: "Figma", color: "var(--rose)" },
            { label: "Docker", color: "var(--cyan)" },
          ].map(({ label, color }) => (
            <motion.span key={label}
              whileHover={{ y: -3, scale: 1.05 }}
              style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", border: `1.5px solid ${color}`, color, padding: "5px 12px", background: `${color}0d`, cursor: "default" }}
            >{label}</motion.span>
          ))}
        </motion.div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            style={{ fontFamily: "var(--ff-mono)", fontSize: 12, color: "var(--mid)", lineHeight: 1.9, maxWidth: 360 }}
          >
            นักศึกษาคอมพิวเตอร์ปีสุดท้าย<br />
            ที่ชอบสร้างสิ่งที่ทั้งสวยและใช้งานได้จริง<br />
            พร้อมเติบโตในทีมที่ดี
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            <a href="#projects"
              style={{ fontFamily: "var(--ff-impact)", fontSize: 15, letterSpacing: "0.14em", background: "var(--black)", color: "var(--amber)", padding: "14px 28px", display: "inline-flex", alignItems: "center", gap: 8, transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--amber)"; e.currentTarget.style.color = "var(--black)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--black)"; e.currentTarget.style.color = "var(--amber)" }}
            >VIEW WORK ↓</a>
            <a href="#contact"
              style={{ fontFamily: "var(--ff-impact)", fontSize: 15, letterSpacing: "0.14em", border: "2px solid var(--black)", color: "var(--black)", padding: "14px 28px", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--black)"; e.currentTarget.style.color = "var(--white)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--black)" }}
            >CONTACT</a>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom rule */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "var(--rule)" }} />
    </section>
  )
}

/* ─── ACTIVITY CARD ── */
function ACard({ a, idx, ratio = "4/3" }: { a: typeof ACTIVITIES[0]; idx: number; ratio?: string }) {
  const [hov, setHov] = useState(false)
  return (
    <Reveal delay={idx * 0.5}>
      <motion.div
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        style={{ position: "relative", overflow: "hidden", background: "#0a0a08" }}
      >
        <div style={{ position: "relative", width: "100%", aspectRatio: ratio, overflow: "hidden", background: "#111" }}>
          {a.image ? (
            <motion.img
              src={a.image} alt={a.title}
              animate={{ scale: hov ? 1.06 : 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${a.accent}22,transparent)` }}>
              <p style={{ fontFamily: "var(--ff-impact)", fontSize: "clamp(60px,10vw,100px)", color: a.accent, opacity: 0.12, userSelect: "none", letterSpacing: "0.05em" }}>{a.no}</p>
            </div>
          )}

          {/* Gradient scrim */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 50%, transparent 75%)", pointerEvents: "none" }} />

          {/* Top accent line */}
          <motion.div animate={{ scaleX: hov ? 1 : 0.3, originX: 0 }} transition={{ duration: 0.4 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: a.accent }}
          />

          {/* No badge */}
          <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.7)", border: `1px solid ${a.accent}55`, padding: "3px 10px", backdropFilter: "blur(8px)" }}>
            <span style={{ fontFamily: "var(--ff-impact)", fontSize: 18, color: a.accent, letterSpacing: "0.05em", lineHeight: 1 }}>{a.no}</span>
          </div>

          {/* Text overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 22px" }}>
            <p style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(13px,1.5vw,16px)", fontWeight: 700, letterSpacing: "-0.01em", color: "#fff", fontStyle: "italic", lineHeight: 1.25, marginBottom: 4 }}>{a.title}</p>
            <Mono style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{a.role} · {a.year}</Mono>
            <motion.div animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 8 }} transition={{ duration: 0.25 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}
            >
              {a.tags.map(t => (
                <span key={t} style={{ fontFamily: "var(--ff-mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", border: `1px solid ${a.accent}70`, color: a.accent, padding: "2px 7px", background: "rgba(0,0,0,0.55)" }}>{t}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Reveal>
  )
}

/* ─── ACTIVITIES SECTION ── */
function ActivitiesSection() {
  const rows: (typeof ACTIVITIES[0])[][] = []
  for (let i = 0; i < ACTIVITIES.length; i += 3) rows.push(ACTIVITIES.slice(i, i + 3))

  const tickerItems = [
  "Next.js",
  "TypeScript",
  "Flutter",
  "Firebase",
  "PostgreSQL",
  "Docker",
  "Figma",
  "Framer Motion",
  "Node.js",
  "Tailwind",
]
  return (
    <section id="activities" style={{ background: "#080806" }}>
      {/* Top marquee */}
      <Marquee
        items={tickerItems}
        bg="var(--amber)"
        color="#080806"
      />

      <div className="section-pad" style={{ padding: "80px 48px 100px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel number="01" label="University Activities" color="#f59e0b" />
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2.4rem,6vw,5rem)", fontWeight: 900, letterSpacing: "-0.03em", fontStyle: "italic", color: "#fff", lineHeight: 0.95 }}>
                University<br />
                <span style={{ color: "var(--amber)", WebkitTextStroke: "0px" }}>Activities</span>
              </h2>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--ff-impact)", fontSize: 80, color: "#fff", opacity: 0.06, lineHeight: 1, letterSpacing: "-0.02em" }}>{ACTIVITIES.length}</p>
                <Mono style={{ color: "#444" }}>{ACTIVITIES.length} Activities · 2023 — 2024</Mono>
              </div>
            </div>
          </Reveal>

          {/* Mosaic grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {rows.map((row, ri) => {
              const isEven = ri % 2 === 0
              if (row.length === 3) {
                return (
                  <div key={ri} className="mosaic-row" style={{ display: "grid", gridTemplateColumns: isEven ? "2fr 1fr" : "1fr 2fr", gap: 4 }}>
                    {isEven ? (
                      <>
                        <ACard a={row[0]} idx={ri * 3} ratio="16/10" />
                        <div className="mosaic-stack" style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 4 }}>
                          <ACard a={row[1]} idx={ri * 3 + 1} ratio="4/3" />
                          <ACard a={row[2]} idx={ri * 3 + 2} ratio="4/3" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mosaic-stack" style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 4 }}>
                          <ACard a={row[0]} idx={ri * 3} ratio="4/3" />
                          <ACard a={row[1]} idx={ri * 3 + 1} ratio="4/3" />
                        </div>
                        <ACard a={row[2]} idx={ri * 3 + 2} ratio="16/10" />
                      </>
                    )}
                  </div>
                )
              }
              if (row.length === 2) return (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  <ACard a={row[0]} idx={ri * 3} ratio="4/3" />
                  <ACard a={row[1]} idx={ri * 3 + 1} ratio="4/3" />
                </div>
              )
              return <div key={ri}><ACard a={row[0]} idx={ri * 3} ratio="21/9" /></div>
            })}
          </div>
        </div>
      </div>

      {/* Bottom marquee */}
      <Marquee items={["Next.js", "TypeScript", "Flutter", "Firebase", "PostgreSQL", "Docker", "Figma", "Framer Motion", "Node.js", "Tailwind"]} bg="#0f0f0d" color="#555" />
    </section>
  )
}

/* ─── PROJECTS SECTION ── */
function ProjectsSection() {
  const [hov, setHov] = useState<number | null>(null)
  const [sel, setSel] = useState<Project | null>(null)

  return (
    <>
      <ProjectModal project={sel} onClose={() => setSel(null)} />
      <section id="projects" style={{ background: "var(--bg)", paddingBottom: 0 }}>

        {/* Header band — dark */}
        <div style={{ background: "var(--black)", padding: "80px clamp(20px,4vw,48px) 60px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <Reveal>
              <SectionLabel number="02" label="Projects & Work" color="#f43f5e" />
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2.4rem,6vw,5rem)", fontWeight: 900, letterSpacing: "-0.03em", fontStyle: "italic", color: "#fff", lineHeight: 0.95 }}>
                  Projects &<br />
                  <span style={{ color: "var(--rose)" }}>Work Experience</span>
                </h2>
                <Mono style={{ color: "#333" }}>Click to explore →</Mono>
              </div>
            </Reveal>
            {/* 4-color rule */}
            <motion.div style={{ height: 4, marginTop: 40, background: `linear-gradient(90deg,var(--amber) 0%,var(--rose) 33%,var(--sky) 66%,var(--emerald) 100%)` }}
              initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Cards */}
        <div style={{ background: "var(--black)", padding: "4px clamp(20px,4vw,48px) 80px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 3 }}>
            {PROJECTS.map((p, i) => (
              <Reveal key={i} delay={i * 0.5}>
                <motion.div
                  onHoverStart={() => setHov(i)} onHoverEnd={() => setHov(null)}
                  onClick={() => setSel(p)}
                  style={{ cursor: "pointer", background: "#0d0d0b", overflow: "hidden", position: "relative", borderLeft: `3px solid ${p.accent}`, transition: "border-color .2s" }}
                >
                  <div className="proj-card-inner" style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
                    {/* Image block */}
                    <div style={{ position: "relative", background: "#080806", overflow: "hidden", width: "clamp(180px, 32vw, 400px)", flexShrink: 0 }}>
                      {p.images.length > 0 ? (
                        <motion.img src={p.images[0]} alt={p.title}
                          animate={{ scale: hov === i ? 1.03 : 1 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          style={{ width: "100%", height: "auto", display: "block", minHeight: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <div style={{ width: "100%", paddingBottom: "56%", background: p.imageBg, position: "relative" }}>
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p style={{ fontFamily: "var(--ff-impact)", fontSize: "clamp(60px,10vw,100px)", color: p.accent, opacity: 0.1, letterSpacing: "0.05em" }}>{p.no}</p>
                          </div>
                        </div>
                      )}
                      {p.images.length > 1 && (
                        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.8)", border: `1px solid ${p.accent}55`, padding: "3px 10px", display: "flex", alignItems: "center", gap: 5, backdropFilter: "blur(6px)" }}>
                          <span style={{ color: p.accent, fontSize: 10 }}>⊞</span>
                          <Mono style={{ color: p.accent, fontSize: 9 }}>{p.images.length}</Mono>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <motion.div animate={{ opacity: hov === i ? 1 : 0 }}
                        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "var(--ff-impact)", fontSize: 13, letterSpacing: "0.2em", color: "#fff", border: `2px solid ${p.accent}`, padding: "10px 20px", background: `${p.accent}15` }}>OPEN PROJECT</span>
                      </motion.div>
                    </div>

                    {/* Text */}
                    <div style={{ padding: "clamp(20px,3vw,32px)", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "1px solid #1a1a1a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <span style={{ fontFamily: "var(--ff-impact)", fontSize: 36, color: p.accent, lineHeight: 1, opacity: 0.6 }}>{p.no}</span>
                        <Mono style={{ color: "#444", fontSize: 9 }}>{p.year}</Mono>
                      </div>
                      <p style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(18px,2.4vw,26px)", fontWeight: 900, letterSpacing: "-0.025em", color: "#fff", fontStyle: "italic", lineHeight: 1.2, marginBottom: 6 }}>{p.title}</p>
                      <Mono style={{ display: "block", color: "#3a3a3a", marginBottom: 14, fontSize: 9 }}>{p.client}</Mono>
                      <p style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "#666", lineHeight: 1.8, marginBottom: 18 }}>{p.shortDesc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 20 }}>
                        {p.tags.map(t => (
                          <span key={t} style={{ fontFamily: "var(--ff-mono)", fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", border: `1px solid ${p.accent}44`, color: p.accent, padding: "3px 9px", background: `${p.accent}09` }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#111", border: `1px solid ${p.accent}22`, padding: "8px 14px", alignSelf: "flex-start" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, color: "#666" }}>{p.outcome}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── TIER BADGE ── */
const TIER_CONFIG = {
  strong:   { label: "เชี่ยวชาญ",   bg: "var(--black)",  text: "var(--amber)",   border: "var(--amber)" },
  good:     { label: "ใช้งานได้ดี",  bg: "transparent",   text: "var(--sky)",     border: "var(--sky)" },
  learning: { label: "กำลังเรียนรู้", bg: "transparent",   text: "#555",           border: "#333" },
}

function TierBadge({ tier }: { tier: "strong" | "good" | "learning" }) {
  const cfg = TIER_CONFIG[tier]
  return (
    <span style={{ fontFamily: "var(--ff-mono)", fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, padding: "2px 8px", flexShrink: 0 }}>
      {cfg.label}
    </span>
  )
}

/* ─── SKILL ROW ── */
function SkillRow({ s, delay }: { s: typeof HARD_SKILLS[0]; delay: number }) {
  const [hov, setHov] = useState(false)
  return (
    <Reveal delay={delay}>
      <motion.div
        onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--rule)", gap: 12, cursor: "default" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {/* Accent dot */}
          <motion.div animate={{ scale: hov ? 1.6 : 1, background: hov ? s.accent : "var(--rule)" }}
            transition={{ duration: 0.2 }}
            style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: "var(--rule)" }}
          />
          <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "var(--black)", whiteSpace: "nowrap" }}>{s.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <motion.span animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : 6 }} transition={{ duration: 0.2 }}
            style={{ fontFamily: "var(--ff-mono)", fontSize: 9, color: "var(--mid)", whiteSpace: "nowrap" }}>
            {s.proof}
          </motion.span>
          <TierBadge tier={s.tier as "strong" | "good" | "learning"} />
        </div>
      </motion.div>
    </Reveal>
  )
}

/* ─── SKILLS SECTION ── */
function SkillsSection() {
  const [activeTab, setActiveTab] = useState<"hard" | "soft">("hard")

  return (
    <section id="skills" className="section-pad" style={{ padding: "100px 48px 120px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <Reveal>
          <SectionLabel number="03" label="Skills & Expertise" color="var(--violet)" />
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 52, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2.4rem,6vw,5rem)", fontWeight: 900, letterSpacing: "-0.03em", fontStyle: "italic", lineHeight: 0.95 }}>
              Skills &<br />
              <span style={{ color: "var(--violet)" }}>Expertise</span>
            </h2>
            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              {(["strong", "good", "learning"] as const).map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TierBadge tier={t} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Tab switcher */}
        <Reveal>
          <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
            {[
              { key: "hard", label: "Hard Skills" },
              { key: "soft", label: "Soft Skills" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as "hard" | "soft")}
                style={{ fontFamily: "var(--ff-impact)", fontSize: 15, letterSpacing: "0.12em", padding: "10px 24px", cursor: "pointer", border: "2px solid var(--black)", transition: "all .2s", background: activeTab === tab.key ? "var(--black)" : "transparent", color: activeTab === tab.key ? "var(--amber)" : "var(--black)" }}
              >{tab.label}</button>
            ))}
          </div>
        </Reveal>

        {/* Skill list + Tools side by side */}
        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px", alignItems: "start" }}>

          {/* Left: skill list */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {(activeTab === "hard" ? HARD_SKILLS : SOFT_SKILLS).map((s, i) => (
                  <SkillRow key={s.label} s={s} delay={i * 0.4} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: tools by project */}
          <div>
            <Reveal delay={1}><Mono style={{ display: "block", marginBottom: 20 }}>Tools & Workflow — by Project</Mono></Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {TOOL_GROUPS.map((group, gi) => (
                <Reveal key={gi} delay={gi + 1}>
                  <div style={{ border: "1px solid var(--rule)", borderLeft: `4px solid ${group.accent}`, padding: "16px 18px", background: "var(--bg)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <motion.div style={{ width: 8, height: 8, borderRadius: "50%", background: group.accent, flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--ff-display)", fontSize: 14, fontWeight: 700, fontStyle: "italic", color: "var(--black)" }}>{group.project}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {group.tools.map(t => (
                        <motion.span key={t}
                          whileHover={{ y: -2 }}
                          style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", border: `1px solid ${group.accent}50`, color: "var(--black)", padding: "3px 9px", background: `${group.accent}10`, cursor: "default" }}
                        >{t}</motion.span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Currently learning card */}
          
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACT SECTION ── */
function ContactSection() {
  return (
    <section id="contact" className="section-pad" style={{ padding: "100px 48px 72px", background: "var(--black)", color: "var(--white)", position: "relative", overflow: "hidden" }}>

      {/* Giant ghost text */}
      <div style={{ position: "absolute", bottom: -20, left: -20, fontFamily: "var(--ff-impact)", fontSize: "clamp(80px,20vw,240px)", color: "var(--white)", opacity: 0.02, letterSpacing: "-0.04em", userSelect: "none", pointerEvents: "none", lineHeight: 1 }}>HELLO</div>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
        <Reveal>
          <SectionLabel number="04" label="Get In Touch" color="var(--rose)" />
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(3rem,10vw,9rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.88, fontStyle: "italic", marginBottom: 56 }}>
            Let's Build<br />
            <span style={{ color: "#2a2a2a" }}>Something</span><br />
            <span style={{ color: "var(--amber)" }}>Together.</span>
          </h2>
        </Reveal>

        {/* Rainbow rule */}
        <motion.div style={{ height: 4, marginBottom: 48, background: `linear-gradient(90deg,var(--amber),var(--rose),var(--sky),var(--emerald),var(--violet))` }}
          initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <Reveal delay={1}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 40px" }}>
            <div>
              <Mono style={{ display: "block", marginBottom: 12, color: "#555" }}>Email</Mono>
              <a href="mailto:thanakornwork12@gmail.com"
                style={{ fontFamily: "var(--ff-mono)", fontSize: 12, color: "#fff", borderBottom: "2px solid #2a2a2a", paddingBottom: 3, wordBreak: "break-all", transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--amber)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}
              >thanakornwork12@gmail.com</a>
            </div>
            <div>
              <Mono style={{ display: "block", marginBottom: 12, color: "#555" }}>Social</Mono>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[["GitHub", "var(--sky)"], ["LinkedIn", "var(--violet)"]].map(([s, c]) => (
                  <a key={s} href="#"
                    style={{ fontFamily: "var(--ff-impact)", fontSize: 18, letterSpacing: "0.1em", color: "#fff", borderBottom: "2px solid #2a2a2a", paddingBottom: 3, width: "fit-content", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = c; e.currentTarget.style.color = c }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#fff" }}
                  >{s} ↗</a>
                ))}
              </div>
            </div>
            <div>
              <Mono style={{ display: "block", marginBottom: 12, color: "#555" }}>Status</Mono>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid #2a2a2a", padding: "10px 16px", background: "#0e0e0c" }}>
                <motion.div animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2.2 }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--emerald)", flexShrink: 0 }}
                />
                <span style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "#888" }}>Available — Open to work</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div style={{ height: 1, background: "#1a1a1a", margin: "72px 0 28px" }} />
        <div className="footer-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "var(--ff-impact)", fontSize: 14, letterSpacing: "0.1em", color: "#2a2a2a" }}>© THANAKORN THONGSA 2025</span>
          <Mono style={{ color: "#2a2a2a" }}>Portfolio</Mono>
          <Mono style={{ color: "#2a2a2a" }}>Built with Next.js & Framer Motion</Mono>
        </div>
      </div>
    </section>
  )
}

/* ─── ROOT ── */
export default function Portfolio() {
  return (
    <>
      <FontLoader />
      <div style={{ background: "var(--bg)", color: "var(--black)" }}>
        <Nav />
        <HeroSection />
        <ActivitiesSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </div>
    </>
  )
}
