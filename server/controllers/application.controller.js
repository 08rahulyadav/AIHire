import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import Resume from "../models/resume.model.js";
import Notification from "../models/notification.model.js";
import sendEmail from "../utils/sendEmail.js";

// ======================================================
// APPLY FOR JOB
// ======================================================

const applyForJob = async (req, res, next) => {
  try {
    // jobId comes from URL: /applications/:jobId
    // resumeId and coverLetter come from body
    const jobId = req.params.jobId || req.body.jobId;
    const { resumeId, coverLetter } = req.body;

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

    // Selected resume must belong to logged-in candidate
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
      coverLetter: coverLetter?.trim() || "",
    });

    // Notify recruiter
    if (job.recruiter) {
      try {
        await Notification.create({
          recipient: job.recruiter,
          type: "new_application",
          title: "New Job Application",
          message: `A candidate has applied for your job: ${job.title}.`,
          relatedApplication: application._id,
        });
      } catch (notificationError) {
        console.error(
          "Recruiter notification error:",
          notificationError
        );
      }
    }

    // Populate response
    const populatedApplication =
      await Application.findById(application._id)
        .populate(
          "job",
          "title company location salary description skills jobType"
        )
        .populate("candidate", "name email")
        .populate("recruiter", "name email")
        .populate(
          "resume",
          "fileName fileUrl score skills"
        );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: populatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET MY APPLICATIONS - CANDIDATE
// ======================================================

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate(
        "job",
        "title company location salary description skills jobType"
      )
      .populate("recruiter", "name email")
      .populate(
        "resume",
        "fileName fileUrl score skills"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET SINGLE APPLICATION - CANDIDATE
// ======================================================

const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
      candidate: req.user._id,
    })
      .populate(
        "job",
        "title company location salary description skills jobType"
      )
      .populate("recruiter", "name email")
      .populate(
        "resume",
        "fileName fileUrl score skills"
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET RECRUITER APPLICATIONS
// ======================================================

const getRecruiterApplications = async (
  req,
  res,
  next
) => {
  try {
    const applications = await Application.find({
      recruiter: req.user._id,
    })
      .populate(
        "job",
        "title company location salary description skills jobType"
      )
      .populate("candidate", "name email")
      .populate(
        "resume",
        "fileName fileUrl score skills"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
      "withdrawn",
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

    // Candidate notification
    await Notification.create({
      recipient: application.candidate._id,
      type: "application_status",
      title: "Application Status Updated",
      message: `Your application status has been updated to ${status}.`,
      relatedApplication: application._id,
    });

    // Candidate email
    try {
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
    } catch (emailError) {
      console.error("Application email error:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CANDIDATE APPLICATION STATS
// ======================================================

const getCandidateApplicationStats = async (
  req,
  res,
  next
) => {
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
      if (
        Object.prototype.hasOwnProperty.call(
          result,
          item._id
        )
      ) {
        result[item._id] = item.count;
      }

      result.totalApplications += item.count;
    });

    return res.status(200).json({
      success: true,
      stats: result,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// RECRUITER APPLICATION STATS
// ======================================================

const getRecruiterApplicationStats = async (
  req,
  res,
  next
) => {
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
      if (
        Object.prototype.hasOwnProperty.call(
          result,
          item._id
        )
      ) {
        result[item._id] = item.count;
      }

      result.totalApplicants += item.count;
    });

    const totalJobs = await Job.countDocuments({
      recruiter: req.user._id,
    });

    return res.status(200).json({
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

// ======================================================
// RECENT CANDIDATE APPLICATIONS
// ======================================================

const getRecentCandidateApplications = async (
  req,
  res,
  next
) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate(
        "job",
        "title company location salary"
      )
      .populate("recruiter", "name email")
      .populate(
        "resume",
        "fileName fileUrl score skills"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// RECENT RECRUITER APPLICATIONS
// ======================================================

const getRecentRecruiterApplications = async (
  req,
  res,
  next
) => {
  try {
    const applications = await Application.find({
      recruiter: req.user._id,
    })
      .populate(
        "job",
        "title company location salary"
      )
      .populate("candidate", "name email")
      .populate(
        "resume",
        "fileName fileUrl score skills"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// EXPORTS
// ======================================================

export {
  applyForJob,
  getMyApplications,
  getApplicationById,
  getRecruiterApplications,
  updateApplicationStatus,
  getCandidateApplicationStats,
  getRecruiterApplicationStats,
  getRecentCandidateApplications,
  getRecentRecruiterApplications,
};