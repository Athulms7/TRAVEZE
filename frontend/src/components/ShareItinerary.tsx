import { useState } from "react";
import { Check, Copy, Link2, LoaderCircle, LockKeyhole, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { authenticatedFetch, AUTH_API_BASE_URL } from "@/lib/api";

const ShareItinerary = ({
  itineraryId,
  initiallyShared = false,
}: {
  itineraryId: string;
  initiallyShared?: boolean;
}) => {
  const { toast } = useToast();
  const [isShared, setIsShared] = useState(initiallyShared);
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");

  const createShareLink = async () => {
    setIsLoading(true);
    setError("");
    setIsCopied(false);
    try {
      const response = await authenticatedFetch(
        `${AUTH_API_BASE_URL}/it/${encodeURIComponent(itineraryId)}/share`,
        { method: "POST" },
      );
      const data = await response.json();
      if (!response.ok || typeof data.token !== "string") {
        throw new Error(data.message || "Unable to create a public link.");
      }

      const url = new URL(`/shared/${data.token}`, window.location.origin).toString();
      setShareUrl(url);
      setIsShared(true);
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        toast({ title: "Public link copied", description: "Anyone with this link can view this itinerary." });
      } catch {
        toast({ title: "Public link ready", description: "Copy the link below to share this itinerary." });
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to create a public link.";
      setError(message);
      toast({ variant: "destructive", title: "Couldn't share itinerary", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const revokeShareLink = async () => {
    setIsRevoking(true);
    setError("");
    try {
      const response = await authenticatedFetch(
        `${AUTH_API_BASE_URL}/it/${encodeURIComponent(itineraryId)}/share`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to revoke the public link.");
      setIsShared(false);
      setShareUrl("");
      setIsCopied(false);
      toast({ title: "Link revoked", description: "The public link can no longer be used to view this itinerary." });
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to revoke the public link.";
      setError(message);
      toast({ variant: "destructive", title: "Couldn't revoke link", description: message });
    } finally {
      setIsRevoking(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({ title: "Link copied", description: "Share it with anyone you want to view this trip." });
    } catch {
      setError("Clipboard access is unavailable. Select and copy the link above.");
    }
  };

  return (
    <section className="rounded-2xl border border-vander-teal/10 bg-white/90 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vander-teal/10 text-vander-teal">
            {isShared ? <Link2 size={19} aria-hidden="true" /> : <LockKeyhole size={19} aria-hidden="true" />}
          </span>
          <div>
            <h2 className="font-semibold text-vander-dark">
              {isShared ? "Public link is active" : "Share this itinerary"}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-5 text-vander-gray">
              {isShared
                ? "Anyone with the link can view all itinerary details, including the starting location and budget."
                : "Create a private, unlisted link. Anyone who has it can view all itinerary details."}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void createShareLink()}
            disabled={isLoading || isRevoking}
            className="vander-button inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
              : <Share2 size={16} aria-hidden="true" />}
            {isLoading ? "Creating link..." : isShared ? "Create new link" : "Create public link"}
          </button>
          {isShared && (
            <button
              type="button"
              onClick={() => void revokeShareLink()}
              disabled={isLoading || isRevoking}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRevoking && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
              {isRevoking ? "Revoking..." : "Revoke link"}
            </button>
          )}
        </div>
      </div>

      {shareUrl && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor={`share-link-${itineraryId}`}>Public itinerary link</label>
          <input
            id={`share-link-${itineraryId}`}
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
            className="form-input min-w-0 flex-1 text-sm"
          />
          <button
            type="button"
            onClick={() => void copyLink()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-vander-teal/20 bg-vander-teal/5 px-4 py-2.5 text-sm font-semibold text-vander-teal transition hover:bg-vander-teal/10"
          >
            {isCopied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {isCopied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    </section>
  );
};

export default ShareItinerary;
