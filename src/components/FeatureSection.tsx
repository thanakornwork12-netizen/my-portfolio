import { motion } from "framer-motion"

const features = [
  {
    title: "Requirement Analysis",
    desc: "Transforming business needs into clear technical documentation."
  },
  {
    title: "Data Insights",
    desc: "Extracting actionable intelligence from complex datasets."
  },
  {
    title: "Process Optimization",
    desc: "Designing efficient workflows for scalable systems."
  }
]

export default function FeatureSection() {
  return (
    <section id="features" className="py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {features.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold text-purple-400">
              {item.title}
            </h3>
            <p className="mt-4 text-gray-400">
              {item.desc}
            </p>
          </motion.div>
        ))}

      </div>
    </section>
  )
}