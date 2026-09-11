import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiBell,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFileText,
  FiBriefcase,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { getMyApplications } from "../../services/applicationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getMyApplications();

        const applications =
          response?.applications ||
          response?.data ||
          (Array.isArray(response) ? response : []);

        const generatedNotifications = applications.map((application) => {
          const status = application.status?.toLowerCase() || "pending";

          let title = "Application submitted";
          let message = "Your job application has been submitted.";
          let icon = <FiFileText className="text-blue-600" />;
          let bgColor = "bg-blue-50";

          if (status === "shortlisted") {
            title = "Application shortlisted";
            message = "Congratulations! Your application has been shortlisted.";
            icon = <FiCheckCircle className="text-green-600" />;
            bgColor = "bg-green-50";
          }

          if (status === "rejected") {
            title = "Application rejected";
            message = "Your application was not selected for this position.";
            icon = <FiXCircle className="text-red-600" />;
            bgColor = "bg-red-50";
          }

          if (status === "pending") {
            title = "Application under review";
            message = "Your application is currently under review.";
            icon = <FiClock className="text-yellow-600" />;
            bgColor = "bg-yellow-50";
          }

          return {
            id: application._id || application.id,
            title,
            message,
            status,
            icon,
            bgColor,
            jobTitle:
              application.job?.title ||
              application.job?.jobTitle ||
              application.jobTitle ||
              "Job Application",
            company:
              application.job?.company ||
              application.job?.companyName ||
              application.company ||
              "",
            createdAt:
              application.createdAt ||
              application.appliedAt ||
              application.updatedAt,
          };
        });

        setNotifications(generatedNotifications);
      } catch (error) {
        console.error("Notifications error:", error);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load notifications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (status === "shortlisted") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/candidate/dashboard"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <FiArrowLeft />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Heading */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <FiBell className="text-2xl text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Notifications
            </h1>

            <p className="text-gray-500 mt-1">
              Stay updated about your job applications
            </p>
          </div>
        </div>

        {/* Notifications list */}
        {notifications.length === 0 ? (
          <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">
            <FiBell className="text-5xl text-gray-300 mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No notifications yet
            </h2>

            <p className="text-gray-500 mb-6">
              Notifications about your applications will appear here.
            </p>

            <Link
              to="/candidate/jobs"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiBriefcase />
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white border rounded-2xl shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${notification.bgColor} flex items-center justify-center shrink-0`}
                  >
                    {notification.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>

                      <span className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-600 mt-2">
                      {notification.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <FiBriefcase />
                        {notification.jobTitle}
                      </span>

                      {notification.company && (
                        <span className="text-sm text-gray-500">
                          {notification.company}
                        </span>
                      )}

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(
                          notification.status
                        )}`}
                      >
                        {notification.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;