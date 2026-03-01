"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"

/* ─────────────────────────────────────────────────────────────────────────────
   PORTFOLIO — B&W Editorial + Color Accents
   Responsive: mobile → tablet → desktop
   Activities: fixed 2-col image grid
   Projects: multi-image lightbox modal
───────────────────────────────────────────────────────────────────────────── */

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&display=swap');
      :root {
        --ff-display: 'Playfair Display', Georgia, serif;
        --ff-mono: 'DM Mono', 'Courier New', monospace;
        --white:   #ffffff;
        --black:   #0a0a0a;
        --bg:      #fafaf8;
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
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
      body { background: var(--bg); color: var(--black); overflow-x: hidden; }
      ::selection { background: var(--black); color: var(--white); }
      a { color: inherit; text-decoration: none; }
      img { display: block; max-width: 100%; }
      ::-webkit-scrollbar { width: 2px; }
      ::-webkit-scrollbar-thumb { background: var(--black); }

      /* ── Responsive helpers ── */
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
      .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2px; }
      .hide-mobile { display: flex; }

      @media (max-width: 768px) {
        .grid-2 { grid-template-columns: 1fr; }
        .grid-3 { grid-template-columns: 1fr; }
        .hide-mobile { display: none !important; }
        .nav-pad { padding: 16px 20px !important; }
        .section-pad { padding: 80px 20px !important; }
        .hero-pad { padding: 0 20px 60px !important; }
        .contact-grid { grid-template-columns: 1fr !important; gap: 32px 0 !important; }
        .skills-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
        .project-modal { width: 100vw !important; }
        .activity-card-h { grid-template-columns: 1fr !important; }
        .activity-img-h { height: 200px !important; }
        .footer-row { flex-direction: column !important; gap: 8px !important; }
        .mosaic-row { grid-template-columns: 1fr !important; }
        .mosaic-stack { grid-template-rows: auto auto !important; }
        .proj-card-inner { grid-template-columns: 1fr !important; }
      }
      @media (min-width: 769px) and (max-width: 1024px) {
        .section-pad { padding: 80px 32px !important; }
        .hero-pad { padding: 0 32px 70px !important; }
        .grid-3 { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>
  )
}

const ACTIVITIES = [
  {
    no: "01", year: "2024",
    title: "สตาฟรับน้องรุ่น 2568",
    role: "Staff / Organizer",
    tags: ["Leadership", "University", "Event"],
    accent: "var(--amber)",
    image: "images/สตาฟรับน้องรุ่น 2568.JPG",
  },
  {
    no: "02", year: "2024",
    title: "พิธีกรในงาน IT Night 2568",
    role: "Master of Ceremony",
    tags: ["Presentation", "Public Speaking"],
    accent: "var(--sky)",
    image: "images/พิธีกรในงาน it night 2568.JPG",
  },
  {
    no: "03", year: "2024",
    title: "แข่งขันการเขียนโปรแกรมคอมพิวเตอร์",
    role: "Competitor",
    tags: ["Programming", "Python"],
    accent: "var(--rose)",
    image: "images/แข่งขันการเขียนโปรแกรมคอมพิวเตอร์ด้วยภาษาpython.JPEG",
  },
  {
    no: "04", year: "2024",
    title: "แข่งขันบาสเกตบอล SCI",
    role: "Athlete",
    tags: ["Sports", "Teamwork"],
    accent: "var(--emerald)",
    image: "images/แข่งขันบาสเกตบอลภายในคณะ.jpg",
  },
  {
    no: "05", year: "2024",
    title: "แข่งขันฟุตซอลปี 2568",
    role: "Athlete",
    tags: ["Football", "Teamwork"],
    accent: "var(--violet)",
    image: "images/แข่งขันฟุตซอลปี 2568.JPG",
  },
  {
    no: "06", year: "2023",
    title: "ดนตรีในงาน IT Night 2567",
    role: "Performer",
    tags: ["Music", "Stage"],
    accent: "var(--pink)",
    image: "images/ดนตรีในงาน it night 2567.JPEG",
  },
  {
    no: "07", year: "2024",
    title: "ถ่ายทำโครงการของคณะวิทย์",
    role: "Media Team",
    tags: ["Media", "Production"],
    accent: "var(--cyan)",
    image: "images/ถ่ายทำโครงการของคณะวิทย์.JPG",
  },
  {
    no: "08", year: "2024",
    title: "เดินขบวนวันวิทยาศาสตร์",
    role: "Representative",
    tags: ["Ceremony", "Activity"],
    accent: "var(--orange)",
    image: "images/ถือป้ายในงานเดินขบวนวิทยาศาตร์.JPEG",
  },
  {
    no: "09", year: "2024",
    title: "Open House 2568",
    role: "Staff",
    tags: ["Open House", "Event"],
    accent: "var(--amber)",
    image: "images/open house 2568.jpg",
  },
  {
    no: "10", year: "2023",
    title: "สตาฟในงาน Open House 2567",
    role: "Staff",
    tags: ["Open House", "University"],
    accent: "var(--sky)",
    image: "images/สตาฟในงาน open house 2567.JPG",
  },
  {
    no: "11", year: "2024",
    title: "แข่งขันฟุตซอล SCI",
    role: "Athlete",
    tags: ["Football", "Teamwork"],
    accent: "var(--emerald)",
    image: "images/แข่งขันฟุตซอล SCi.JPEG",
  },
{
  no: "12",
  year: "2024",
  title: "วิ่งงานโนนคูณ 2568",
  role: "Participant",
  tags: ["Marathon", "Sports", "Endurance"],
  desc: "เข้าร่วมกิจกรรมวิ่งงานโนนคูณ 2568 เพื่อส่งเสริมสุขภาพและสร้างความสามัคคี",
  accent: "var(--emerald)",
  image: "images/วิ่งงานโนนคูณ.JPG",
},
{
  no: "13",
  year: "2024",
  title: "ถ่ายคลิปโปรโมทกิจกรรม",
  role: "Content Creator",
  tags: ["Media", "Video Production", "Creative"],
  desc: "ร่วมถ่ายทำคลิปวิดีโอโปรโมทกิจกรรมของคณะ เพื่อประชาสัมพันธ์ผ่านสื่อออนไลน์",
  accent: "var(--emerald)",
  image: "images/ถ่ายคลิปโมทโมท.jpg",
},
]

