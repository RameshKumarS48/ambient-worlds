export type Option = { value: string; label: string };
export type Question = {
  key: "mood" | "genre" | "language" | "format" | "audience" | "time" | "era" | "platform";
  title: string;
  subtitle: string;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    key: "mood",
    title: "How are you feeling tonight?",
    subtitle: "Pick the vibe closest to your mood.",
    options: [
      { value: "happy", label: "😊 Happy & Upbeat" },
      { value: "emotional", label: "😢 In My Feelings" },
      { value: "tense", label: "😰 Edge of Seat" },
      { value: "fun", label: "😂 Need a Laugh" },
      { value: "romantic", label: "💕 Romantic" },
      { value: "mind-bending", label: "🤯 Mind-Bending" },
      { value: "scared", label: "😱 Scare Me" },
      { value: "inspiring", label: "🌟 Inspire Me" },
    ],
  },
  {
    key: "genre",
    title: "What genre are you feeling?",
    subtitle: "Pick the flavor you're after.",
    options: [
      { value: "thriller", label: "🔪 Thriller / Crime" },
      { value: "comedy", label: "😄 Comedy" },
      { value: "drama", label: "🎭 Drama" },
      { value: "action", label: "💥 Action / Adventure" },
      { value: "sci-fi", label: "🚀 Sci-Fi / Fantasy" },
      { value: "horror", label: "👻 Horror" },
      { value: "romance", label: "💌 Romance" },
      { value: "animation", label: "🎨 Animation" },
    ],
  },
  {
    key: "language",
    title: "Language preference?",
    subtitle: "Subtitles welcome — pick what works.",
    options: [
      { value: "english", label: "🇬🇧 English Only" },
      { value: "hindi", label: "🇮🇳 Hindi" },
      { value: "korean", label: "🇰🇷 Korean" },
      { value: "japanese", label: "🇯🇵 Japanese" },
      { value: "european", label: "🌍 European (French / Spanish / German)" },
      { value: "any", label: "🌐 Any Language" },
    ],
  },
  {
    key: "format",
    title: "Movie or series?",
    subtitle: "How much story do you want?",
    options: [
      { value: "movie", label: "🎬 Movie (one and done)" },
      { value: "series", label: "📺 Full Series" },
      { value: "mini", label: "🎯 Mini-series (under 10 eps)" },
      { value: "either", label: "🤷 Either works" },
    ],
  },
  {
    key: "audience",
    title: "Who's watching with you?",
    subtitle: "We'll match the vibe to the room.",
    options: [
      { value: "solo", label: "🧘 Just me" },
      { value: "partner", label: "💑 Me & my partner" },
      { value: "family", label: "👨‍👩‍👧 Family (kids around)" },
      { value: "friends", label: "🍕 Friends" },
    ],
  },
  {
    key: "time",
    title: "How much time do you have?",
    subtitle: "Be honest with yourself.",
    options: [
      { value: "under2", label: "⚡ Under 2 hours" },
      { value: "2to3", label: "⏱️ 2–3 hours" },
      { value: "binge", label: "🌙 Ready to binge" },
      { value: "oneep", label: "📱 Just one episode" },
    ],
  },
  {
    key: "era",
    title: "What era?",
    subtitle: "New, old, or anything goes?",
    options: [
      { value: "classic", label: "📼 Classic (pre-2000)" },
      { value: "2000s", label: "💿 2000s" },
      { value: "2010s", label: "📱 2010s" },
      { value: "recent", label: "✨ Recent (2020+)" },
      { value: "any", label: "🎲 Surprise me" },
    ],
  },
  {
    key: "platform",
    title: "What platforms do you have?",
    subtitle: "We'll lean toward what you can actually watch.",
    options: [
      { value: "netflix", label: "🔴 Netflix" },
      { value: "prime", label: "🟠 Amazon Prime" },
      { value: "disney", label: "🔵 Disney+" },
      { value: "apple", label: "⬛ Apple TV+" },
      { value: "any", label: "🔍 I'll find it anywhere" },
    ],
  },
];
