import Job from "../models/job.model.js";


const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      skills,
    } = req.body;

    if (
      !title ||
      !description ||
      !company ||
      !location ||
      !salary
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, company, location and salary are required",
      });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      skills: skills || [],
      recruiter: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};


// Get All Jobs - Search + Filter + Pagination
const getAllJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      skills,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search by title, description or company
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      query.skills = {
        $in: skillsArray.map(
          (skill) => new RegExp(`^${skill}$`, "i")
        ),
      };
    }

    // Salary filter
    if (minSalary || maxSalary) {
      query.salary = {};

      if (minSalary) {
        query.salary.$gte = Number(minSalary);
      }

      if (maxSalary) {
        query.salary.$lte = Number(maxSalary);
      }
    }

    // Pagination
    const currentPage = Math.max(Number(page) || 1, 1);
    const itemsPerPage = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const skip = (currentPage - 1) * itemsPerPage;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(itemsPerPage),

      Job.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};
// Get Single Job
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own jobs",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own jobs",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { createJob, getAllJobs,getJobById, updateJob, deleteJob, };