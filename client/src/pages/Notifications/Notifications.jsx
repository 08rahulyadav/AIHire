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

        const generatedNotifications = applications.map(
          (application) => {
            const status =
              application.status?.toLowerCase() ||
              "pending";

            let title = "Application submitted";
            let message =
              "Your job application has been submitted.";
            let icon = (
              <FiFileText className="text-blue-600" />
            );
            let bgColor = "bg-blue-50";

            if (status === "shortlisted") {
              title = "Application shortlisted";
              message =
                "Congratulations! Your application has been shortlisted.";
              icon = (
                <FiCheckCircle className="text-green-600" />
              );
              bgColor = "bg-green-50";
            }

            if (status === "rejected") {
              title = "Application rejected";
              message =
                "Your application was not selected for this position.";
              icon = (
                <FiXCircle className="text-red-600" />
              );
              bgColor = "bg-red-50";
            }

            if (status === "pending") {
              title = "Application under review";
              message =
                "Your application is currently under review.";
              icon = (
                <FiClock className="text-yellow-600" />
              );
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
          }
        );

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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="text-sm text-slate-400">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-6">
          <Link
            to="/candidate/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <FiArrowLeft />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 sm:py-8 lg:py-10">

        {/* Heading */}
        <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 sm:h-14 sm:w-14">
            <FiBell className="text-xl text-blue-400 sm:text-2xl" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-1 text-sm leading-6 text-slate-400 sm:text-base">
              Stay updated about your job applications
            </p>
          </div>
        </div>

        {/* Empty State */}
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-10 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
              <FiBell className="text-3xl text-slate-500" />
            </div>

            <h2 className="text-xl font-semibold">
              No notifications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Notifications about your applications will
              appear here.
            </p>

            <Link
              to="/candidate/jobs"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700 sm:w-auto"
            >
              <FiBriefcase />
              Browse Jobs
            </Link>
          </div>
        ) : (
          /* Notifications List */
          <div className="space-y-3 sm:space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm transition hover:border-slate-700 hover:shadow-md sm:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">

                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${notification.bgColor}`}
                  >
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    {/* Title + Date */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <h3 className="wrap-break-word font-semibold text-white">
                        {notification.title}
                      </h3>

                      <span className="shrink-0 text-xs text-slate-500 sm:text-sm">
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-400">
                      {notification.message}
                    </p>

                    {/* Job Details */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">

                      <span className="flex max-w-full items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-300 sm:text-sm">
                        <FiBriefcase className="shrink-0 text-blue-400" />

                        <span className="wrap-break-word">
                          {notification.jobTitle}
                        </span>
                      </span>

                      {notification.company && (
                        <span className="wrap-break-word rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-500 sm:text-sm">
                          {notification.company}
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${getStatusClass(
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