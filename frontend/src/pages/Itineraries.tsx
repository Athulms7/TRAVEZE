import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Wallet, Trash2 } from "lucide-react";
import BackgroundImage from "../components/BackgroundImage";
import { useEffect, useState } from "react";

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
  const navigate = useNavigate();

  useEffect(() => {
    async function getItineraries(): Promise<void> {
      try {
        const response = await fetch("http://localhost:3000/api/auth/it", {
          method: "POST",
          headers: {
            authorization: localStorage.getItem("token") || "",
          },
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

  async function deleteItinerary(itineraryId: string): Promise<void> {
    if (!window.confirm("Delete this itinerary? This action cannot be undone.")) {
      return;
    }

    setDeletingId(itineraryId);
    setError("");
    try {
      const response = await fetch(`http://localhost:3000/api/auth/it/${itineraryId}`, {
        method: "DELETE",
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to delete itinerary.");
      }
      setItineraries((current) => current.filter((itinerary) => itinerary._id !== itineraryId));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete itinerary.");
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
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
                  onClick={() => deleteItinerary(itinerary._id)}
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
        {isLoading && <p className="text-center text-vander-gray">Loading itineraries...</p>}
        {!isLoading && error && <p role="alert" className="text-center text-red-600">{error}</p>}
        {!isLoading && !error && itineraries.length === 0 && (
          <p className="text-center text-vander-gray">No saved itineraries yet. Generate a trip to see it here.</p>
        )}
      </div>
    </div>
  );
};

export default Itineraries;
