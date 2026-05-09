import { motion } from "framer-motion"

const items = [
  { title: "AI Analytics", desc: "Transform data into strategic insight." },
  { title: "Cloud Infrastructure", desc: "Scalable systems built for growth." },
  { title: "Business Optimization", desc: "Refine processes with precision." }
]

export default function Features() {
  return (
    <section className="py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {items.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:scale-105 transition"
          >
            <h3 className="text-2xl font-semibold text-purple-400">
              {item.title}
            </h3>
            <p className="mt-4 text-gray-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}