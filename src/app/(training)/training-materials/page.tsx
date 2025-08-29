export default function TrainingMaterialsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Training Materials</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Here you will find study guides, manuals, video tutorials, and
        documentation for employee training sessions.
      </p>

      <ul className="mt-4 space-y-2">
        <li className="p-3 border rounded-lg bg-white dark:bg-gray-900 shadow">
          ✅ Onboarding Guide
        </li>
        <li className="p-3 border rounded-lg bg-white dark:bg-gray-900 shadow">
          📘 Safety & Compliance Handbook
        </li>
        <li className="p-3 border rounded-lg bg-white dark:bg-gray-900 shadow">
          🎥 Recorded Training Sessions
        </li>
      </ul>
    </div>
  );
}
