import fs from "fs";
import path from "path";

import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";

import matchResumeToJob from "../utils/matchResumeToJob.js";
import extractPdfText from "../utils/extractPdfText.js";
import analyzeResumeWithAI from "../utils/analyzeResumeWithAI.js";

// Upload a new resume
const uploadResume = async (req, res, next) => {
  try {
    console.log("REQ FILE:", req.file);
    console.log("CONTENT TYPE:", req.headers["content-type"]);

    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    // Check PDF type
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF resumes are allowed",
      });
    }

    // Extract text from PDF
    const extractedText = await extractPdfText(req.file.path);

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Could not extract readable text from resume PDF",
      });
    }

    console.log("Resume text extracted successfully");

    // Analyze resume using Gemini AI
    const analysis = await analyzeResumeWithAI(extractedText);

    console.log("Resume AI analysis completed successfully");

    // Convert Windows path to URL-style path
   const fileUrl = `/uploads/resumes/${req.file.filename}`;

    // Resume data
    const resumeData = {
      candidate: req.user._id,

      fileName: req.file.originalname,

      fileUrl,

      fileType: "pdf",

      fileSize: req.file.size,

      extractedText,

      score: analysis.score,

      skills: analysis.skills || [],

      strengths: analysis.strengths || [],

      weaknesses: analysis.weaknesses || [],

      missingSkills: analysis.missingSkills || [],

      suggestions: analysis.suggestions || [],

      aiSummary: analysis.summary || "",
    };

    // Always create a new resume
    const resume = await Resume.create(resumeData);

    return res.status(201).json({
      success: true,
      message: "Resume uploaded and analyzed successfully",
      resume,
    });
  } catch (error) {
    console.error("Resume upload/AI analysis error:", error);

    // Delete uploaded file if processing fails
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    next(error);
  }
};

// Match a selected resume with a job
const matchResumeWithJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { resumeId } = req.query;

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Find selected resume or latest resume
    const resumeQuery = {
      candidate: req.user._id,
    };

    if (resumeId) {
      resumeQuery._id = resumeId;
    }

    const resume = await Resume.findOne(resumeQuery).sort({
      createdAt: -1,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Please upload your resume first",
      });
    }

    // Match resume skills with job skills
    const match = matchResumeToJob(
      resume.skills || [],
      job.skills || []
    );

    return res.status(200).json({
      success: true,

      job: {
        id: job._id,
        title: job.title,
        company: job.company,
        skills: job.skills,
      },

      resume: {
        id: resume._id,
        fileName: resume.fileName,
        score: resume.score,
      },

      match,
    });
  } catch (error) {
    next(error);
  }
};

// Get all resumes of logged-in candidate
const getMyResume = async (req, res, next) => {
  try {
    const resumes = await Resume.find({
      candidate: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (resumes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
        resumes: [],
      });
    }

    return res.status(200).json({
      success: true,

      // Latest resume for backward compatibility
      resume: resumes[0],

      // All resumes for resume selection during apply
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a specific resume
const deleteMyResume = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      candidate: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Delete physical file
    if (resume.fileUrl) {
      const filePath = path.join(process.cwd(), resume.fileUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete database record
    await Resume.findByIdAndDelete(resume._id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  uploadResume,
  getMyResume,
  deleteMyResume,
  matchResumeWithJob,
};