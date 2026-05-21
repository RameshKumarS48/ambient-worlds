type Props = { title: string; color: string };

function getInitials(title: string) {
  const words = title.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function PosterFallback({ title, color }: Props) {
  const initials = getInitials(title);
  return (
    <div
      className="relative flex aspect-[2/3] w-full items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${color} 0%, #0a0a0b 100%)`,
      }}
    >
      {/* Subtle film grain on fallback */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
      />
      <span
        className="relative z-10 text-5xl font-bold tracking-[0.08em] text-white/80 drop-shadow-lg"
        style={{ fontFamily: "'Cinzel', Georgia, serif" }}
      >
        {initials}
      </span>
    </div>
  );
}
