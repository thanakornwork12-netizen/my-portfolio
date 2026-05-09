import { motion } from "framer-motion"

export default function Stats() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 text-center">
      <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto px-6">

        <motion.div whileInView={{ scale: 1.1 }}>
          <h2 className="text-5xl font-bold text-purple-400">20+</h2>
          <p className="mt-2 text-gray-400">Projects Delivered</p>
        </motion.div>

        <motion.div whileInView={{ scale: 1.1 }}>
          <h2 className="text-5xl font-bold text-purple-400">95%</h2>
          <p className="mt-2 text-gray-400">Client Satisfaction</p>
        </motion.div>

        <motion.div whileInView={{ scale: 1.1 }}>
          <h2 className="text-5xl font-bold text-purple-400">4.9</h2>
          <p className="mt-2 text-gray-400">Average Rating</p>
        </motion.div>

      </div>
    </section>
  )
}