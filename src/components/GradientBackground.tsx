export default function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute w-[900px] h-[900px] bg-purple-600/40 blur-[200px] rounded-full top-[-200px] left-[-200px] animate-pulse"></div>
      <div className="absolute w-[700px] h-[700px] bg-indigo-500/40 blur-[180px] rounded-full bottom-[-200px] right-[-200px] animate-pulse"></div>
    </div>
  )
}