const PROJECTS = [
  {
  no: "01",
  title: "DadBuddy Mobile Application",
  client: "Boromarajonani College of Nursing, Yala",
  year: "2024",
  tags: ["Flutter", "Firebase", "Hive", "Mobile App"],
  accent: "var(--emerald)",
  imageBg: "linear-gradient(135deg,#10b98128,#10b98106)",
  images: [
    
    "images/dadbuddy1.png",
    "images/dadbuddylogin.png",
    "images/dadbuddy2.png",
    "images/dadbuddy3.png",
    "images/dadbuddy4.png",
    "images/dadbuddy5.png",
    "images/dadbuddy6.png",
    "images/dadbuddy7.png",
    
  ],
  shortDesc: "แอปสำหรับคุณพ่อมือใหม่ เรียนรู้การดูแลทารก พร้อมระบบเก็บข้อมูลออนไลน์และออฟไลน์",
  fullDesc: `
DadBuddy เป็นแอปพลิเคชันสำหรับคุณพ่อมือใหม่
ที่พัฒนาขึ้นเพื่อส่งเสริมความรู้ด้านการดูแลทารก
และเสริมสร้างความมั่นใจในการเลี้ยงดูบุตรอย่างถูกต้อง

• **Learning Modules** — รวมบทเรียนเกี่ยวกับการอุ้มทารก การอาบน้ำ การให้นม และพัฒนาการตามวัย จัดเรียงเป็นหมวดหมู่ เข้าใจง่าย

• **Progress Tracking** — บันทึก Favorite ติดตามบทเรียนที่เรียนจบแล้ว และดูความก้าวหน้าในการเรียนรู้

• **Cloud Logging (Firebase)** — จัดเก็บ Log การใช้งานและข้อมูลสำคัญบน Cloud เพื่อวิเคราะห์พฤติกรรมผู้ใช้และพัฒนาแอปในอนาคต

• **Offline Storage (Hive)** — จัดเก็บข้อมูลผู้ใช้ รายการโปรด และสถานะบทเรียนแบบออฟไลน์ เพื่อให้ใช้งานได้แม้ไม่มีอินเทอร์เน็ต

แอปออกแบบด้วยแนวคิด Mobile-First ใช้งานง่าย ทันสมัย และเหมาะกับครอบครัวยุคดิจิทัล
`,
  outcome: "ช่วยเพิ่มความมั่นใจให้คุณพ่อมือใหม่ และสนับสนุนการเรียนรู้ด้านการดูแลทารก",
  duration: "3 เดือน",
  link: "#",
},
  {
  no: "02",
  title: "Part-Time Staff – The Pizza Company",
  client: "The Pizza Company",
  year: "2024",
  tags: ["Order Management", "Delivery Coordination", "Customer Service", "Teamwork"],
  accent: "var(--rose)",
  imageBg: "linear-gradient(135deg,#f43f5e28,#f43f5e06)",
  images: ["images/pizza4.JPG",
    "images/pizza1.JPG","images/pizza2.JPG","images/pizza3.JPG"],
  shortDesc: "ดูแลจัดการออเดอร์และประสานงานการจัดส่งในช่วงเวลาเร่งด่วน",
  fullDesc: `
ปฏิบัติงานในตำแหน่งพนักงานพาร์ทไทม์ที่ The Pizza Company
โดยรับผิดชอบหลักด้านการจัดการคำสั่งซื้อและประสานงานการจัดส่ง

• **Order Management** — ตรวจสอบและจัดเตรียมออเดอร์ทั้งหน้าร้านและเดลิเวอรี่ให้ถูกต้อง ครบถ้วน และตรงเวลา

• **Delivery Coordination** — ประสานงานกับไรเดอร์และทีมครัว เพื่อลดระยะเวลารอคอย และป้องกันความผิดพลาดในการจัดส่ง

• **Quality Control** — ตรวจสอบความถูกต้องของสินค้าและบรรจุภัณฑ์ก่อนส่งมอบให้ลูกค้า

• **Peak Hour Handling** — บริหารจัดการออเดอร์จำนวนมากในช่วงเวลาเร่งด่วนได้อย่างมีประสิทธิภาพ

ประสบการณ์นี้ช่วยพัฒนาทักษะการจัดลำดับความสำคัญของงาน
การทำงานภายใต้แรงกดดัน และความละเอียดรอบคอบในการทำงาน
`,
  outcome: "สามารถจัดการออเดอร์จำนวนมากได้อย่างแม่นยำและตรงเวลา",
  duration: "2 เดือน",
  link: "#",
},
  {
  no: "03",
  title: "UBU Green – Campus Sustainability Platform",
  client: "Ubon Ratchathani University",
  year: "2026",
  tags: ["Web App", "Sustainability", "Dashboard", "Gamification"],
  accent: "var(--emerald)",
  imageBg: "linear-gradient(135deg,#22c55e28,#22c55e06)",
  images: ['images/ubugreen.png','images/ubugreen1.jepg','images/ubugreen2.jepg','images/ubugreen3.jepg','images/ubugreen4.'],
  shortDesc: "แพลตฟอร์มส่งเสริมพฤติกรรมรักษ์โลกในมหาวิทยาลัย พร้อมระบบสะสมแต้มและ dashboard วิเคราะห์ข้อมูล",
  fullDesc: `
UBU Green เป็นแพลตฟอร์มที่พัฒนาขึ้นเพื่อสนับสนุนแนวคิด Green University 
และกระตุ้นให้นักศึกษาและบุคลากรมีส่วนร่วมในการรักษาสิ่งแวดล้อมภายในมหาวิทยาลัย

• **Activity Tracking** — บันทึกกิจกรรมรักษ์โลก เช่น การแยกขยะ การใช้แก้วส่วนตัว หรือการเข้าร่วมกิจกรรมสิ่งแวดล้อม

• **Point & Reward System** — ระบบสะสมคะแนน (Gamification) เพื่อกระตุ้นการมีส่วนร่วม และสร้างแรงจูงใจในการทำพฤติกรรมที่เป็นมิตรต่อสิ่งแวดล้อม

• **Dashboard & Analytics** — แสดงสถิติการมีส่วนร่วม ภาพรวมพฤติกรรมผู้ใช้งาน และข้อมูลเชิงวิเคราะห์เพื่อใช้ในการวางแผนนโยบายด้านสิ่งแวดล้อม

• **User-Centered Design** — ออกแบบให้ใช้งานง่าย รองรับการใช้งานผ่านมือถือและเดสก์ท็อป

โครงการนี้ช่วยสร้างการมีส่วนร่วมของนักศึกษาในด้านสิ่งแวดล้อม 
และสนับสนุนภาพลักษณ์ Green Campus ของมหาวิทยาลัย
`,
  outcome: "เพิ่มการมีส่วนร่วมในกิจกรรมด้านสิ่งแวดล้อมภายในมหาวิทยาลัย",
  duration: "2 เดือน",
  link: "#",
},
  {
    no: "04",
    title: "Photography Portfolio",
    client: "Freelance Photographer",
    year: "2023",
    tags: ["Next.js", "Framer Motion", "Cloudinary"],
    accent: "var(--violet)",
    imageBg: "linear-gradient(135deg,#8b5cf628,#8b5cf606)",
    images: [] as string[],
    shortDesc: "เว็บ portfolio รูปภาพ โหลดเร็ว gallery masonry และ lightbox full-screen",
    fullDesc: `เว็บ portfolio สำหรับช่างภาพ freelance:

• **Masonry Gallery** — grid ปรับ layout อัตโนมัติตามขนาดรูป ดูได้ทุก screen size

• **Lightbox** — full-screen พร้อม swipe gesture และ keyboard navigation

• **Cloudinary CDN** — ปรับขนาดและ format อัตโนมัติ (WebP/AVIF)

• **CMS** — เพิ่มผลงานได้เองผ่าน Sanity ไม่ต้องแตะ code`,
    outcome: "Lighthouse 98/100 · FCP < 0.8s",
    duration: "3 สัปดาห์",
    link: "#",
  },
]


