import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, CalendarDays, Coffee, MapPin, Navigation, Wallet } from "lucide-react";
import BackgroundImage from "@/components/BackgroundImage";
import { AUTH_API_BASE_URL } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface PublicActivity {
  time: string;
  activity: string;
}

interface PublicDay {
  day: number;
  activities: PublicActivity[];
}

interface PublicItineraryRecord {
  _id: string;
  title: string;
  source: string;
  destination: string;
  numberOfDays: number;
  budget: number;
  days: PublicDay[];
  backpackItems: string[];
  image: string;
}

function getDirectionsUrl(origin: string, destination: string): string {
  const params = new URLSearchParams({ api: "1", origin, destination });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

const PublicItinerary = () => {
  const { token } = useParams<{ token: string }>();
  const [itinerary, setItinerary] = useState<PublicItineraryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousTitle = document.title;
    const existingRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = existingRobots?.content;
    const robotsMeta = existingRobots ?? document.createElement("meta");
    robotsMeta.name = "robots";
    robotsMeta.content = "noindex, nofollow";
    if (!existingRobots) document.head.appendChild(robotsMeta);
    document.title = "Shared itinerary | Traveze";

    return () => {
      document.title = previousTitle;
      if (existingRobots && previousRobots !== undefined) {
        existingRobots.content = previousRobots;
      } else if (!existingRobots) {
        robotsMeta.remove();
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError("");
    setItinerary(null);

    async function loadSharedItinerary(): Promise<void> {
      if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
        setError("This shared itinerary link is invalid or has been revoked.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${AUTH_API_BASE_URL}/shared/${encodeURIComponent(token)}`,
          { signal: controller.signal, headers: { Accept: "application/json" } },
        );
        const data = await response.json();
        if (!response.ok) {
          setError(response.status === 404
            ? "This shared itinerary link is invalid or has been revoked."
            : data.message || "Unable to load this shared itinerary.");
          return;
        }
        setItinerary(data.itinerary as PublicItineraryRecord);
        document.title = `${data.itinerary.title} | Traveze`;
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name === "AbortError") return;
        setError("Unable to load this itinerary. Check your connection and try again.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadSharedItinerary();
    return () => controller.abort();
  }, [token]);

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-vander-light">
        <BackgroundImage />
        <div role="status" aria-label="Loading shared itinerary" className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-7">
          <Skeleton className="h-5 w-36" />
          <section aria-hidden="true" className="mt-6 overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl">
            <Skeleton className="h-64 w-full rounded-none sm:h-80" />
            <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.5fr_0.8fr]">
              <div className="space-y-6 rounded-2xl bg-white p-5 sm:p-6">
                <Skeleton className="h-6 w-44" />
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-7 w-20 rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-11/12 rounded-xl" />
                  </div>
                ))}
              </div>
              <aside className="space-y-5">
                <div className="space-y-3 rounded-2xl bg-white p-5">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div className="space-y-3 rounded-2xl bg-white p-5">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (error || !itinerary) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-vander-light px-4">
        <BackgroundImage />
        <section className="relative z-10 w-full max-w-lg rounded-3xl border border-white/70 bg-white/95 p-8 text-center shadow-xl backdrop-blur-xl">
          <h1 className="text-2xl font-semibold text-vander-dark">Shared itinerary unavailable</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-vander-gray">{error}</p>
          <Link to="/" className="vander-button mt-6 inline-flex px-5 py-3">Go to Traveze</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-vander-light">
      <BackgroundImage />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-7">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-vander-dark transition hover:text-vander-teal">
          <ArrowLeft size={18} aria-hidden="true" />
          Explore Traveze
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl backdrop-blur-xl">
          <div className="relative h-64 sm:h-80">
            <img src={itinerary.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
              <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                Shared trip
              </span>
              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{itinerary.title}</h1>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={16} aria-hidden="true" />
                  {itinerary.source} to {itinerary.destination}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={16} aria-hidden="true" />
                  {itinerary.numberOfDays} days
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.5fr_0.8fr]">
            <section className="rounded-2xl border border-vander-teal/10 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-vander-dark">Day-by-day plan</h2>
              <div className="mt-6 space-y-8">
                {itinerary.days.map((day) => (
                  <section key={day.day} aria-labelledby={`shared-day-${day.day}`}>
                    <h3 id={`shared-day-${day.day}`} className="inline-flex rounded-lg bg-vander-blue/10 px-3 py-1 font-semibold text-vander-blue">
                      Day {day.day}
                    </h3>
                    <div className="mt-4 space-y-4 border-l-2 border-vander-blue/15 pl-4">
                      {day.activities.map((activity, index) => {
                        const origin = index === 0
                          ? itinerary.destination
                          : day.activities[index - 1].activity;
                        return (
                          <article key={`${day.day}-${index}`} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-vander-green/10 text-vander-teal">
                              <Coffee size={17} aria-hidden="true" />
                            </span>
                            <div>
                              <p className="font-medium text-vander-dark">{activity.time}</p>
                              <p className="mt-0.5 text-sm leading-6 text-vander-gray">{activity.activity}</p>
                              <a
                                href={getDirectionsUrl(origin, activity.activity)}
                                target="_blank"
                                rel="noopener noreferrer"
                                referrerPolicy="no-referrer"
                                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-vander-teal/20 px-3 py-1.5 text-xs font-medium text-vander-teal hover:bg-vander-teal/5"
                              >
                                <Navigation size={14} aria-hidden="true" />
                                Directions
                              </a>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-vander-teal/10 bg-white p-5">
                <h2 className="flex items-center gap-2 font-semibold text-vander-dark">
                  <Wallet size={19} className="text-vander-teal" aria-hidden="true" />
                  Trip budget
                </h2>
                <p className="mt-3 text-2xl font-semibold text-vander-teal">₹ {itinerary.budget}</p>
                <p className="mt-1 text-xs text-vander-gray">Shared by the itinerary owner</p>
              </section>
              <section className="rounded-2xl border border-vander-teal/10 bg-white p-5">
                <h2 className="flex items-center gap-2 font-semibold text-vander-dark">
                  <Briefcase size={19} className="text-vander-teal" aria-hidden="true" />
                  Packing list
                </h2>
                {itinerary.backpackItems.length > 0 ? (
                  <ol className="mt-4 space-y-3">
                    {itinerary.backpackItems.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-3 text-sm leading-5 text-vander-gray">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vander-teal/10 text-xs font-semibold text-vander-teal">
                          {index + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-3 text-sm text-vander-gray">No packing items added.</p>
                )}
              </section>
            </aside>
          </div>
        </section>
        <p className="mt-5 text-center text-xs text-vander-gray">
          This is a public link. Details are visible to anyone who has it.
        </p>
      </div>
    </main>
  );
};

export default PublicItinerary;
