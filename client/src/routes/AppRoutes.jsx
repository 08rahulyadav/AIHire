import { Routes, Route, Navigate } from "react-router-dom";

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

// Recruiter Pages

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import RecruiterApplications from "../pages/recruiter/Applicants";
import CreateJob from "../pages/recruiter/CreateJob";
import EditJob from "../pages/recruiter/EditJob";
import MyJobs from "../pages/recruiter/MyJobs";

// Layouts and Protection
import ProtectedRoute from "./ProtectedRoute";
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* RECRUITER ROUTES */}
      <Route
        element={<ProtectedRoute allowedRoles={["recruiter"]} />}
      >
        <Route element={<RecruiterLayout />}>
          <Route
            path="/recruiter/dashboard"
            element={<RecruiterDashboard />}
          />

          <Route
            path="/recruiter/jobs"
            element={<MyJobs />}
          />

          <Route
            path="/recruiter/create-job"
            element={<CreateJob />}
          />
          <Route
  path="/recruiter/jobs/:jobId/edit"
  element={<EditJob />}
/>

          <Route
            path="/recruiter/applications"
            element={<RecruiterApplications />}
          />
        </Route>
      </Route>

      {/* CANDIDATE ROUTES */}
      <Route
        element={<ProtectedRoute allowedRoles={["candidate"]} />}
      >
        <Route element={<CandidateLayout />}>
          <Route
            path="/candidate/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/candidate/profile"
            element={<Profile />}
          />

          <Route
            path="/candidate/applications"
            element={<Applications />}
          />

          <Route
            path="/candidate/resume"
            element={<Resume />}
          />

          <Route
            path="/candidate/jobs"
            element={<Jobs />}
          />

          <Route
            path="/candidate/jobs/:jobId"
            element={<JobDetails />}
          />

          <Route
            path="/candidate/notifications"
            element={<Notifications />}
          />

          <Route
            path="/candidate/ai-assistant"
            element={<AiAssistant />}
          />
        </Route>
      </Route>

      {/* UNKNOWN ROUTE */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;