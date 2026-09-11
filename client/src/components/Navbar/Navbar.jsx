import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiBriefcase, FiPlusCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const role = user?.role?.toLowerCase();

  const isRecruiter = role === "recruiter";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login", { replace: true });
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

        {/* Logo */}
        <Link
          to={isRecruiter ? "/recruiter/dashboard" : "/candidate/dashboard"}
          className="text-2xl font-bold text-blue-500"
        >
          AIHire
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">

          {isRecruiter ? (
            <>
              {/* Recruiter Dashboard */}
              <Link
                to="/recruiter/dashboard"
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Dashboard
              </Link>

              {/* Create Job */}
              <Link
                to="/recruiter/create-job"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                <FiPlusCircle />
                Create Job
              </Link>

              {/* My Jobs */}
              <Link
                to="/recruiter/jobs"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                <FiBriefcase />
                My Jobs
              </Link>

              {/* Applicants */}
              <Link
                to="/recruiter/applications"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                <FiUser />
                Applicants
              </Link>
            </>
          ) : (
            <>
              {/* Candidate Dashboard */}
              <Link
                to="/candidate/dashboard"
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Dashboard
              </Link>

              {/* Jobs */}
              <Link
                to="/candidate/jobs"
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Jobs
              </Link>

              {/* Applications */}
              <Link
                to="/candidate/applications"
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Applications
              </Link>

              {/* Profile */}
              <Link
                to="/candidate/profile"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                <FiUser />
                Profile
              </Link>
            </>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300"
          >
            <FiLogOut />
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;