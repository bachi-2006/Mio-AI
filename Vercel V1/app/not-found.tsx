import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-900 to-secondary-900 text-white p-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-white">M</span>
      </div>
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-center max-w-md mb-8 text-secondary-200">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors">
        Return Home
      </Link>
    </div>
  )
}
