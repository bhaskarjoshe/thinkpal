import React from "react";
import type { UIComponent } from "../../types/types";

const ResumeReport: React.FC<{ component: UIComponent }> = ({ component }) => {

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <div className="pb-4 mb-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Resume Analysis Report
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Summary */}
        <Section title="Summary">
          <p className="text-gray-700">{component.summary}</p>
        </Section>

        {/* Strengths */}
        <Section title="Strengths">
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            {component.strengths?.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </Section>

        {/* Areas for Improvement */}
        <Section title="Areas for Improvement">
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            {component.areas_for_improvement?.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </Section>

        {/* Next Steps */}
        <Section title="Next Steps">
          <ol className="list-decimal pl-6 space-y-1 text-gray-700">
            {component.next_steps?.map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ol>
        </Section>

        {/* Recommended Roles */}
        <Section title="Recommended Roles">
          <div className="flex flex-wrap gap-2">
            {component.recommended_roles?.map((r, idx) => (
              <div
                key={idx}
                className="px-3 py-1 text-sm border rounded-lg bg-gray-50 text-gray-800"
              >
                {r}
              </div>
            ))}
          </div>
        </Section>

        {/* Skill Gap Analysis */}
        <Section title="Skill Gap Analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-1">Current Skills</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {component.skill_gap_analysis?.current_skills?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-1">Missing / In-Demand Skills</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {component.skill_gap_analysis?.missing_in_demand_skills?.map(
                  (s, idx) => (
                    <li key={idx}>{s}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </Section>

        {/* Academic Alignment */}
        <Section title="Academic Alignment">
          <p className="text-gray-700 mb-3">
            <strong>Semester:</strong> {component.academic_alignment?.semester}
          </p>
          <p className="text-gray-700 mb-3">
            <strong>Projects Alignment:</strong>{" "}
            {component.academic_alignment?.projects_alignment}
          </p>
          <div>
            <h3 className="font-medium mb-1">Future Academic Suggestions</h3>
            <ul className="list-disc pl-6 text-gray-700">
              {component.academic_alignment?.future_academics_suggestion?.map(
                (f, idx) => (
                  <li key={idx}>{f}</li>
                )
              )}
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default ResumeReport;
