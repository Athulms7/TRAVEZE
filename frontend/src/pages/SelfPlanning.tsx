import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  LoaderCircle,
  MapPin,
  Sparkles,
  Wallet,
} from "lucide-react";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import { authenticatedFetch, CHATBOT_API_BASE_URL } from "@/lib/api";

const moods = [
  "adventurous",
  "relaxed",
  "cultural",
  "romantic",
  "family-friendly",
  "luxury",
  "budget-friendly",
  "spiritual",
  "thrifting",
];

const SelfPlanning = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    mood: "",
    current_location: "",
    days: "",
    budget: "",
    destination: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await authenticatedFetch(`${CHATBOT_API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          current_location: formData.current_location.trim(),
          destination: formData.destination.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "We couldn't create your itinerary. Please try again.");
      }

      navigate("/itineraries");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate your itinerary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8f6] text-vander-dark">
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 -top-40 h-[28rem] w-[28rem] rounded-full bg-vander-green/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-36 h-[30rem] w-[30rem] rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-8 lg:px-10 lg:pt-8">
        <header className="flex items-center justify-between">
          <BackButton to="/travel-preference" />
          <Logo />
          <div className="hidden w-28 sm:block" aria-hidden="true" />
        </header>

        <div className="mx-auto mt-12 max-w-3xl text-center sm:mt-16">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-vander-teal/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-vander-teal shadow-sm">
            <Sparkles size={15} aria-hidden="true" />
            Your next chapter
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-vander-dark sm:text-5xl lg:text-6xl">
            A great trip starts
            <span className="block bg-gradient-to-r from-vander-blue to-vander-teal bg-clip-text text-transparent">
              with a little you.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-vander-gray sm:text-lg">
            Set the mood, choose your destination, and let us shape the details into a journey
            that feels like yours.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl items-stretch gap-6 lg:mt-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          <section className="relative hidden min-h-[580px] overflow-hidden rounded-[2rem] bg-[#173b44] shadow-xl shadow-slate-900/10 lg:block">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85"
              alt="A quiet mountain lake surrounded by green hills"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102b33]/95 via-[#102b33]/20 to-[#102b33]/10" />
            <div className="absolute inset-x-0 bottom-0 p-9 text-white">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-medium text-white/90 backdrop-blur-md">
                <Compass size={15} aria-hidden="true" />
                Made around your kind of travel
              </div>
              <h2 className="max-w-sm text-3xl font-semibold leading-tight">
                Less searching. More getting lost in the right place.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                From slow mornings to full-day adventures, your itinerary is built around the
                way you want to explore.
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <MapPin size={17} aria-hidden="true" />
                </span>
                <span>One destination, a thousand possibilities</span>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white bg-white/90 p-5 shadow-[0_24px_70px_-35px_rgba(19,63,71,0.28)] backdrop-blur-xl sm:p-8 lg:p-9">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-vander-teal">
                  Plan your escape
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Tell us what you have in mind
                </h2>
                <p className="mt-2 text-sm leading-6 text-vander-gray">
                  A few details are all we need to get started.
                </p>
              </div>
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-vander-green/10 text-vander-teal sm:flex">
                <Compass size={23} aria-hidden="true" />
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-vander-dark">Travel style</span>
                  <select
                    name="mood"
                    value={formData.mood}
                    onChange={handleChange}
                    required
                    className="form-input w-full"
                  >
                    <option value="">Choose your mood</option>
                    {moods.map((mood) => (
                      <option key={mood} value={mood}>
                        {mood.replace("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-vander-dark">Starting from</span>
                  <span className="relative block">
                    <MapPin size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-vander-gray" />
                    <input
                      type="text"
                      name="current_location"
                      placeholder="e.g. Bengaluru"
                      value={formData.current_location}
                      onChange={handleChange}
                      maxLength={100}
                      autoComplete="address-level2"
                      required
                      className="form-input w-full pl-11"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-vander-dark">Number of days</span>
                  <span className="relative block">
                    <CalendarDays size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-vander-gray" />
                    <input
                      type="number"
                      name="days"
                      placeholder="5"
                      value={formData.days}
                      onChange={handleChange}
                      min={1}
                      max={30}
                      step={1}
                      required
                      className="form-input w-full pl-11"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-vander-dark">Total budget</span>
                  <span className="relative block">
                    <Wallet size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-vander-gray" />
                    <input
                      type="number"
                      name="budget"
                      placeholder="25000"
                      value={formData.budget}
                      onChange={handleChange}
                      min={1}
                      max={100000000}
                      step={1}
                      required
                      className="form-input w-full pl-11"
                    />
                  </span>
                  <span className="mt-1.5 block text-xs text-vander-gray">In Indian rupees (INR)</span>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-vander-dark">Where would you like to go?</span>
                <span className="relative block">
                  <MapPin size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-vander-gray" />
                  <input
                    type="text"
                    name="destination"
                    placeholder="e.g. Munnar, Kerala"
                    value={formData.destination}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    className="form-input w-full pl-11"
                  />
                </span>
              </label>

              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="vander-button group flex w-full items-center justify-center gap-3 px-6 py-4 text-base disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />
                    Finding your route...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} aria-hidden="true" />
                    Create my itinerary
                    <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <p className="text-center text-xs leading-5 text-vander-gray">
                Your finished itinerary will be saved to your trips.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SelfPlanning;
