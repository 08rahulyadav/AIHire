import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

// Candidate Dashboard
const getCandidateDashboard = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    const [applications, recentApplications] = await Promise.all([
      Application.aggregate([
        {
          $match: {
            candidate: candidateId,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Application.find({
        candidate: candidateId,
      })
        .populate("job", "title company location salary")
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const stats = {
      totalApplications: 0,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
      withdrawn: 0,
    };

    applications.forEach((item) => {
      stats[item._id] = item.count;
      stats.totalApplications += item.count;
    });

    res.status(200).json({
      success: true,
      dashboard: {
        stats,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Recruiter Dashboard
const getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    const [jobs, applications, recentApplications] = await Promise.all([
      Job.countDocuments({
        recruiter: recruiterId,
      }),

      Application.aggregate([
        {
          $match: {
            recruiter: recruiterId,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Application.find({
        recruiter: recruiterId,
      })
        .populate("job", "title company location salary")
        .populate("candidate", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const stats = {
      totalApplicants: 0,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
      withdrawn: 0,
    };

    applications.forEach((item) => {
      stats[item._id] = item.count;
      stats.totalApplicants += item.count;
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalJobs: jobs,
        stats,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getCandidateDashboard,
  getRecruiterDashboard,
};