const SKILLS = [
  { label: "React / Next.js", level: 92, accent: "var(--amber)" },
  { label: "TypeScript", level: 85, accent: "var(--sky)" },
  { label: "Node.js / Express", level: 82, accent: "var(--emerald)" },
  { label: "Tailwind CSS", level: 90, accent: "var(--rose)" },
  { label: "PostgreSQL", level: 75, accent: "var(--violet)" },
  { label: "Framer Motion", level: 78, accent: "var(--pink)" },
  { label: "Docker", level: 65, accent: "var(--cyan)" },
  { label: "Figma", level: 72, accent: "var(--orange)" },
]
const TOOLS = ["VS Code", "Git", "Vercel", "Railway", "Postman", "Linear", "Notion", "Figma"]

/* ─── Shared primitives ──────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: delay * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function Rule({ dark = false, style = {} }: { dark?: boolean; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: "1px", background: dark ? "#2a2a2a" : "var(--rule)" }}
      />
    </div>
  )
}

function Mono({ children, style = {} }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ fontFamily: "var(--ff-mono)", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "var(--mid)", ...style }}>
      {children}
    </span>
  )
}

/* ─── PROJECT MODAL — full image, no crop, multi-image gallery ───────────────── */
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
      if (e.key === "ArrowLeft")  setImgIdx(i => Math.max(i - 1, 0))
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
          {/* Backdrop */}
          <motion.div key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, backdropFilter: "blur(10px)" }}
          />

          {/* Drawer panel */}
          <motion.div key="panel"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="project-modal"
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(680px,100vw)", background: "#0a0a0a", zIndex: 201, overflowY: "auto", display: "flex", flexDirection: "column", borderLeft: `1px solid #1e1e1e` }}
          >
            {/* ── Accent top strip ── */}
            <div style={{ height: 3, background: project.accent, flexShrink: 0 }} />

            {/* ── Header bar (sticky) ── */}
            <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: project.accent }}>{project.no}</span>
                <span style={{ width: 1, height: 14, background: "#2a2a2a" }} />
                <Mono style={{ color: "#555" }}>{project.year} · {project.client}</Mono>
              </div>
              <button onClick={onClose}
                style={{ width: 32, height: 32, border: "1px solid #2a2a2a", background: "transparent", color: "#888", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#888" }}
              >×</button>
            </div>

            {/* ── Main image — full size, no crop ── */}
            {totalImgs > 0 && (
              <div style={{ position: "relative", background: "#060606", flexShrink: 0 }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIdx}
                    src={project.images[imgIdx]}
                    alt={`${project.title} ${imgIdx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: "100%", height: "auto", display: "block", maxHeight: "70vh", objectFit: "contain" }}
                  />
                </AnimatePresence>

                {/* Prev / Next arrows */}
                {totalImgs > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(i => Math.max(i - 1, 0))}
                      disabled={imgIdx === 0}
                      style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 38, height: 38, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.7)", color: "#fff", cursor: imgIdx === 0 ? "default" : "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", opacity: imgIdx === 0 ? 0.25 : 1, transition: "opacity .2s" }}
                    >‹</button>
                    <button
                      onClick={() => setImgIdx(i => Math.min(i + 1, totalImgs - 1))}
                      disabled={imgIdx === totalImgs - 1}
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 38, height: 38, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.7)", color: "#fff", cursor: imgIdx === totalImgs - 1 ? "default" : "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", opacity: imgIdx === totalImgs - 1 ? 0.25 : 1, transition: "opacity .2s" }}
                    >›</button>
                    {/* Counter pill */}
                    <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.75)", border: "1px solid #2a2a2a", padding: "3px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                      <Mono style={{ color: "#777", fontSize: 9 }}>{imgIdx + 1} / {totalImgs}</Mono>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Thumbnail filmstrip ── */}
            {totalImgs > 1 && (
              <div style={{ display: "flex", gap: 3, background: "#060606", padding: "8px 8px 10px", overflowX: "auto", flexShrink: 0 }}>
                {project.images.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ flexShrink: 0, width: 72, height: 52, padding: 0, background: "none", cursor: "pointer", border: i === imgIdx ? `2px solid ${project.accent}` : "2px solid #1e1e1e", overflow: "hidden", transition: "border-color .15s" }}
                  >
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}

            {/* Placeholder when no images */}
            {totalImgs === 0 && (
              <div style={{ width: "100%", padding: "48px 0", background: project.imageBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(56px,10vw,88px)", fontWeight: 900, fontStyle: "italic", color: project.accent, opacity: 0.14, userSelect: "none" }}>{project.no}</p>
              </div>
            )}

            {/* ── Body content ── */}
            <div style={{ padding: "clamp(20px,4vw,36px)", flex: 1 }}>

              {/* Title */}
              <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(22px,4vw,30px)", fontWeight: 900, letterSpacing: "-0.025em", fontStyle: "italic", color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
                {project.title}
              </h2>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                {project.tags.map(t => (
                  <span key={t} style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", border: `1px solid ${project.accent}50`, color: project.accent, padding: "3px 9px", background: `${project.accent}08` }}>{t}</span>
                ))}
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#181818", marginBottom: 28 }}>
                {[{ l: "Duration", v: project.duration }, { l: "Outcome", v: project.outcome }].map(s => (
                  <div key={s.l} style={{ padding: "16px 18px", background: "#0a0a0a" }}>
                    <Mono style={{ display: "block", marginBottom: 6, color: "#3a3a3a", fontSize: 9 }}>{s.l}</Mono>
                    <p style={{ fontFamily: "var(--ff-display)", fontSize: 13, fontWeight: 700, color: project.accent, fontStyle: "italic", lineHeight: 1.4 }}>{s.v}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Mono style={{ color: "#3a3a3a", fontSize: 9 }}>Project Details</Mono>
                <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
              </div>
              <div style={{ marginBottom: 8 }}>{renderDesc(project.fullDesc)}</div>

              {/* CTA */}
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #1a1a1a" }}>
                <a href={project.link}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", background: project.accent, color: "#000", padding: "12px 24px", fontWeight: 600, transition: "opacity .2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >View Live ↗</a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── NAV ─────────────────────────────────────────────────────────────────────── */
function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => scrollY.on("change", v => setScrolled(v > 40)), [scrollY])

  return (
    <motion.nav className="nav-pad"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px",
        borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
        background: scrolled ? "rgba(250,250,248,.94)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        transition: "all .4s ease",
      }}
    >
      <a href="#" style={{ fontFamily: "var(--ff-display)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>TT</a>
      <div className="hide-mobile" style={{ alignItems: "center", gap: 28 }}>
        {[["#activities","Activities"],["#projects","Projects"],["#skills","Skills"],["#contact","Contact"]].map(([h, l]) => (
          <a key={h} href={h}
            style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mid)", transition: "color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--black)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--mid)"}
          >{l}</a>
        ))}
        <a href="#contact"
          style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid var(--black)", padding: "8px 18px", transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--black)"; e.currentTarget.style.color = "var(--white)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--black)" }}
        >Hire Me</a>
      </div>
      {/* Mobile menu placeholder */}
      <a href="#contact" className="hide-mobile" style={{ display: "none", fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid var(--black)", padding: "7px 14px" }}>
        Hire Me
      </a>
    </motion.nav>
  )
}

/* ─── HERO ────────────────────────────────────────────────────────────────────── */
function HeroSection() {
  const { scrollY } = useScroll()
  const yPx = useTransform(scrollY, [0, 700], [0, 90])
  const op  = useTransform(scrollY, [0, 500], [1, 0])

  const [tick, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick(v => v + 1), 80); return () => clearInterval(t) }, [])
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const scramble = (str: string, rev: number) =>
    str.split("").map((c, i) => i < rev ? c : c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]).join("")
  const NAME = "Thanakorn Thongsa"
  const rev = Math.min(tick * 0.4, NAME.length)

  /* Animated color stripe across subtitle */
  const stripeColors = ["var(--amber)", "var(--rose)", "var(--sky)", "var(--emerald)", "var(--violet)", "var(--pink)", "var(--cyan)", "var(--orange)"]

  return (
    <section className="hero-pad"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 48px 80px", position: "relative", overflow: "hidden", background: "var(--bg)" }}
    >
      {/* Color blobs */}
      <div style={{ position: "absolute", top: "8%", right: "4%", width: "min(340px,50vw)", height: "min(340px,50vw)", borderRadius: "50%", background: "var(--amber)", opacity: 0.055, filter: "blur(90px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "18%", left: "10%", width: "min(220px,35vw)", height: "min(220px,35vw)", borderRadius: "50%", background: "var(--rose)", opacity: 0.04, filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", right: "30%", width: "min(180px,28vw)", height: "min(180px,28vw)", borderRadius: "50%", background: "var(--sky)", opacity: 0.04, filter: "blur(60px)", pointerEvents: "none" }} />

      {/* Issue label */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ position: "absolute", top: "clamp(80px,12vw,110px)", right: "clamp(20px,4vw,48px)", textAlign: "right" }}>
        <Mono style={{ display: "block" }}>Portfolio</Mono>
        <Mono style={{ display: "block" }}>Issue 2025</Mono>
      </motion.div>

      {/* Left vertical rule */}
      <motion.div
        initial={{ scaleY: 0, originY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", left: "clamp(20px,4vw,48px)", top: 80, bottom: 80, width: 1, background: "var(--rule)" }}
      />

      <motion.div style={{ y: yPx, opacity: op }}>
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} style={{ marginBottom: 28 }}>
          <Mono>Business Analyst · Full-Stack Developer</Mono>
        </motion.div>

        {/* Giant name */}
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(3rem,11vw,10rem)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em", color: "var(--black)", fontStyle: "italic", marginBottom: 36 }}
        >{scramble(NAME, rev)}</motion.h1>

        {/* Color tag strip */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          style={{ display: "flex", gap: 6, marginBottom: 40, flexWrap: "wrap" }}
        >
          {[
            { label: "Next.js",     color: "var(--amber)" },
            { label: "TypeScript",  color: "var(--sky)" },
            { label: "Node.js",     color: "var(--emerald)" },
            { label: "PostgreSQL",  color: "var(--violet)" },
            { label: "Figma",       color: "var(--rose)" },
            { label: "Docker",      color: "var(--cyan)" },
          ].map(({ label, color }) => (
            <span key={label} style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", border: `1px solid ${color}`, color, padding: "5px 11px" }}>
              {label}
            </span>
          ))}
        </motion.div>

        {/* Rainbow underline */}
        <motion.div initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 2, marginBottom: 36, background: `linear-gradient(90deg,${stripeColors.join(",")})`, borderRadius: 1 }}
        />

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            style={{ fontFamily: "var(--ff-mono)", fontSize: 13, color: "var(--mid)", lineHeight: 1.75, maxWidth: 380 }}
          >
            นักศึกษาคอมพิวเตอร์ปีสุดท้าย<br />
            ที่ชอบสร้างสิ่งที่ทั้งสวยและใช้งานได้จริง<br />
            พร้อมเติบโตในทีมที่ดี
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
          >
            <a href="#projects"
              style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", background: "var(--black)", color: "var(--white)", padding: "13px 26px", display: "inline-flex", alignItems: "center", gap: 8, transition: "opacity .2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >View Work ↓</a>
            <a href="#contact"
              style={{ fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid var(--black)", color: "var(--black)", padding: "13px 26px", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--black)"; e.currentTarget.style.color = "var(--white)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--black)" }}
            >Contact</a>
          </motion.div>
        </div>
      </motion.div>
      <Rule style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
    </section>
  )
}

/* ─── ACTIVITIES — Magazine mosaic layout ─────────────────────────────────────
   Pattern per 3-item row:
     Row A: [big hero 2/3] + [tall 1/3]
     Row B: [square 1/3] + [wide 2/3]
   Each cell uses aspect-ratio so images never crop and never leave gaps.
─────────────────────────────────────────────────────────────────────────────── */

function ACard({
  a, idx, ratio = "4/3",
}: {
  a: typeof ACTIVITIES[0]
  idx: number
  ratio?: string
}) {
  const [hov, setHov] = useState(false)
  return (
    <Reveal delay={idx * 0.6}>
      <motion.div
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        style={{ position: "relative", overflow: "hidden", background: "#0a0a0a" }}
      >
        {/* Fixed-ratio image box */}
        <div style={{ position: "relative", width: "100%", aspectRatio: ratio, overflow: "hidden", background: "#111" }}>
          {a.image ? (
            <motion.img
              src={a.image} alt={a.title}
              animate={{ scale: hov ? 1.04 : 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${a.accent}22,transparent)` }}>
              <p style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(48px,8vw,80px)", fontWeight: 900, fontStyle: "italic", color: a.accent, opacity: 0.15, userSelect: "none" }}>{a.no}</p>
            </div>
          )}

          {/* Dark scrim — bottom gradient for text readability */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)", pointerEvents: "none" }} />

          {/* Accent top bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: a.accent }} />

          {/* No badge */}
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", border: `1px solid ${a.accent}55`, padding: "2px 9px" }}>
            <Mono style={{ color: a.accent, fontSize: 9 }}>{a.no}</Mono>
          </div>

          {/* Text overlay — always at bottom of image */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px 18px" }}>
            <p style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(13px,1.6vw,17px)", fontWeight: 700, letterSpacing: "-0.01em", color: "#fff", fontStyle: "italic", lineHeight: 1.25, marginBottom: 4 }}>{a.title}</p>
            <Mono style={{ color: "rgba(255,255,255,0.45)", fontSize: 9 }}>{a.role} · {a.year}</Mono>
            {/* Tags on hover */}
            <motion.div
              animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 6 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}
            >
              {a.tags.map(t => (
                <span key={t} style={{ fontFamily: "var(--ff-mono)", fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", border: `1px solid ${a.accent}66`, color: a.accent, padding: "2px 6px", background: "rgba(0,0,0,0.5)" }}>{t}</span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Reveal>
  )
}

function ActivitiesSection() {
  // Split into chunks of 3 for alternating row patterns
  const rows: (typeof ACTIVITIES[0])[][] = []
  for (let i = 0; i < ACTIVITIES.length; i += 3) {
    rows.push(ACTIVITIES.slice(i, i + 3))
  }

  return (
    <section id="activities" className="section-pad"
      style={{ padding: "100px 48px", background: "#0a0a0a" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        {/* Header */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.03em", fontStyle: "italic", color: "#fff" }}>
              University<br />Activities
            </h2>
            <Mono style={{ color: "#444" }}>{ACTIVITIES.length} Activities · 2023 — 2024</Mono>
          </div>
        </Reveal>

        {/* Rainbow rule */}
        <Reveal>
          <div style={{ height: 2, marginBottom: 4, background: `linear-gradient(90deg,var(--amber),var(--rose),var(--sky),var(--emerald),var(--violet),var(--pink))` }} />
        </Reveal>

        {/* Mosaic rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {rows.map((row, ri) => {
            const isEven = ri % 2 === 0
            if (row.length === 3) {
              return (
                <div key={ri} className="mosaic-row" style={{ display: "grid", gridTemplateColumns: isEven ? "2fr 1fr" : "1fr 2fr", gap: 4 }}>
                  {isEven ? (
                    <>
                      {/* Left: big hero */}
                      <ACard a={row[0]} idx={ri * 3} ratio="16/10" />
                      {/* Right: two stacked */}
                      <div className="mosaic-stack" style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 4 }}>
                        <ACard a={row[1]} idx={ri * 3 + 1} ratio="4/3" />
                        <ACard a={row[2]} idx={ri * 3 + 2} ratio="4/3" />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left: two stacked */}
                      <div className="mosaic-stack" style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 4 }}>
                        <ACard a={row[0]} idx={ri * 3} ratio="4/3" />
                        <ACard a={row[1]} idx={ri * 3 + 1} ratio="4/3" />
                      </div>
                      {/* Right: big hero */}
                      <ACard a={row[2]} idx={ri * 3 + 2} ratio="16/10" />
                    </>
                  )}
                </div>
              )
            }
            if (row.length === 2) {
              return (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  <ACard a={row[0]} idx={ri * 3} ratio="4/3" />
                  <ACard a={row[1]} idx={ri * 3 + 1} ratio="4/3" />
                </div>
              )
            }
            // 1 remaining
            return (
              <div key={ri}>
                <ACard a={row[0]} idx={ri * 3} ratio="21/9" />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

/* ─── PROJECTS — editorial card grid, full image no crop ──────────────────────── */
function ProjectsSection() {
  const [hov, setHov] = useState<number | null>(null)
  const [sel, setSel] = useState<Project | null>(null)

  return (
    <>
      <ProjectModal project={sel} onClose={() => setSel(null)} />
      <section id="projects" className="section-pad"
        style={{ padding: "100px 0", background: "var(--black)", color: "var(--white)" }}>
        <div className="section-pad" style={{ padding: "0 clamp(20px,4vw,48px)", maxWidth: 1240, margin: "0 auto" }}>

          {/* Header */}
          <Reveal>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.03em", fontStyle: "italic", color: "var(--white)" }}>
                Projects &<br />Work Experience
              </h2>
              <Mono style={{ color: "#444" }}>Click to explore ↗</Mono>
            </div>
          </Reveal>

          {/* Rainbow rule */}
          <div style={{ height: 2, marginBottom: 4, background: `linear-gradient(90deg,var(--amber),var(--rose),var(--sky),var(--emerald),var(--violet))` }} />

          {/* Cards — full image no crop, stacked layout */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {PROJECTS.map((p, i) => {
              const isWide = i % 3 === 0  // every 3rd card is wide (1 col full width)
              return (
                <Reveal key={i} delay={i}>
                  <motion.div
                    onHoverStart={() => setHov(i)} onHoverEnd={() => setHov(null)}
                    onClick={() => setSel(p)}
                    style={{ cursor: "pointer", background: "#0d0d0d", display: "grid", gridTemplateColumns: isWide ? "1fr" : "1fr", position: "relative", overflow: "hidden" }}
                  >
                    {/* Inner layout: image left / right alternating on desktop for non-wide */}
                    <div className={isWide ? "" : "proj-card-inner"}
                      style={{ display: "grid", gridTemplateColumns: isWide ? "1fr" : "auto 1fr" }}
                    >
                      {/* ── Image block — full size, no fixed height ── */}
                      <div style={{ position: "relative", background: "#080808", overflow: "hidden", width: isWide ? "100%" : "clamp(200px, 35vw, 420px)", flexShrink: 0 }}>
                        {p.images.length > 0 ? (
                          <motion.img
                            src={p.images[0]} alt={p.title}
                            animate={{ scale: hov === i ? 1.025 : 1 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            style={{ width: "100%", height: "auto", display: "block", minHeight: isWide ? 0 : "100%", objectFit: isWide ? "contain" : "contain" }}
                          />
                        ) : (
                          <div style={{ width: "100%", paddingBottom: "56%", background: p.imageBg, position: "relative" }}>
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <p style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(48px,8vw,80px)", fontWeight: 900, fontStyle: "italic", color: p.accent, opacity: 0.14, userSelect: "none" }}>{p.no}</p>
                            </div>
                          </div>
                        )}

                        {/* Multi-image indicator */}
                        {p.images.length > 1 && (
                          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.75)", border: `1px solid ${p.accent}44`, padding: "3px 9px", display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ color: p.accent, fontSize: 10 }}>⊞</span>
                            <Mono style={{ color: p.accent, fontSize: 9 }}>{p.images.length}</Mono>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <motion.div animate={{ opacity: hov === i ? 1 : 0 }}
                          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", padding: "9px 18px" }}>View Details</span>
                        </motion.div>

                        {/* Accent left border */}
                        <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: p.accent }} />
                      </div>

                      {/* ── Text info ── */}
                      <div style={{ padding: "clamp(20px,3vw,32px)", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: isWide ? "none" : "1px solid #181818" }}>
                        {/* No. + year */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <span style={{ fontFamily: "var(--ff-mono)", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: p.accent }}>{p.no}</span>
                          <span style={{ width: 20, height: 1, background: "#2a2a2a" }} />
                          <Mono style={{ color: "#444", fontSize: 9 }}>{p.year}</Mono>
                        </div>

                        <p style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 900, letterSpacing: "-0.025em", color: "#fff", fontStyle: "italic", lineHeight: 1.2, marginBottom: 6 }}>{p.title}</p>
                        <Mono style={{ display: "block", color: "#484848", marginBottom: 14 }}>{p.client}</Mono>
                        <p style={{ fontFamily: "var(--ff-mono)", fontSize: 11, color: "#666", lineHeight: 1.75, marginBottom: 18 }}>{p.shortDesc}</p>

                        {/* Tags */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 20 }}>
                          {p.tags.map(t => (
                            <span key={t} style={{ fontFamily: "var(--ff-mono)", fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", border: `1px solid ${p.accent}40`, color: p.accent, padding: "3px 8px", background: `${p.accent}08` }}>{t}</span>
                          ))}
                        </div>

                        {/* Outcome pill */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#141414", border: "1px solid #2a2a2a", padding: "8px 14px", alignSelf: "flex-start" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                          <span style={{ fontFamily: "var(--ff-mono)", fontSize: 10, color: "#666", lineHeight: 1.4 }}>{p.outcome}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── SKILLS ──────────────────────────────────────────────────────────────────── */
function SkillBar({ label, level, accent, delay }: { label: string; level: number; accent: string; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <div ref={ref} style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontFamily: "var(--ff-mono)", fontSize: 12, color: "var(--black)" }}>{label}</span>
        <Mono>{level}%</Mono>
      </div>
      <div style={{ height: 2, background: "var(--rule)", overflow: "hidden" }}>
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: level / 100 } : {}}
          transition={{ duration: 1.4, delay: delay * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 2, background: accent, transformOrigin: "left" }}
        />
      </div>
    </div>
  )
}

function SkillsSection() {
  return (
    <section id="skills" className="section-pad" style={{ padding: "100px 48px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 72, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.03em", fontStyle: "italic" }}>
              Skills &<br />Expertise
            </h2>
            <Mono>Tech Stack</Mono>
          </div>
        </Reveal>

        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 100px" }}>
          <div>
            <Reveal><Mono style={{ display: "block", marginBottom: 28 }}>Proficiency</Mono></Reveal>
            {SKILLS.map((s, i) => <SkillBar key={i} label={s.label} level={s.level} accent={s.accent} delay={i} />)}
          </div>
          <div>
            <Reveal delay={2}><Mono style={{ display: "block", marginBottom: 28 }}>Tools & Workflow</Mono></Reveal>
            <Rule />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {TOOLS.map((t, i) => (
                <Reveal key={i} delay={i + 2}>
                  <div style={{ padding: "18px 0", borderBottom: "1px solid var(--rule)" }}>
                    <p style={{ fontFamily: "var(--ff-display)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>{t}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={6}>
              <div style={{ marginTop: 52, padding: 32, border: "1px solid var(--rule)", background: "var(--black)", color: "var(--white)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: `linear-gradient(180deg,var(--amber),var(--rose),var(--violet))` }} />
                <Mono style={{ display: "block", marginBottom: 14, color: "#666" }}>Currently Learning</Mono>
                <p style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 700, letterSpacing: "-0.02em", fontStyle: "italic", lineHeight: 1.35 }}>
                  AWS · Kubernetes<br />tRPC · Rust
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACT ─────────────────────────────────────────────────────────────────── */
function ContactSection() {
  return (
    <section id="contact" className="section-pad" style={{ padding: "100px 48px 72px", background: "var(--black)", color: "var(--white)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <h2 style={{ fontFamily: "var(--ff-display)", fontSize: "clamp(3rem,9vw,8.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.9, fontStyle: "italic", marginBottom: 72 }}>
            Let's Build<br />
            <span style={{ color: "#333" }}>Something</span><br />
            Together.
          </h2>
        </Reveal>

        {/* Rainbow rule */}
        <div style={{ height: 2, marginBottom: 44, background: `linear-gradient(90deg,var(--amber),var(--rose),var(--sky),var(--emerald),var(--violet))` }} />

        <Reveal delay={1}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 40px" }}>
            <div>
              <Mono style={{ display: "block", marginBottom: 10, color: "#555" }}>Email</Mono>
              <a href="mailto:thanakornwork12@gmail.com"
                style={{ fontFamily: "var(--ff-mono)", fontSize: 13, color: "#fff", borderBottom: "1px solid #333", paddingBottom: 2, wordBreak: "break-all", transition: "border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--amber)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#333"}
              >thanakornwork12@gmail.com</a>
            </div>
            <div>
              <Mono style={{ display: "block", marginBottom: 10, color: "#555" }}>Social</Mono>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["GitHub","var(--sky)"],["LinkedIn","var(--violet)"]].map(([s,c]) => (
                  <a key={s} href="#"
                    style={{ fontFamily: "var(--ff-mono)", fontSize: 13, color: "#fff", borderBottom: "1px solid #333", paddingBottom: 2, width: "fit-content", transition: "border-color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = c}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#333"}
                  >{s} ↗</a>
                ))}
              </div>
            </div>
            <div>
              <Mono style={{ display: "block", marginBottom: 10, color: "#555" }}>Status</Mono>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", flexShrink: 0 }}
                />
                <span style={{ fontFamily: "var(--ff-mono)", fontSize: 12, color: "#888" }}>Available — Open to work</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div style={{ height: 1, background: "#1a1a1a", margin: "72px 0 28px" }} />
        <div className="footer-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <Mono style={{ color: "#333" }}>© Thanakorn Thongsa 2025</Mono>
          <Mono style={{ color: "#333" }}>Portfolio — Issue 2025</Mono>
          <Mono style={{ color: "#333" }}>Built with Next.js & Framer Motion</Mono>
        </div>
      </div>
    </section>
  )
}

/* ─── ROOT ────────────────────────────────────────────────────────────────────── */
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