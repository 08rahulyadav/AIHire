import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Public Pages
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Candidate Pages
import Applications from "../pages/Applications/Applications";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import Resume from "../pages/Resume/Resume";
import Jobs from "../pages/Jobs/Jobs";
import JobDetails from "../pages/JobDetails/JobDetails";
import Notifications from "../pages/Notifications/Notifications";
import AiAssistant from "../pages/AiAssistant/AiAssistant";
import Recommendations from "../pages/Recommendations/Recommendations";

// Recruiter Pages
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import RecruiterApplications from "../pages/recruiter/Applicants";
import CreateJob from "../pages/recruiter/CreateJob";
import EditJob from "../pages/recruiter/EditJob";
import MyJobs from "../pages/recruiter/MyJobs";

// Direct Chat
import Conversations from "../pages/DirectChat/Conversations";
import DirectChat from "../pages/DirectChat/DirectChat";

// Layouts
import ProtectedRoute from "./ProtectedRoute";
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import Navbar from "../components/Navbar/Navbar";

// ==========================================
// SHARED CHAT LAYOUT
// ==========================================

const ChatLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

// ==========================================
// ROUTES
// ==========================================

function AppRoutes() {
  return (
    <Routes>
      {/* ==========================================
          PUBLIC
      ========================================== */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ==========================================
          SHARED DIRECT CHAT
          BOTH CANDIDATE + RECRUITER
      ========================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["candidate", "recruiter"]}
          />
        }
      >
        <Route
          path="/direct-chat"
          element={
            <div className="min-h-screen bg-slate-950 text-white">
              <Navbar />

              <main>
                <Conversations />
              </main>
            </div>
          }
        />

        <Route
          path="/direct-chat/:userId"
          element={
            <div className="min-h-screen bg-slate-950 text-white">
              <Navbar />

              <main>
                <DirectChat />
              </main>
            </div>
          }
        />
      </Route>

      {/* ==========================================
          CANDIDATE
      ========================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["candidate"]}
          />
        }
      >
        <Route element={<CandidateLayout />}>

          {/* Candidate Dashboard */}
          <Route
            path="/candidate/dashboard"
            element={<Dashboard />}
          />

          {/* Profile */}
          <Route
            path="/candidate/profile"
            element={<Profile />}
          />

          {/* Applications */}
          <Route
            path="/candidate/applications"
            element={<Applications />}
          />

          {/* Resume */}
          <Route
            path="/candidate/resume"
            element={<Resume />}
          />

          {/* Jobs */}
          <Route
            path="/candidate/jobs"
            element={<Jobs />}
          />

          {/* Job Details */}
          <Route
            path="/candidate/jobs/:jobId"
            element={<JobDetails />}
          />

          {/* Notifications */}
          <Route
            path="/candidate/notifications"
            element={<Notifications />}
          />

          {/* AI Assistant */}
          <Route
            path="/candidate/ai-assistant"
            element={<AiAssistant />}
          />

          {/* AI Job Recommendations */}
          <Route
            path="/candidate/recommendations"
            element={<Recommendations />}
          />

        </Route>
      </Route>

      {/* ==========================================
          RECRUITER
      ========================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["recruiter"]}
          />
        }
      >
        <Route element={<RecruiterLayout />}>

          {/* Recruiter Dashboard */}
          <Route
            path="/recruiter/dashboard"
            element={<RecruiterDashboard />}
          />

          {/* My Jobs */}
          <Route
            path="/recruiter/jobs"
            element={<MyJobs />}
          />

          {/* Create Job */}
          <Route
            path="/recruiter/create-job"
            element={<CreateJob />}
          />

          {/* Edit Job */}
          <Route
            path="/recruiter/jobs/:jobId/edit"
            element={<EditJob />}
          />

          {/* Applicants */}
          <Route
            path="/recruiter/applications"
            element={<RecruiterApplications />}
          />

        </Route>
      </Route>

      {/* ==========================================
          UNKNOWN
      ========================================== */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;