const analyzeResume = (text) => {
  const resumeText = text.toLowerCase();

  const skillList = [
    "javascript",
    "typescript",
    "react",
    "redux",
    "next.js",
    "tailwind css",
    "html5",
    "css3",
    "node.js",
    "express.js",
    "mongodb",
    "rest api",
    "jwt",
    "socket.io",
    "aws",
    "aws lambda",
    "dynamodb",
    "api gateway",
    "sns",
    "s3",
    "git",
    "github",
    "postman",
  ];

  const skills = skillList.filter((skill) =>
    resumeText.includes(skill)
  );

  const strengths = [];

  if (skills.length >= 10) {
    strengths.push("Strong technical skill coverage");
  } else if (skills.length >= 6) {
    strengths.push("Good technical skill coverage");
  } else {
    strengths.push("Basic technical skill coverage");
  }

  if (
    resumeText.includes("experience") ||
    resumeText.includes("developer")
  ) {
    strengths.push("Professional experience is mentioned");
  }

  if (
    resumeText.includes("project") ||
    resumeText.includes("projects")
  ) {
    strengths.push("Projects are mentioned");
  }

  if (
    resumeText.includes("github") &&
    resumeText.includes("linkedin")
  ) {
    strengths.push("GitHub and LinkedIn profiles are mentioned");
  }

  const weaknesses = [];

  if (!resumeText.includes("summary")) {
    weaknesses.push("Professional summary is missing");
  }

  if (!resumeText.includes("achievement")) {
    weaknesses.push("More measurable achievements can be added");
  }

  if (!resumeText.includes("certification")) {
    weaknesses.push("Certifications can be added");
  }

  if (skills.length < 6) {
    weaknesses.push("More relevant technical skills can be added");
  }

  // Calculate score
  let score = 40;

  score += Math.min(skills.length * 2, 30);

  if (
    resumeText.includes("experience") ||
    resumeText.includes("developer")
  ) {
    score += 10;
  }

  if (
    resumeText.includes("project") ||
    resumeText.includes("projects")
  ) {
    score += 8;
  }

  if (resumeText.includes("github")) {
    score += 4;
  }

  if (resumeText.includes("linkedin")) {
    score += 4;
  }

  if (resumeText.includes("certification")) {
    score += 4;
  }

  score = Math.min(score, 100);

  return {
    score,
    skills,
    strengths,
    weaknesses,
  };
};

export default analyzeResume;