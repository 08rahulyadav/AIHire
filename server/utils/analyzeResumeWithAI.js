import ai from "./gemini.js";

const analyzeResumeWithAI = async (resumeText) => {
  try {
    const prompt = `
You are an expert technical recruiter.

Analyze the following resume and return ONLY valid JSON.

RESUME:
${resumeText}

Return exactly this structure:

{
  "score": 0,
  "skills": [],
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": [],
  "summary": ""
}

Rules:

1. score must be a number between 0 and 100.

2. skills must contain the technical skills actually found in the resume.

3. strengths must contain specific strengths based on the resume.

4. weaknesses must contain realistic areas for improvement based on the resume.

5. missingSkills should contain useful technical skills that are not present in the resume but could improve the candidate's profile.

6. suggestions should contain practical resume improvement suggestions.

7. summary should be a short professional summary of the candidate.

8. Do not invent work experience, education, projects, or skills.

9. Do not use Markdown.

10. Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    // Remove Markdown code fences if Gemini adds them
    const cleanText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(cleanText);
    } catch (error) {
      console.error(
        "Gemini JSON parsing error:",
        cleanText
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    return {
      score:
        typeof analysis.score === "number"
          ? Math.min(100, Math.max(0, analysis.score))
          : 0,

      skills: Array.isArray(analysis.skills)
        ? analysis.skills
        : [],

      strengths: Array.isArray(analysis.strengths)
        ? analysis.strengths
        : [],

      weaknesses: Array.isArray(analysis.weaknesses)
        ? analysis.weaknesses
        : [],

      missingSkills: Array.isArray(
        analysis.missingSkills
      )
        ? analysis.missingSkills
        : [],

      suggestions: Array.isArray(
        analysis.suggestions
      )
        ? analysis.suggestions
        : [],

      summary:
        typeof analysis.summary === "string"
          ? analysis.summary
          : "",
    };
  } catch (error) {
    console.error(
      "AI resume analysis error:",
      error
    );

    throw error;
  }
};

export default analyzeResumeWithAI;