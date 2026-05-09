export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-32 bg-gradient-to-b from-black to-gray-900 text-center overflow-hidden"
    >
      {/* Glow Background */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[180px] rounded-full top-[-200px] left-1/2 -translate-x-1/2"></div>

      <div className="relative max-w-3xl mx-auto px-6">
        <h2 className="text-5xl font-bold mb-8">
          Let’s Connect
        </h2>

        <p className="text-gray-400 mb-12 text-lg">
          Interested in collaboration or discussing new opportunities?
          Reach out and let’s build something impactful.
        </p>

        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-6">

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <a
              href="mailto:your-email@email.com"
              className="text-xl font-semibold text-purple-400 hover:text-purple-300 transition"
            >
              your-email@email.com
            </a>
          </div>

          <div>
            <p className="text-gray-500 text-sm">GitHub</p>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              className="text-xl font-semibold text-purple-400 hover:text-purple-300 transition"
            >
              github.com/yourusername
            </a>
          </div>

        </div>

        <p className="mt-16 text-gray-600 text-sm">
          © 2026 Thanakorn Thongsa. All rights reserved.
        </p>
      </div>
    </section>
  )
}