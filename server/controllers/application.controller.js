import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import Notification from "../models/notification.model.js";
import sendEmail from "../utils/sendEmail.js";

// Apply for a job
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

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

    // Find application belonging to this recruiter
    // and get candidate details for email
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

    // Update status
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

export {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
};