import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";
import Application from "../models/application.model.js";
import ai from "../utils/gemini.js";

// ==========================================
// HELPERS
// ==========================================

const normalizeSkill = (skill) => {
  return String(skill || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const uniqueSkills = (skills = []) => {
  return [
    ...new Set(
      skills
        .map(normalizeSkill)
        .filter(Boolean)
    ),
  ];
};

const calculateSkillMatch = (
  resumeSkills,
  jobSkills
) => {
  const candidateSkills = uniqueSkills(resumeSkills);
  const requiredSkills = uniqueSkills(jobSkills);

  if (!requiredSkills.length) {
    return {
      matchPercentage: 0,
      matchingSkills: [],
      missingSkills: [],
    };
  }

  const matchingSkills = requiredSkills.filter((jobSkill) =>
    candidateSkills.some(
      (candidateSkill) =>
        candidateSkill === jobSkill ||
        candidateSkill.includes(jobSkill) ||
        jobSkill.includes(candidateSkill)
    )
  );

  const missingSkills = requiredSkills.filter(
    (jobSkill) => !matchingSkills.includes(jobSkill)
  );

  const matchPercentage = Math.round(
    (matchingSkills.length / requiredSkills.length) * 100
  );

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
  };
};

// ==========================================
// AI JOB RECOMMENDATIONS
// ==========================================

const getJobRecommendations = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    // ==========================================
    // 1. GET LATEST RESUME
    // ==========================================

    const resume = await Resume.findOne({
      candidate: candidateId,
    }).sort({
      createdAt: -1,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Please upload your resume first",
      });
    }

    const resumeSkills = uniqueSkills(
      resume.skills || []
    );

    if (!resumeSkills.length) {
      return res.status(400).json({
        success: false,
        message:
          "No skills found in your resume. Please upload or analyze your resume again.",
      });
    }

    // ==========================================
    // 2. GET ALREADY APPLIED JOBS
    // ==========================================

    const applications = await Application.find({
      candidate: candidateId,
    }).select("job");

    const appliedJobIds = applications
      .filter((application) => application.job)
      .map((application) => application.job.toString());

    // ==========================================
    // 3. GET AVAILABLE JOBS
    // ==========================================

    const jobs = await Job.find({
      _id: {
        $nin: appliedJobIds,
      },
    })
      .populate("recruiter", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(50);

    // ==========================================
    // 4. CALCULATE SKILL MATCH
    // ==========================================

    const scoredJobs = jobs
      .map((job) => {
        const {
          matchPercentage,
          matchingSkills,
          missingSkills,
        } = calculateSkillMatch(
          resumeSkills,
          job.skills || []
        );

        return {
          jobId: job._id.toString(),
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          jobType: job.jobType,
          description: job.description,
          skills: job.skills || [],

          matchingSkills,
          missingSkills,
          matchPercentage,

          recruiter: job.recruiter
            ? {
                _id: job.recruiter._id,
                name: job.recruiter.name,
              }
            : null,

          createdAt: job.createdAt,
        };
      })
      .filter((job) => job.matchPercentage > 0)
      .sort(
        (a, b) =>
          b.matchPercentage - a.matchPercentage
      );

    // ==========================================
    // NO MATCHING JOBS
    // ==========================================

    if (!scoredJobs.length) {
      return res.status(200).json({
        success: true,
        message: "No matching jobs found right now.",
        resumeSkills,
        recommendations: [],
      });
    }

    // ==========================================
    // 5. SEND TOP JOBS TO GEMINI
    // ==========================================

    const topJobs = scoredJobs.slice(0, 15);

    const jobData = topJobs.map((job) => ({
      jobId: job.jobId,
      title: job.title,
      company: job.company,
      skills: job.skills,
      matchPercentage: job.matchPercentage,
    }));

    let aiRecommendations = [];

    try {
      const prompt = `
You are an AI job recommendation engine.

Candidate skills:
${JSON.stringify(resumeSkills)}

Available jobs:
${JSON.stringify(jobData)}

Analyze which jobs are most suitable for this candidate.

Return ONLY valid JSON.

Use exactly this structure:

{
  "recommendations": [
    {
      "jobId": "job id",
      "reason": "short professional reason"
    }
  ]
}

Rules:

1. Only use job IDs provided in the Available jobs list.
2. Never invent a job ID.
3. Give a short reason based on the candidate skills and job skills.
4. Return maximum 10 recommendations.
5. Do not use markdown.
6. Return valid JSON only.
`;

     const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents: prompt,
});

console.log(response.text);
      const text = response.text?.trim();

      if (text) {
        const cleanText = text
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const parsed = JSON.parse(cleanText);

        if (Array.isArray(parsed.recommendations)) {
          aiRecommendations = parsed.recommendations;
        }
      }
    } catch (aiError) {
      console.error(
        "AI recommendation error:",
        aiError.message
      );

      // Gemini fail hone par basic skill matching continue rahega
      aiRecommendations = [];
    }

    // ==========================================
    // 6. MERGE AI REASON WITH SKILL MATCH
    // ==========================================

    const aiMap = new Map(
      aiRecommendations
        .filter((item) => item?.jobId)
        .map((item) => [
          String(item.jobId),
          item.reason || "",
        ])
    );

    const recommendations = topJobs
      .map((job) => ({
        ...job,

        aiReason:
          aiMap.get(job.jobId) ||
          `This job matches ${job.matchPercentage}% of the skills found in your resume.`,
      }))
      .slice(0, 10);

    // ==========================================
    // 7. RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      resume: {
        id: resume._id,
        fileName: resume.fileName,
        score: resume.score,
        skills: resumeSkills,
      },

      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getJobRecommendations,
};