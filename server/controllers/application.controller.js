import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";
import Notification from "../models/notification.model.js";
import sendEmail from "../utils/sendEmail.js";

// Apply for a job
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, resumeId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Verify that the selected resume belongs to the logged-in candidate
    const resume = await Resume.findOne({
      _id: resumeId,
      candidate: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Selected resume not found",
      });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      recruiter: job.recruiter,
      resume: resume._id,
      coverLetter: coverLetter || "",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// Get candidate's applications
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate("job", "title company location salary")
      .populate("recruiter", "name email")
      .populate("resume", "fileName fileUrl score skills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// Get recruiter's applications
const getRecruiterApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      recruiter: req.user._id,
    })
      .populate("job", "title company location salary")
      .populate("candidate", "name email")
      .populate("resume", "fileName fileUrl score skills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// Update application status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const application = await Application.findOne({
      _id: req.params.applicationId,
      recruiter: req.user._id,
    }).populate("candidate", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;

    await application.save();

    // Create notification for candidate
    await Notification.create({
      recipient: application.candidate._id,
      type: "application_status",
      title: "Application Status Updated",
      message: `Your application status has been updated to ${status}.`,
      relatedApplication: application._id,
    });

    // Send email to candidate
    await sendEmail({
      to: application.candidate.email,
      subject: "AIHire - Application Status Updated",
      text: `Hello ${application.candidate.name},

Your application status has been updated to: ${status}.

You can log in to AIHire to view your application details.

Thank you for using AIHire.

Regards,
AIHire Team`,
    });

    res.status(200).json({
      success: true,
      message: "Application status updated and email sent successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// Get candidate application statistics
const getCandidateApplicationStats = async (req, res, next) => {
  try {
    const stats = await Application.aggregate([
      {
        $match: {
          candidate: req.user._id,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      totalApplications: 0,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
      withdrawn: 0,
    };

    stats.forEach((item) => {
      result[item._id] = item.count;
      result.totalApplications += item.count;
    });

    res.status(200).json({
      success: true,
      stats: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get recruiter application statistics
const getRecruiterApplicationStats = async (req, res, next) => {
  try {
    const stats = await Application.aggregate([
      {
        $match: {
          recruiter: req.user._id,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      totalApplicants: 0,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
      withdrawn: 0,
    };

    stats.forEach((item) => {
      result[item._id] = item.count;
      result.totalApplicants += item.count;
    });

    const totalJobs = await Job.countDocuments({
      recruiter: req.user._id,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get candidate's recent applications
const getRecentCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate("job", "title company location salary")
      .populate("recruiter", "name email")
      .populate("resume", "fileName fileUrl score skills")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// Get recruiter's recent applications
const getRecentRecruiterApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      recruiter: req.user._id,
    })
      .populate("job", "title company location salary")
      .populate("candidate", "name email")
      .populate("resume", "fileName fileUrl score skills")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

export {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  getCandidateApplicationStats,
  getRecruiterApplicationStats,
  getRecentCandidateApplications,
  getRecentRecruiterApplications,
};