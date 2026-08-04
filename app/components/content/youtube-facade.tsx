import { useState } from "react";
import { useTranslation } from "~/i18n/use-translation";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  className?: string;
}

// Zero third-party JS on initial load (plan §4.2): shows the video's own
// thumbnail behind a play button, and only mounts the real iframe after a
// click. youtube-nocookie.com keeps that deferral meaningful — no YouTube
// cookies are set until the visitor actually opts in by clicking.
export function YouTubeFacade({
  videoId,
  title,
  className = "",
}: YouTubeFacadeProps) {
  const t = useTranslation();
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <div className={`aspect-video overflow-hidden rounded-sm ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={`${t.video.playLabel}: ${title}`}
      className={`group border-ink/10 dark:border-ink-dark/15 relative block aspect-video w-full overflow-hidden rounded-sm border ${className}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <span className="bg-ink/40 group-hover:bg-ink/50 absolute inset-0 flex items-center justify-center transition-opacity duration-200 motion-reduce:transition-none">
        <PlayIcon />
      </span>
    </button>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
      aria-hidden="true"
      className="text-paper"
    >
      <circle cx="24" cy="24" r="23" fill="currentColor" opacity="0.15" />
      <circle
        cx="24"
        cy="24"
        r="23"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M19 15.5v17l14-8.5-14-8.5Z" fill="currentColor" />
    </svg>
  );
}
