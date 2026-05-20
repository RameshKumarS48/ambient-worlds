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
      className="flex aspect-[2/3] w-full items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, rgba(0,0,0,0.85) 100%)`,
      }}
    >
      <span className="text-6xl font-bold tracking-tight text-white/95 drop-shadow-sm">
        {initials}
      </span>
    </div>
  );
}
