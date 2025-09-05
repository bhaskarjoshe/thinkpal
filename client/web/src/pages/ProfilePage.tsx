import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Code,
  Heart,
  Laptop,
  FileText,
  Award,
  Users,
  LogOut,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useChatStore } from "../store/chatStore";

const ProfilePage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { userData } = useUserStore();

  const handleLogout = () => {
    useChatStore.getState().resetStore();
    logout();
    navigate("/");
  };

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Badge = ({ text, variant = "default" }) => {
    const variants = {
      default: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]}`}
      >
        {text}
      </span>
    );
  };

  const extractProjects = (resumeData) => {
    if (!resumeData) return [];
    const projects = [];
    const lines = resumeData.split("\n");
    let inProjectsSection = false;
    let currentProject = null;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine === "Projects") {
        inProjectsSection = true;
        return;
      }
      if (
        trimmedLine === "Achievements / Extracurriculars" ||
        trimmedLine.startsWith("Achievements")
      ) {
        inProjectsSection = false;
        return;
      }
      if (inProjectsSection && trimmedLine && trimmedLine.includes(" - ")) {
        if (currentProject) projects.push(currentProject);
        const [title, description] = trimmedLine.split(" - ");
        currentProject = { title, description };
      }
    });
    if (currentProject) projects.push(currentProject);
    return projects;
  };

  if (!userData) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const projects = userData.resume_data
    ? extractProjects(userData.resume_data.resume_data)
    : [];
  const analysisData = userData.resume_analysis?.ui_components?.[0];

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {userData.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userData.name}
                  </h1>
                  <p className="text-gray-600">{userData.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <InfoCard icon={User} title="Basic Information">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      Semester {userData.semester || "N/A"}
                    </span>
                  </div>
                </div>
              </InfoCard>

              <InfoCard icon={Code} title="Technical Skills">
                <div className="space-y-4">
                  {userData.skills && userData.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Core Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, idx) => (
                          <Badge key={idx} text={skill} variant="green" />
                        ))}
                      </div>
                    </div>
                  )}
                  {userData.programming_languages &&
                    userData.programming_languages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Programming Languages
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {userData.programming_languages.map((lang, idx) => (
                            <Badge key={idx} text={lang} variant="purple" />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </InfoCard>

              {userData.interests && userData.interests.length > 0 && (
                <InfoCard icon={Heart} title="Interests">
                  <div className="flex flex-wrap gap-2">
                    {userData.interests.map((interest, idx) => (
                      <Badge key={idx} text={interest} variant="orange" />
                    ))}
                  </div>
                </InfoCard>
              )}
            </div>

            {/* Right Column - Projects & Analysis */}
            <div className="lg:col-span-2 space-y-6">
              {/* Projects */}
              {projects.length > 0 && (
                <InfoCard icon={Laptop} title="Projects">
                  <div className="space-y-4">
                    {projects.map((project, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 border-blue-500 pl-4 py-2"
                      >
                        <h4 className="font-medium text-gray-900">
                          {project.title}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Resume Analysis Summary */}
              {analysisData && (
                <InfoCard icon={FileText} title="Profile Analysis">
                  <div className="space-y-4">
                    {analysisData.summary && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Summary
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {analysisData.summary}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisData.strengths &&
                        analysisData.strengths.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">
                              Strengths
                            </h4>
                            <ul className="space-y-1">
                              {analysisData.strengths
                                .slice(0, 3)
                                .map((strength, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-gray-600 flex items-start gap-2"
                                  >
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {strength}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                      {analysisData.areas_for_improvement &&
                        analysisData.areas_for_improvement.length > 0 && (
                          <div>
                            <h4 className="font-medium text-orange-700 mb-2">
                              Areas to Improve
                            </h4>
                            <ul className="space-y-1">
                              {analysisData.areas_for_improvement
                                .slice(0, 3)
                                .map((area, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-gray-600 flex items-start gap-2"
                                  >
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                    {area}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </InfoCard>
              )}

              {/* Recommended Roles */}
              {analysisData?.recommended_roles &&
                analysisData.recommended_roles.length > 0 && (
                  <InfoCard icon={Users} title="Suitable Career Paths">
                    <div className="flex flex-wrap gap-2">
                      {analysisData.recommended_roles.map((role, idx) => (
                        <Badge key={idx} text={role} />
                      ))}
                    </div>
                  </InfoCard>
                )}

              {/* Skills Analysis */}
              {analysisData?.skill_gap_analysis && (
                <InfoCard icon={Award} title="Skill Assessment">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysisData.skill_gap_analysis.current_skills &&
                      analysisData.skill_gap_analysis.current_skills.length >
                        0 && (
                        <div>
                          <h4 className="font-medium text-green-700 mb-3">
                            Current Skills
                          </h4>
                          <div className="space-y-2">
                            {analysisData.skill_gap_analysis.current_skills.map(
                              (skill, idx) => (
                                <div
                                  key={idx}
                                  className="text-sm text-gray-700 flex items-center gap-2"
                                >
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  {skill}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    {analysisData.skill_gap_analysis.missing_in_demand_skills &&
                      analysisData.skill_gap_analysis.missing_in_demand_skills
                        .length > 0 && (
                        <div>
                          <h4 className="font-medium text-orange-700 mb-3">
                            Skills to Develop
                          </h4>
                          <div className="space-y-2">
                            {analysisData.skill_gap_analysis.missing_in_demand_skills
                              .slice(0, 5)
                              .map((skill, idx) => (
                                <div
                                  key={idx}
                                  className="text-sm text-gray-700 flex items-center gap-2"
                                >
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  {skill}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                </InfoCard>
              )}

              {/* Academic Alignment */}
              {analysisData?.academic_alignment && (
                <InfoCard icon={Calendar} title="Academic Recommendations">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Current Status
                        </h4>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Semester:</span>{" "}
                          {analysisData.academic_alignment.semester}
                        </p>
                        {analysisData.academic_alignment.projects_alignment && (
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">
                              Project Assessment:
                            </span>{" "}
                            {analysisData.academic_alignment.projects_alignment}
                          </p>
                        )}
                      </div>
                    </div>

                    {analysisData.academic_alignment
                      .future_academics_suggestion &&
                      analysisData.academic_alignment
                        .future_academics_suggestion.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Future Course Recommendations
                          </h4>
                          <div className="space-y-2">
                            {analysisData.academic_alignment.future_academics_suggestion.map(
                              (suggestion, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-gray-700 text-sm">
                                    {suggestion}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </InfoCard>
              )}

              {/* Next Steps */}
              {analysisData?.next_steps &&
                analysisData.next_steps.length > 0 && (
                  <InfoCard icon={FileText} title="Next Steps">
                    <div className="space-y-3">
                      {analysisData.next_steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-gray-700 text-sm pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </InfoCard>
                )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
