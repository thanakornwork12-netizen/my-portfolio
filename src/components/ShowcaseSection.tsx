import { motion } from "framer-motion"

const projects = [
  {
    title: "Customer Churn AI",
    subtitle: "Machine Learning System",
    description:
      "Designed ML pipeline, gathered business requirements, and built dashboard for stakeholder insights.",
    image:
      "https://images.unsplash.com/photo-1551281044-8b3b0a3b63a6",
    tags: ["React", "Python", "ML", "Business Analysis"],
    link: "#",
  },
  {
    title: "Business Workflow Redesign",
    subtitle: "Process Optimization",
    description:
      "Reduced inefficiencies by 30% through structured stakeholder interviews and workflow mapping.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978",
    tags: ["Process Mapping", "Stakeholder Analysis", "Figma"],
    link: "#",
  },
]

export default function ShowcaseSection() {
  return (
    <section
      id="showcase"
      className="py-32 bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-20">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-bold">
            Project Showcase
          </h2>
          <p className="text-gray-400 mt-6 text-lg">
            Real-world solutions crafted with precision and strategy.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 gap-16">

          {projects.map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-lg"
            >
              {/* Image */}
              <div className="h-60 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-8 space-y-4">
                <p className="text-sm text-purple-400">
                  {project.subtitle}
                </p>

                <h3 className="text-2xl font-bold">
                  {project.title}
                </h3>

                <p className="text-gray-400">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <div className="pt-4">
                  <a
                    href={project.link}
                    className="inline-block px-6 py-2 bg-purple-500 text-black font-semibold rounded-full hover:bg-purple-400 transition"
                  >
                    View Project
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}