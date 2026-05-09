export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl tracking-wide">Nook</h1>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#features" className="hover:text-purple-400">Features</a>
          <a href="#showcase" className="hover:text-purple-400">Showcase</a>
          <a href="#contact" className="hover:text-purple-400">Contact</a>
        </div>
      </div>
    </nav>
  )
}