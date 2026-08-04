interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  avif?: string;
  webp?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
}

// `<picture>` over AVIF/WebP variants with a plain fallback, always with
// explicit width/height to reserve layout space before the file loads (CLS
// budget, plan §5). Variants are pre-optimized files the author drops in
// `public/images/` — no image-processing dependency, consistent with
// "content lives in the repo" (see the Phase 4 planning thread for why: no
// real screenshots existed yet to justify adding one).
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  avif,
  webp,
  loading = "lazy",
  fetchPriority = "auto",
  className = "",
}: ResponsiveImageProps) {
  return (
    <picture>
      {avif && <source srcSet={avif} type="image/avif" />}
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        className={className}
      />
    </picture>
  );
}
