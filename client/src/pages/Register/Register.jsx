import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "candidate",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);

      toast.success(response.message || "Registration successful");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

  const errorClass = "mt-1.5 text-xs leading-5 text-red-400";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/20 sm:p-7 md:p-8">
          {/* Logo / Heading */}
          <div className="mb-7 text-center sm:mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 ring-1 ring-blue-500/20">
              <span className="text-lg font-bold text-blue-400">AI</span>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-5 text-slate-400">
              Join AIHire and get started today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                className={inputClass}
                {...register("name", {
                  required: "Name is required",
                })}
              />

              {errors.name && (
                <p className={errorClass}>{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className={inputClass}
                {...register("email", {
                  required: "Email is required",
                })}
              />

              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                className={inputClass}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              {errors.password && (
                <p className={errorClass}>{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                className={inputClass}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />

              {errors.confirmPassword && (
                <p className={errorClass}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Register As
              </label>

              <select
                className={`${inputClass} cursor-pointer`}
                {...register("role", {
                  required: "Please select a role",
                })}
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>

              {errors.role && (
                <p className={errorClass}>{errors.role.message}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 min-h-11 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm leading-6 text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;