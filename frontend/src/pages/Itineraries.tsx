import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, Clock, Compass, MapPin, Plane, Sparkles, Trash2, Wallet } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import { useEffect, useState } from "react";
import { authenticatedFetch, AUTH_API_BASE_URL } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ItinerarySummary {
  _id: string;
  image: string;
  destination: string;
  title: string;
  numberOfDays: number;
  budget: number;
}

const Itineraries = () => {
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [itineraryToDelete, setItineraryToDelete] = useState<ItinerarySummary | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getItineraries(): Promise<void> {
      try {
        const response = await authenticatedFetch(`${AUTH_API_BASE_URL}/it`, {
          method: "POST",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load itineraries.");
        }
        setItineraries(Array.isArray(data.itineraries) ? data.itineraries : []);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load itineraries.");
      } finally {
        setIsLoading(false);
      }
    }

    getItineraries();
  }, []);

  async function deleteItinerary(): Promise<void> {
    if (!itineraryToDelete) return;
    const itineraryId = itineraryToDelete._id;
    setDeletingId(itineraryId);
    setDeleteError("");
    try {
      const response = await authenticatedFetch(`${AUTH_API_BASE_URL}/it/${itineraryId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to delete itinerary.");
      }
      setItineraries((current) => current.filter((itinerary) => itinerary._id !== itineraryId));
      setItineraryToDelete(null);
    } catch (requestError) {
      setDeleteError(requestError instanceof Error ? requestError.message : "Unable to delete itinerary.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-vander-light">
      <BackgroundImage />
      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="mb-6">
          <button
            onClick={() => navigate("/travel-preference")}
            className="flex items-center text-vander-dark hover:text-vander-teal transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Travel Preferences</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gradient-primary bg-gradient-to-r from-vander-blue to-vander-teal">
          Your Travel Itineraries
        </h1>

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          role={isLoading ? "status" : undefined}
          aria-label={isLoading ? "Loading itineraries" : undefined}
          aria-busy={isLoading}
        >
          {isLoading
            ? Array.from({ length: 6 }, (_, index) => (
              <article
                key={`itinerary-skeleton-${index}`}
                aria-hidden="true"
                className="glassmorphism overflow-hidden rounded-xl"
              >
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </article>
            ))
            : itineraries.map((itinerary) => (
            <article
              key={itinerary._id}
              className="glassmorphism rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <button
                type="button"
                onClick={() => navigate(`/itinerary/${itinerary._id}`)}
                className="relative block h-48 w-full overflow-hidden text-left"
                aria-label={`View ${itinerary.title}`}
              >
                <img
                  src={itinerary.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="mb-1 text-xl font-semibold text-white">
                    {itinerary.title}
                  </h3>
                  <div className="flex items-center text-white/80">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{itinerary.destination}</span>
                  </div>
                </div>
              </button>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-vander-dark">
                    <Wallet size={16} className="mr-1" />
                    <span className="text-sm">₹ {itinerary.budget}</span>
                  </div>
                  <div className="flex items-center text-vander-teal">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">{itinerary.numberOfDays} Days</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError("");
                    setItineraryToDelete(itinerary);
                  }}
                  disabled={deletingId !== null}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-white/70 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Delete ${itinerary.title}`}
                  title="Delete itinerary"
                >
                  <Trash2 size={16} />
                  {deletingId === itinerary._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
        {!isLoading && error && <p role="alert" className="text-center text-red-600">{error}</p>}
        {!isLoading && !error && itineraries.length === 0 && (
          <section
            aria-labelledby="empty-itineraries-title"
            className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_80px_-32px_rgba(15,61,72,0.35)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="flex flex-col items-start justify-center px-7 py-10 sm:px-10 sm:py-12">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-vander-green/15 bg-vander-green/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-vander-teal">
                <Sparkles size={14} aria-hidden="true" />
                A little room for adventure
              </div>
              <h2
                id="empty-itineraries-title"
                className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-vander-dark sm:text-4xl"
              >
                Your next great escape starts here.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-vander-gray">
                No itineraries just yet. Tell us what you love, and we’ll help turn your next
                destination into a trip worth remembering.
              </p>
              <button
                type="button"
                onClick={() => navigate("/self-planning")}
                className="vander-button group mt-8 inline-flex items-center gap-3 px-6 py-3.5 text-sm shadow-lg shadow-vander-teal/20"
              >
                Generate an itinerary
                <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-4 text-xs font-medium tracking-wide text-vander-gray/80">
                Your plans will be saved here for your next visit.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#e7f5ef] via-[#e5f1f3] to-[#dcebf0] p-8 sm:min-h-[360px]"
            >
              <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-white/50 blur-2xl" />
              <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-vander-green/15 blur-2xl" />
              <svg
                viewBox="0 0 420 300"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <path d="M-20 66C68 12 103 116 188 78S324 24 445 92" stroke="white" strokeWidth="2" />
                <path d="M-15 232C73 180 125 275 218 222S352 158 440 208" stroke="white" strokeWidth="2" />
                <path d="M78 -20C126 53 89 113 145 163S211 249 187 325" stroke="white" strokeWidth="2" />
                <path d="M328 -14C267 47 320 115 267 154S228 232 278 317" stroke="white" strokeWidth="2" />
                <path
                  d="M92 207C125 177 144 202 171 170S212 111 247 133 287 176 326 91"
                  stroke="#4e9b86"
                  strokeDasharray="5 8"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute left-[19%] top-[61%] flex h-11 w-11 items-center justify-center rounded-full bg-white text-vander-teal shadow-lg shadow-vander-teal/15">
                <MapPin size={20} fill="currentColor" className="text-vander-teal" />
                <span className="absolute inset-0 rounded-full bg-vander-teal/15 animate-ping" />
              </div>
              <div className="absolute right-[19%] top-[25%] flex h-11 w-11 items-center justify-center rounded-full bg-white text-vander-teal shadow-lg shadow-vander-teal/15">
                <MapPin size={20} fill="currentColor" className="text-vander-teal" />
              </div>
              <div className="absolute left-[46%] top-[43%] flex h-12 w-12 rotate-[-12deg] items-center justify-center rounded-2xl bg-vander-teal text-white shadow-xl shadow-vander-teal/25">
                <Plane size={22} />
              </div>
              <div className="absolute bottom-7 left-7 inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-lg shadow-vander-dark/5 backdrop-blur-md">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-vander-green/10 text-vander-teal">
                  <Compass size={19} />
                </span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-vander-gray">Your story</span>
                  <span className="mt-0.5 block text-sm font-semibold text-vander-dark">Starts anywhere</span>
                </span>
              </div>
              <div className="absolute right-7 top-7 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-vander-teal/80 backdrop-blur-md">
                Explore more
              </div>
            </div>
          </section>
        )}
      </div>
      <AlertDialog
        open={itineraryToDelete !== null}
        onOpenChange={(open) => {
          if (!open && deletingId === null) {
            setItineraryToDelete(null);
            setDeleteError("");
          }
        }}
      >
        <AlertDialogContent className="max-w-md rounded-3xl border border-white/60 bg-white/95 p-0 shadow-2xl backdrop-blur-2xl">
          <div className="p-6 sm:p-7">
            <AlertDialogHeader className="text-left">
              <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={23} aria-hidden="true" />
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-vander-dark">
                Delete this itinerary?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-6 text-vander-gray">
                {itineraryToDelete
                  ? `“${itineraryToDelete.title}” will be permanently deleted. Anyone using its public share link will no longer be able to view it.`
                  : "This itinerary will be permanently deleted."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {deleteError && (
              <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {deleteError}
              </p>
            )}
            <AlertDialogFooter className="mt-7 gap-3 sm:space-x-0">
              <button
                type="button"
                onClick={() => {
                  setItineraryToDelete(null);
                  setDeleteError("");
                }}
                disabled={deletingId !== null}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-vander-teal/20 bg-white px-5 py-2.5 text-sm font-semibold text-vander-dark transition hover:bg-vander-teal/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Keep itinerary
              </button>
              <button
                type="button"
                onClick={() => void deleteItinerary()}
                disabled={deletingId !== null || !itineraryToDelete}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={16} aria-hidden="true" />
                {deletingId !== null ? "Deleting..." : "Delete itinerary"}
              </button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Itineraries;
