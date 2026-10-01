import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLogOut,
  FiBriefcase,
  FiPlusCircle,
  FiMessageCircle,
  FiStar,
  FiMenu,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const role = user?.role?.toLowerCase();
  const isRecruiter = role === "recruiter";

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsMenuOpen(false);

    toast.success("Logged out successfully");

    navigate("/login", { replace: true });
  };

  const desktopLink =
    "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white";

  const mobileLink =
    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/95 shadow-lg shadow-black/5 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">

        {/* ==============================
            NAVBAR HEADER
        ============================== */}

        <div className="flex min-h-16 items-center justify-between gap-4 sm:min-h-18">

          {/* Logo */}
          <Link
            to={
              isRecruiter
                ? "/recruiter/dashboard"
                : "/candidate/dashboard"
            }
            onClick={closeMenu}
            className="shrink-0 text-2xl font-extrabold tracking-tight text-blue-500 transition hover:text-blue-400 sm:text-[26px]"
          >
            AI<span className="text-white">Hire</span>
          </Link>

          {/* ==============================
              DESKTOP NAVIGATION
          ============================== */}

          <div className="hidden items-center gap-1 lg:flex">

            {isRecruiter ? (
              <>
                <Link
                  to="/recruiter/dashboard"
                  className={desktopLink}
                >
                  Dashboard
                </Link>

                <Link
                  to="/recruiter/create-job"
                  className={desktopLink}
                >
                  <FiPlusCircle className="shrink-0 text-base" />
                  Create Job
                </Link>

                <Link
                  to="/recruiter/jobs"
                  className={desktopLink}
                >
                  <FiBriefcase className="shrink-0 text-base" />
                  My Jobs
                </Link>

                <Link
                  to="/recruiter/applications"
                  className={desktopLink}
                >
                  <FiUser className="shrink-0 text-base" />
                  Applicants
                </Link>

                <Link
                  to="/direct-chat"
                  className={desktopLink}
                >
                  <FiMessageCircle className="shrink-0 text-base" />
                  Messages
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/candidate/dashboard"
                  className={desktopLink}
                >
                  Dashboard
                </Link>

                <Link
                  to="/candidate/jobs"
                  className={desktopLink}
                >
                  Jobs
                </Link>

                <Link
                  to="/candidate/recommendations"
                  className={desktopLink}
                >
                  <FiStar className="shrink-0 text-base text-yellow-400" />
                  AI Jobs
                </Link>

                <Link
                  to="/candidate/applications"
                  className={desktopLink}
                >
                  Applications
                </Link>

                <Link
                  to="/direct-chat"
                  className={desktopLink}
                >
                  <FiMessageCircle className="shrink-0 text-base" />
                  Messages
                </Link>

                <Link
                  to="/candidate/profile"
                  className={desktopLink}
                >
                  <FiUser className="shrink-0 text-base" />
                  Profile
                </Link>
              </>
            )}

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <FiLogOut className="shrink-0" />
              Logout
            </button>
          </div>

          {/* ==============================
              MOBILE MENU BUTTON
          ============================== */}

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70 text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 lg:hidden"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <FiX className="text-xl" />
            ) : (
              <FiMenu className="text-xl" />
            )}
          </button>
        </div>

        {/* ==============================
            MOBILE NAVIGATION
        ============================== */}

        {isMenuOpen && (
          <div className="border-t border-slate-800 py-3 lg:hidden">
            <div className="flex flex-col gap-1">

              {isRecruiter ? (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiBriefcase />
                    </span>
                    Dashboard
                  </Link>

                  <Link
                    to="/recruiter/create-job"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiPlusCircle />
                    </span>
                    Create Job
                  </Link>

                  <Link
                    to="/recruiter/jobs"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiBriefcase />
                    </span>
                    My Jobs
                  </Link>

                  <Link
                    to="/recruiter/applications"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiUser />
                    </span>
                    Applicants
                  </Link>

                  <Link
                    to="/direct-chat"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiMessageCircle />
                    </span>
                    Messages
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/candidate/dashboard"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiBriefcase />
                    </span>
                    Dashboard
                  </Link>

                  <Link
                    to="/candidate/jobs"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiBriefcase />
                    </span>
                    Jobs
                  </Link>

                  <Link
                    to="/candidate/recommendations"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiStar className="text-yellow-400" />
                    </span>
                    AI Jobs
                  </Link>

                  <Link
                    to="/candidate/applications"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiBriefcase />
                    </span>
                    Applications
                  </Link>

                  <Link
                    to="/direct-chat"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiMessageCircle />
                    </span>
                    Messages
                  </Link>

                  <Link
                    to="/candidate/profile"
                    onClick={closeMenu}
                    className={mobileLink}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                      <FiUser />
                    </span>
                    Profile
                  </Link>
                </>
              )}

              {/* Mobile Logout */}
              <div className="mt-2 border-t border-slate-800 pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                    <FiLogOut />
                  </span>
                  Logout
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;