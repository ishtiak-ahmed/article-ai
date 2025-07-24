import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">
        Oops! The page you&#39;re looking for doesn&#39;t exist.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        ← Return to Home
      </Link>
    </div>
  )
}
