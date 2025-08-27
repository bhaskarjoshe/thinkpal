export const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
  label: `Semester ${i + 1}`,
  value: (i + 1).toString(),
}));


export const skillOptions = [
  { label: "C", value: "C" },
  { label: "C++", value: "C++" },
  { label: "Java", value: "Java" },
  { label: "Python", value: "Python" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "React", value: "React" },
  { label: "Node.js", value: "Node.js" },
  { label: "SQL", value: "SQL" },
  { label: "MongoDB", value: "MongoDB" },
  { label: "Machine Learning", value: "ML" },
  { label: "AI", value: "AI" },
  { label: "DevOps", value: "DevOps" },
  { label: "UI/UX", value: "UI/UX" },
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
];
