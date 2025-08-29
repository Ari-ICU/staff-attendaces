import HrSection from "@/components/hr/HrSection";

export default function HrPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Human Resources (HR)</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <HrSection
          title="HR Policies"
          description="View and manage organizational HR policies."
          link="/hr/policies"
        />
        <HrSection
          title="HR Reports"
          description="Access HR reports and analytics."
          link="/hr/reports"
        />
      </div>
    </div>
  );
}
