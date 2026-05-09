function Projects() {
  return (
    <section id="projects" className="py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Projects</h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg hover:scale-105 transition">
            <h3 className="text-2xl font-semibold mb-4">
              Customer Churn Prediction System
            </h3>

            <ul className="text-gray-400 space-y-2 text-sm">
              <li>• Identified churn problem from dataset analysis</li>
              <li>• Gathered and documented business requirements</li>
              <li>• Designed system workflow and dashboard wireframe</li>
              <li>• Achieved 85% model accuracy</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg hover:scale-105 transition">
            <h3 className="text-2xl font-semibold mb-4">
              Business Process Analysis Project
            </h3>

            <ul className="text-gray-400 space-y-2 text-sm">
              <li>• Conducted stakeholder interviews</li>
              <li>• Created process mapping diagrams</li>
              <li>• Designed use case documentation</li>
              <li>• Improved workflow efficiency</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects