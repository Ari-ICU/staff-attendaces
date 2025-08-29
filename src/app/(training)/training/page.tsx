import TrainingSection from "@/components/training/TrainingSection";

export default function TrainingPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Training</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <TrainingSection
          title="Training Materials"
          description="Browse training resources, presentations, and documents."
          link="/training-materials"
        />
      </div>
    </div>
  );
}
