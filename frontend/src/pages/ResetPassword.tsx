import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import Logo from "../components/Logo";
import BackgroundImage from "../components/BackgroundImage";
import { AUTH_API_BASE_URL } from "@/lib/api";

const ResetPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (searchParams.has("token")) {
      setSearchParams((current) => {
        const cleaned = new URLSearchParams(current);
        cleaned.delete("token");
        return cleaned;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!token) {
      setError("This reset link is invalid or expired. Request a new one.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to reset your password.");
      setIsComplete(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden page-transition">
      <BackgroundImage />
      <div className="relative z-20 flex min-h-screen flex-col px-6 pb-10 pt-20">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <Link to="/login" className="absolute left-6 top-6 inline-flex items-center gap-1 text-sm font-medium text-vander-dark">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to sign in
        </Link>

        <section className="mx-auto mt-12 w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur-xl sm:p-9">
          {isComplete ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vander-green/10 text-vander-teal">
                <KeyRound size={23} aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold text-vander-dark">Password updated</h1>
              <p className="mt-3 text-sm leading-6 text-vander-gray">
                Your password has been changed. Sign in with your new password to continue.
              </p>
              <Link to="/login" className="vander-button mt-7 inline-flex justify-center px-6 py-3">
                Go to sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-vander-teal">Secure your account</p>
              <h1 className="mt-2 text-2xl font-semibold text-vander-dark">Choose a new password</h1>
              <p className="mt-3 text-sm leading-6 text-vander-gray">Use at least 12 characters.</p>
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-vander-dark">New password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={12}
                    maxLength={128}
                    autoComplete="new-password"
                    required
                    className="form-input w-full"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-vander-dark">Confirm new password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={12}
                    maxLength={128}
                    autoComplete="new-password"
                    required
                    className="form-input w-full"
                  />
                </label>
                {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="vander-button w-full py-4 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Updating password..." : "Set new password"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResetPassword;
