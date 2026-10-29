import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import Logo from "../components/Logo";
import BackgroundImage from "../components/BackgroundImage";
import { AUTH_API_BASE_URL } from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to request a password reset.");
      setIsSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to request a password reset.");
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
          {isSubmitted ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vander-green/10 text-vander-teal">
                <Send size={23} aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-2xl font-semibold text-vander-dark">Check your inbox</h1>
              <p className="mt-3 text-sm leading-6 text-vander-gray">
                If an account exists for <strong>{email}</strong> and email delivery is configured, reset
                instructions will arrive shortly. The link expires after 15 minutes; check your spam folder too.
              </p>
              <Link to="/login" className="vander-button mt-7 inline-flex justify-center px-6 py-3">
                Return to sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-vander-teal">Account recovery</p>
              <h1 className="mt-2 text-2xl font-semibold text-vander-dark">Forgot your password?</h1>
              <p className="mt-3 text-sm leading-6 text-vander-gray">
                Enter the email address linked to your account. We’ll send a secure, one-time reset link if it exists.
              </p>
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-vander-dark">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    maxLength={254}
                    autoComplete="email"
                    required
                    className="form-input w-full"
                  />
                </label>
                {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="vander-button flex w-full items-center justify-center gap-2 py-4 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Sending request..." : "Send reset link"}
                  {!isSubmitting && <Send size={17} aria-hidden="true" />}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ForgotPassword;
