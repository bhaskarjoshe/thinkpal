import React from "react";
import { CheckCircle, TrendingUp, Target, BookOpen, Users, AlertCircle } from "lucide-react";

// Mock data for demonstration
const mockComponent = {
  summary: "A well-rounded software engineering candidate with strong technical fundamentals and project experience. Shows good understanding of modern development practices with room for growth in enterprise-level technologies.",
  strengths: [
    "Strong programming fundamentals in Python and JavaScript",
    "Good project portfolio demonstrating practical skills",
    "Clear communication and documentation abilities",
    "Understanding of modern development workflows"
  ],
  areas_for_improvement: [
    "Limited experience with cloud platforms and DevOps",
    "Could benefit from more collaborative project experience",
    "Backend architecture knowledge needs strengthening",
    "Missing industry-standard testing practices"
  ],
  next_steps: [
    "Complete a cloud certification (AWS or Azure)",
    "Contribute to open-source projects",
    "Build a full-stack application with proper testing",
    "Network with industry professionals through tech meetups"
  ],
  recommended_roles: [
    "Frontend Developer",
    "Full Stack Developer",
    "Software Engineer Intern",
    "Junior Web Developer",
    "Technical Analyst"
  ],
  skill_gap_analysis: {
    current_skills: [
      "React.js and JavaScript ES6+",
      "Python programming",
      "Git version control",
      "HTML/CSS and responsive design",
      "Basic database concepts"
    ],
    missing_in_demand_skills: [
      "AWS/Azure cloud services",
      "Docker containerization",
      "TypeScript",
      "Test-driven development",
      "CI/CD pipelines",
      "System design principles"
    ]
  },
  academic_alignment: {
    semester: "6th Semester",
    projects_alignment: "Projects show good technical implementation but lack real-world complexity and scale",
    future_academics_suggestion: [
      "Take advanced algorithms and data structures course",
      "Enroll in software engineering methodology class",
      "Consider distributed systems elective",
      "Participate in coding competitions or hackathons"
    ]
  }
};

const ResumeReport = () => {
  const component = mockComponent;

  const Section = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 flex-1">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg">
        
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Resume Analysis Report
          </h1>
          <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          
          {/* Summary */}
          <Section title="Executive Summary" icon={CheckCircle}>
            <p className="text-gray-700 leading-relaxed">
              {component.summary}
            </p>
          </Section>

          {/* Strengths */}
          <Section title="Key Strengths" icon={TrendingUp}>
            <div className="space-y-2">
              {component.strengths?.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                  <p className="text-gray-700">{strength}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Areas for Improvement */}
          <Section title="Areas for Improvement" icon={AlertCircle}>
            <div className="space-y-2">
              {component.areas_for_improvement?.map((area, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2.5 flex-shrink-0"></div>
                  <p className="text-gray-700">{area}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Next Steps */}
          <Section title="Recommended Action Plan" icon={Target}>
            <div className="space-y-3">
              {component.next_steps?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Recommended Roles */}
          <Section title="Suitable Career Paths" icon={Users}>
            <div className="flex flex-wrap gap-2">
              {component.recommended_roles?.map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200 font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </Section>

          {/* Skill Gap Analysis */}
          <Section title="Skill Assessment" icon={BookOpen}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-3 text-green-700">Current Skills</h3>
                <div className="space-y-2">
                  {component.skill_gap_analysis?.current_skills?.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3 text-orange-700">Skills to Develop</h3>
                <div className="space-y-2">
                  {component.skill_gap_analysis?.missing_in_demand_skills?.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-700 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Academic Alignment */}
          <Section title="Academic Recommendations" icon={BookOpen} className="pb-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-medium">Semester:</span> {component.academic_alignment?.semester}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Project Assessment:</span> {component.academic_alignment?.projects_alignment}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Future Course Recommendations</h4>
                <div className="space-y-2">
                  {component.academic_alignment?.future_academics_suggestion?.map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default ResumeReport;