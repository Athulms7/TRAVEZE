import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Save, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { authenticatedFetch, AuthUser, AUTH_API_BASE_URL } from "@/lib/api";

const ProfileSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingProfile(true);
    try {
      const response = await authenticatedFetch(`${AUTH_API_BASE_URL}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), currentPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update your profile.");

      updateUser(data as AuthUser);
      setName(data.name);
      setEmail(data.email);
      setCurrentPassword("");
      toast({ title: "Profile updated", description: "Your account details have been saved." });
    } catch (requestError) {
      toast({
        variant: "destructive",
        title: "Profile not updated",
        description: requestError instanceof Error ? requestError.message : "Please try again.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ variant: "destructive", title: "Passwords don't match", description: "Please confirm your new password." });
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await authenticatedFetch(`${AUTH_API_BASE_URL}/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update your password.");

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Password updated",
        description: "For your security, please sign in again on this device.",
      });
      await logout();
    } catch (requestError) {
      toast({
        variant: "destructive",
        title: "Password not updated",
        description: requestError instanceof Error ? requestError.message : "Please try again.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-4 py-8 text-vander-dark sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/travel-preference"
          className="inline-flex items-center gap-2 text-sm font-medium text-vander-gray transition hover:text-vander-teal"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to your trips
        </Link>

        <header className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-vander-teal">Your account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Profile settings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-vander-gray sm:text-base">
            Manage your account details and keep your sign-in secure.
          </p>
        </header>

        <div className="mt-8 space-y-6">
          <section className="rounded-3xl border border-white bg-white p-5 shadow-[0_20px_60px_-40px_rgba(19,63,71,0.3)] sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-vander-green/10 text-vander-teal">
                <UserRound size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Personal information</h2>
                <p className="mt-1 text-sm leading-5 text-vander-gray">
                  Confirm your current password before changing account details.
                </p>
              </div>
            </div>
            <form onSubmit={saveProfile} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Full name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    maxLength={50}
                    autoComplete="name"
                    required
                    className="form-input w-full"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    required
                    className="form-input w-full"
                  />
                </label>
              </div>
              <label className="block max-w-xl">
                <span className="mb-2 block text-sm font-medium">Current password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="form-input w-full"
                />
              </label>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="vander-button inline-flex items-center justify-center gap-2 px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} aria-hidden="true" />
                {isSavingProfile ? "Saving changes..." : "Save profile"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white bg-white p-5 shadow-[0_20px_60px_-40px_rgba(19,63,71,0.3)] sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-800">
                <KeyRound size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Change password</h2>
                <p className="mt-1 text-sm leading-5 text-vander-gray">
                  Use at least 12 characters. Changing your password signs out all devices.
                </p>
              </div>
            </div>
            <form onSubmit={changePassword} className="space-y-5">
              <label className="block max-w-xl">
                <span className="mb-2 block text-sm font-medium">Current password</span>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => setPasswordForm((form) => ({ ...form, currentPassword: event.target.value }))}
                  autoComplete="current-password"
                  required
                  className="form-input w-full"
                />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">New password</span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) => setPasswordForm((form) => ({ ...form, newPassword: event.target.value }))}
                    minLength={12}
                    maxLength={128}
                    autoComplete="new-password"
                    required
                    className="form-input w-full"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Confirm new password</span>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) => setPasswordForm((form) => ({ ...form, confirmPassword: event.target.value }))}
                    minLength={12}
                    maxLength={128}
                    autoComplete="new-password"
                    required
                    className="form-input w-full"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={isSavingPassword}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-vander-teal/20 bg-vander-teal/5 px-5 py-3 text-sm font-semibold text-vander-teal transition hover:bg-vander-teal/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={17} aria-hidden="true" />
                {isSavingPassword ? "Updating password..." : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfileSettings;
