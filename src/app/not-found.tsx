import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-base md:text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been removed or the link is incorrect.
        </p>
        <Link 
          href="/dashboard"
          className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-base font-medium dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Return to Dashboard
        </Link>
      </div>
      
      {/* Decorative element */}
      <div className="mt-12 opacity-20 dark:opacity-10">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 md:h-24 md:w-24 text-gray-800 dark:text-gray-100" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
    </div>
  );
}