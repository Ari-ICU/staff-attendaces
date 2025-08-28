// app/page.tsx
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Welcome to the Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300">
        This is the main content area. The sidebar is visible on larger screens 
        and can be toggled on mobile devices.
      </p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Card 1</h3>
          <p className="text-gray-600 dark:text-gray-300">
            This is a sample card. The layout is responsive and works well across different screen sizes.
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Card 2</h3>
          <p className="text-gray-600 dark:text-gray-300">
            The sidebar can be collapsed on mobile devices and remains visible on larger screens.
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Card 3</h3>
          <p className="text-gray-600 dark:text-gray-300">
            The header includes a responsive navigation menu that turns into a hamburger menu on smaller screens.
          </p>
        </div>
      </div>
    </div>
  );
}
