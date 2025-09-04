export const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
  label: `Semester ${i + 1}`,
  value: (i + 1).toString(),
}));

export const skillOptions = [
  { label: "React", value: "React" },
  { label: "Node.js", value: "Node.js" },
  { label: "Django", value: "Django" },
  { label: "Spring Boot", value: "Spring Boot" },
  { label: "TensorFlow", value: "TensorFlow" },
  { label: "PyTorch", value: "PyTorch" },
  { label: "Docker", value: "Docker" },
  { label: "Kubernetes", value: "Kubernetes" },
  { label: "AWS", value: "AWS" },
  { label: "Azure", value: "Azure" },
  { label: "Figma", value: "Figma" },
  { label: "Git & GitHub", value: "GitHub" },
  { label: "Agile / Scrum", value: "Agile" },
  { label: "Data Structures & Algorithms", value: "DSA" },
  { label: "Operating Systems", value: "OS" },
];

export const interestOptions = [
  { label: "Web Development", value: "Web Development" },
  { label: "Mobile Development", value: "Mobile Development" },
  { label: "AI & ML", value: "AI & ML" },
  { label: "Data Science", value: "Data Science" },
  { label: "Cybersecurity", value: "Cybersecurity" },
  { label: "Open Source", value: "Open Source" },
  { label: "Competitive Programming", value: "Competitive Programming" },
  { label: "Blockchain", value: "Blockchain" },
  { label: "Game Development", value: "Game Development" },
  { label: "Cloud Computing", value: "Cloud Computing" },
  { label: "UI/UX Design", value: "UI/UX Design" },
  { label: "Robotics", value: "Robotics" },
  { label: "Embedded Systems", value: "Embedded Systems" },
  { label: "AR/VR", value: "AR/VR" },
];

export const languageOptions = [
  { label: "C", value: "C" },
  { label: "C++", value: "C++" },
  { label: "Java", value: "Java" },
  { label: "Python", value: "Python" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "Go", value: "Go" },
  { label: "Rust", value: "Rust" },
  { label: "Kotlin", value: "Kotlin" },
  { label: "Swift", value: "Swift" },
  { label: "PHP", value: "PHP" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "R", value: "R" },
  { label: "MATLAB", value: "MATLAB" },
  { label: "Scala", value: "Scala" },
];
