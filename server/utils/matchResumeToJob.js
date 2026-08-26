const matchResumeToJob = (resumeSkills = [], jobSkills = []) => {
  const resumeSkillSet = new Set(
    resumeSkills.map((skill) => skill.toLowerCase().trim())
  );

  const normalizedJobSkills = jobSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const matchedSkills = normalizedJobSkills.filter((skill) =>
    resumeSkillSet.has(skill)
  );

  const missingSkills = normalizedJobSkills.filter(
    (skill) => !resumeSkillSet.has(skill)
  );

  const totalSkills = normalizedJobSkills.length;

  const matchPercentage =
    totalSkills === 0
      ? 0
      : Math.round((matchedSkills.length / totalSkills) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    totalRequiredSkills: totalSkills,
    totalMatchedSkills: matchedSkills.length,
  };
};

export default matchResumeToJob;