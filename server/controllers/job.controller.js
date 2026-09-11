import Job from "../models/job.model.js";

// ==========================================
// CREATE JOB
// ==========================================

const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      skills,
      jobType,
      type,
    } = req.body;

    if (
      !title ||
      !description ||
      !company ||
      !location ||
      salary === undefined ||
      salary === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, company, location and salary are required",
      });
    }

    const salaryNumber = Number(
      String(salary).replace(/[₹,\s]/g, "")
    );

    if (Number.isNaN(salaryNumber)) {
      return res.status(400).json({
        success: false,
        message: "Salary must be a valid number",
      });
    }

    let skillsArray = [];

    if (Array.isArray(skills)) {
      skillsArray = skills
        .map((skill) => String(skill).trim())
        .filter(Boolean);
    } else if (typeof skills === "string") {
      skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      company: company.trim(),
      location: location.trim(),
      salary: salaryNumber,
      skills: skillsArray,
      jobType: jobType || type || "Full-time",
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

// ==========================================
// GET ALL JOBS
// ==========================================

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

    // Search
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Location
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Skills
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

    // Salary
    if (minSalary || maxSalary) {
      query.salary = {};

      if (minSalary) {
        query.salary.$gte = Number(minSalary);
      }

      if (maxSalary) {
        query.salary.$lte = Number(maxSalary);
      }
    }

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const itemsPerPage = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const skip =
      (currentPage - 1) * itemsPerPage;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(itemsPerPage),

      Job.countDocuments(query),
    ]);

    const totalPages = Math.ceil(
      total / itemsPerPage
    );

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

// ==========================================
// GET MY JOBS
// ==========================================

const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user._id,
    })
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET SINGLE JOB
// ==========================================

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(
      req.params.id
    ).populate("recruiter", "name email");

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

// ==========================================
// UPDATE JOB
// ==========================================

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.recruiter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update your own jobs",
      });
    }

    const updateData = {
      ...req.body,
    };

    if (updateData.salary !== undefined) {
      const salaryNumber = Number(
        String(updateData.salary).replace(
          /[₹,\s]/g,
          ""
        )
      );

      if (Number.isNaN(salaryNumber)) {
        return res.status(400).json({
          success: false,
          message:
            "Salary must be a valid number",
        });
      }

      updateData.salary = salaryNumber;
    }

    if (typeof updateData.skills === "string") {
      updateData.skills = updateData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    const updatedJob =
      await Job.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "recruiter",
        "name email"
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

// ==========================================
// DELETE JOB
// ==========================================

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.recruiter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own jobs",
      });
    }

    await Job.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORTS
// ==========================================

export {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
};