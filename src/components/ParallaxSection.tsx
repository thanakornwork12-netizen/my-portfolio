export default function ParallaxSection() {
  return (
    <section className="relative py-40 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')"
      }}
    >
      <div className="text-center">
        <h2 className="text-5xl font-bold">
          Engineering the Future
        </h2>
        <p className="mt-6 text-gray-300">
          Built for speed. Designed for clarity.
        </p>
      </div>
    </section>
  )
}