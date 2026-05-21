export type Title = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  moods: string[];
  rating: number;
  imdb: string;
  language: string; // english, hindi, korean, japanese, european
  format: "movie" | "series" | "mini";
  runtime?: number; // for movies, in minutes
  episodes?: number; // for series
  platforms: string[]; // netflix, prime, disney, apple, any
  era: "classic" | "2000s" | "2010s" | "recent";
  audience: string[]; // solo, partner, family, friends
  why: string;
  color: string; // gradient color for fallback
  posterPath?: string | null;
  tmdbId?: number;
  streamingPlatforms?: string[]; // live data from Watchmode
};

export function yearToEra(year: number): Title["era"] {
  if (year < 2000) return "classic";
  if (year < 2010) return "2000s";
  if (year < 2020) return "2010s";
  return "recent";
}

export const GENRE_ID_TO_NAME: Record<number, string> = {
  28: "action",
  12: "adventure",
  16: "animation",
  35: "comedy",
  80: "crime",
  18: "drama",
  10751: "family",
  14: "fantasy",
  27: "horror",
  9648: "mystery",
  10749: "romance",
  878: "sci-fi",
  53: "thriller",
  10759: "action",
  10765: "sci-fi",
  10762: "family",
  10763: "drama",
  10766: "drama",
  10767: "comedy",
  10768: "drama",
  37: "drama",
};

export const CATALOG: Title[] = [
  // English movies
  { id: "inception", title: "Inception", year: 2010, genres: ["sci-fi", "thriller"], moods: ["tense", "mind-bending"], rating: 8.8, imdb: "tt1375666", language: "english", format: "movie", runtime: 148, platforms: ["netflix", "prime"], era: "2010s", audience: ["solo", "partner", "friends"], why: "A heist inside dreams that rewards your full attention.", color: "#1e3a8a" },
  { id: "darkknight", title: "The Dark Knight", year: 2008, genres: ["action", "thriller"], moods: ["tense", "dark"], rating: 9.0, imdb: "tt0468569", language: "english", format: "movie", runtime: 152, platforms: ["any"], era: "2000s", audience: ["solo", "partner", "friends"], why: "Heath Ledger's Joker — still the gold standard.", color: "#111827" },
  { id: "interstellar", title: "Interstellar", year: 2014, genres: ["sci-fi", "drama"], moods: ["mind-bending", "emotional"], rating: 8.6, imdb: "tt0816692", language: "english", format: "movie", runtime: 169, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Big ideas, bigger feelings, and that Hans Zimmer score.", color: "#0c4a6e" },
  { id: "shawshank", title: "The Shawshank Redemption", year: 1994, genres: ["drama"], moods: ["hopeful", "emotional", "inspiring"], rating: 9.3, imdb: "tt0111161", language: "english", format: "movie", runtime: 142, platforms: ["any"], era: "classic", audience: ["solo", "partner", "friends"], why: "A quiet masterpiece about hope that always lands.", color: "#78350f" },
  { id: "pulpfiction", title: "Pulp Fiction", year: 1994, genres: ["crime", "comedy"], moods: ["dark-comedy", "stylish"], rating: 8.9, imdb: "tt0110912", language: "english", format: "movie", runtime: 154, platforms: ["any"], era: "classic", audience: ["solo", "friends"], why: "Tarantino at his most quotable and electric.", color: "#7c2d12" },
  { id: "forrest", title: "Forrest Gump", year: 1994, genres: ["drama", "comedy"], moods: ["emotional", "happy", "hopeful"], rating: 8.8, imdb: "tt0109830", language: "english", format: "movie", runtime: 142, platforms: ["any"], era: "classic", audience: ["solo", "partner", "family"], why: "A warm hug of a film that holds up beautifully.", color: "#166534" },
  { id: "whiplash", title: "Whiplash", year: 2014, genres: ["drama"], moods: ["tense", "intense", "inspiring"], rating: 8.5, imdb: "tt2582802", language: "english", format: "movie", runtime: 106, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Two hours of pure white-knuckle ambition.", color: "#7f1d1d" },
  { id: "lalaland", title: "La La Land", year: 2016, genres: ["romance", "musical"], moods: ["romantic", "bittersweet", "happy"], rating: 8.0, imdb: "tt3783958", language: "english", format: "movie", runtime: 128, platforms: ["netflix"], era: "2010s", audience: ["partner", "solo"], why: "Dreamy, gorgeous, and quietly devastating.", color: "#9d174d" },
  { id: "getout", title: "Get Out", year: 2017, genres: ["horror", "thriller"], moods: ["tense", "scared", "dark"], rating: 7.7, imdb: "tt5052448", language: "english", format: "movie", runtime: 104, platforms: ["prime"], era: "2010s", audience: ["solo", "partner", "friends"], why: "Smart, scary, and impossible to look away from.", color: "#1c1917" },
  { id: "knives", title: "Knives Out", year: 2019, genres: ["mystery", "comedy"], moods: ["fun", "clever", "happy"], rating: 7.9, imdb: "tt8946378", language: "english", format: "movie", runtime: 130, platforms: ["prime"], era: "2010s", audience: ["family", "friends", "partner"], why: "A whodunit that's genuinely fun for everyone.", color: "#854d0e" },
  { id: "gonegirl", title: "Gone Girl", year: 2014, genres: ["thriller", "mystery"], moods: ["tense", "dark", "mind-bending"], rating: 8.1, imdb: "tt2267998", language: "english", format: "movie", runtime: 149, platforms: ["prime"], era: "2010s", audience: ["solo", "partner"], why: "A twisty thriller that gets darker with every turn.", color: "#1f2937" },
  { id: "eeaao", title: "Everything Everywhere All at Once", year: 2022, genres: ["sci-fi", "comedy"], moods: ["mind-bending", "emotional", "happy"], rating: 7.8, imdb: "tt6710474", language: "english", format: "movie", runtime: 139, platforms: ["any"], era: "recent", audience: ["solo", "partner", "friends"], why: "Chaotic, hilarious, and surprisingly tender.", color: "#a21caf" },
  { id: "gbh", title: "The Grand Budapest Hotel", year: 2014, genres: ["comedy", "adventure"], moods: ["fun", "quirky", "happy"], rating: 8.1, imdb: "tt2278388", language: "english", format: "movie", runtime: 99, platforms: ["disney"], era: "2010s", audience: ["solo", "partner", "friends"], why: "Wes Anderson's most perfect pastel confection.", color: "#be185d" },
  { id: "hereditary", title: "Hereditary", year: 2018, genres: ["horror", "drama"], moods: ["scared", "dark", "tense"], rating: 7.3, imdb: "tt7784604", language: "english", format: "movie", runtime: 127, platforms: ["prime"], era: "2010s", audience: ["solo", "partner"], why: "The kind of horror that gets under your skin and stays.", color: "#0c0a09" },
  { id: "quietplace", title: "A Quiet Place", year: 2018, genres: ["horror", "thriller"], moods: ["tense", "scared"], rating: 7.5, imdb: "tt6644200", language: "english", format: "movie", runtime: 90, platforms: ["prime"], era: "2010s", audience: ["partner", "friends"], why: "Silence has never been this unbearably tense.", color: "#292524" },
  { id: "wolfwallst", title: "The Wolf of Wall Street", year: 2013, genres: ["crime", "comedy"], moods: ["dark-comedy", "excited", "fun"], rating: 8.2, imdb: "tt0993846", language: "english", format: "movie", runtime: 180, platforms: ["netflix"], era: "2010s", audience: ["solo", "friends"], why: "Three hours that fly by like a sugar rush.", color: "#365314" },
  { id: "coco", title: "Coco", year: 2017, genres: ["animation", "family"], moods: ["emotional", "happy", "hopeful"], rating: 8.4, imdb: "tt2380307", language: "english", format: "movie", runtime: 105, platforms: ["disney"], era: "2010s", audience: ["family", "solo"], why: "Pixar at its most beautiful and heartfelt.", color: "#c2410c" },
  { id: "insideout", title: "Inside Out", year: 2015, genres: ["animation", "family"], moods: ["emotional", "happy"], rating: 8.2, imdb: "tt2096673", language: "english", format: "movie", runtime: 95, platforms: ["disney"], era: "2010s", audience: ["family", "solo"], why: "A clever, moving look inside your own head.", color: "#0369a1" },
  { id: "social", title: "The Social Network", year: 2010, genres: ["drama", "thriller"], moods: ["tense", "inspiring", "intense"], rating: 7.7, imdb: "tt1285016", language: "english", format: "movie", runtime: 120, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Aaron Sorkin dialogue at its sharpest.", color: "#1e40af" },
  { id: "madmax", title: "Mad Max: Fury Road", year: 2015, genres: ["action", "sci-fi"], moods: ["excited", "epic", "tense"], rating: 8.1, imdb: "tt1392190", language: "english", format: "movie", runtime: 120, platforms: ["netflix"], era: "2010s", audience: ["solo", "friends"], why: "One long, glorious chase through the apocalypse.", color: "#9a3412" },
  { id: "babydriver", title: "Baby Driver", year: 2017, genres: ["action", "crime"], moods: ["excited", "fun", "stylish"], rating: 7.6, imdb: "tt3890160", language: "english", format: "movie", runtime: 113, platforms: ["any"], era: "2010s", audience: ["solo", "friends", "partner"], why: "A heist movie choreographed to the soundtrack.", color: "#b91c1c" },
  { id: "lambs", title: "The Silence of the Lambs", year: 1991, genres: ["thriller", "horror"], moods: ["tense", "scared", "dark"], rating: 8.6, imdb: "tt0102926", language: "english", format: "movie", runtime: 118, platforms: ["any"], era: "classic", audience: ["solo", "partner"], why: "Hopkins and Foster in one of cinema's great duels.", color: "#262626" },
  { id: "schindler", title: "Schindler's List", year: 1993, genres: ["drama", "war"], moods: ["emotional", "dark", "inspiring"], rating: 9.0, imdb: "tt0108052", language: "english", format: "movie", runtime: 195, platforms: ["netflix"], era: "classic", audience: ["solo"], why: "Heavy, essential, unforgettable cinema.", color: "#1c1917" },
  { id: "goodwill", title: "Good Will Hunting", year: 1997, genres: ["drama"], moods: ["emotional", "inspiring", "hopeful"], rating: 8.3, imdb: "tt0119217", language: "english", format: "movie", runtime: 126, platforms: ["prime"], era: "classic", audience: ["solo", "partner"], why: "Robin Williams will absolutely wreck you.", color: "#15803d" },
  { id: "matrix", title: "The Matrix", year: 1999, genres: ["sci-fi", "action"], moods: ["mind-bending", "excited", "tense"], rating: 8.7, imdb: "tt0133093", language: "english", format: "movie", runtime: 136, platforms: ["netflix"], era: "classic", audience: ["solo", "friends", "partner"], why: "Still bends your brain 25 years later.", color: "#14532d" },
  { id: "dune", title: "Dune: Part One", year: 2021, genres: ["sci-fi", "adventure"], moods: ["epic", "mind-bending"], rating: 8.0, imdb: "tt1160419", language: "english", format: "movie", runtime: 155, platforms: ["netflix"], era: "recent", audience: ["solo", "partner"], why: "Pure cinematic scale — watch it as big as you can.", color: "#a16207" },
  { id: "crazyrich", title: "Crazy Rich Asians", year: 2018, genres: ["romance", "comedy"], moods: ["fun", "romantic", "happy"], rating: 6.9, imdb: "tt3104988", language: "english", format: "movie", runtime: 120, platforms: ["netflix"], era: "2010s", audience: ["partner", "friends", "family"], why: "Glossy, funny, and surprisingly emotional.", color: "#be123c" },
  { id: "walter", title: "The Secret Life of Walter Mitty", year: 2013, genres: ["adventure", "comedy"], moods: ["inspiring", "happy", "hopeful"], rating: 7.3, imdb: "tt0359950", language: "english", format: "movie", runtime: 114, platforms: ["disney"], era: "2010s", audience: ["solo", "partner", "family"], why: "A gentle reminder to go do the thing.", color: "#0e7490" },

  // Hindi movies
  { id: "3idiots", title: "3 Idiots", year: 2009, genres: ["comedy", "drama"], moods: ["happy", "inspiring", "emotional"], rating: 8.4, imdb: "tt1187043", language: "hindi", format: "movie", runtime: 170, platforms: ["netflix"], era: "2000s", audience: ["family", "friends", "solo"], why: "Comfort viewing that's actually genuinely good.", color: "#ca8a04" },
  { id: "dangal", title: "Dangal", year: 2016, genres: ["drama", "sport"], moods: ["inspiring", "emotional"], rating: 8.3, imdb: "tt5074352", language: "hindi", format: "movie", runtime: 161, platforms: ["netflix"], era: "2010s", audience: ["family", "solo"], why: "A true-story underdog tale that hits hard.", color: "#b45309" },
  { id: "tzp", title: "Taare Zameen Par", year: 2007, genres: ["drama", "family"], moods: ["emotional", "inspiring", "hopeful"], rating: 8.4, imdb: "tt0986264", language: "hindi", format: "movie", runtime: 165, platforms: ["netflix"], era: "2000s", audience: ["family", "solo"], why: "Have tissues ready — it earns every tear.", color: "#0e7490" },
  { id: "dildhadakne", title: "Dil Dhadakne Do", year: 2015, genres: ["comedy", "drama"], moods: ["fun", "happy", "emotional"], rating: 7.3, imdb: "tt4260364", language: "hindi", format: "movie", runtime: 170, platforms: ["prime"], era: "2010s", audience: ["family", "friends"], why: "A messy family on a cruise — what's not to love.", color: "#0891b2" },

  // Hindi series
  { id: "sacred", title: "Sacred Games", year: 2018, genres: ["thriller", "crime"], moods: ["tense", "dark"], rating: 8.7, imdb: "tt6077448", language: "hindi", format: "series", episodes: 16, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Mumbai noir at its most operatic.", color: "#7f1d1d" },
  { id: "mirzapur", title: "Mirzapur", year: 2018, genres: ["crime", "action"], moods: ["tense", "dark", "excited"], rating: 8.5, imdb: "tt8355834", language: "hindi", format: "series", episodes: 27, platforms: ["prime"], era: "2010s", audience: ["solo", "friends"], why: "Brutal, addictive small-town gang drama.", color: "#78350f" },
  { id: "panchayat", title: "Panchayat", year: 2020, genres: ["comedy", "drama"], moods: ["happy", "heartwarming", "fun"], rating: 8.9, imdb: "tt11868916", language: "hindi", format: "series", episodes: 24, platforms: ["prime"], era: "recent", audience: ["family", "solo", "partner"], why: "Slow, warm, and quietly perfect.", color: "#65a30d" },
  { id: "delhicrime", title: "Delhi Crime", year: 2019, genres: ["crime", "drama"], moods: ["tense", "dark", "intense"], rating: 8.5, imdb: "tt9691466", language: "hindi", format: "series", episodes: 14, platforms: ["netflix"], era: "2010s", audience: ["solo"], why: "A procedural that takes its weight seriously.", color: "#1e293b" },

  // Korean
  { id: "parasite", title: "Parasite", year: 2019, genres: ["thriller", "drama"], moods: ["tense", "mind-bending", "dark"], rating: 8.5, imdb: "tt6751668", language: "korean", format: "movie", runtime: 132, platforms: ["prime"], era: "2010s", audience: ["solo", "partner", "friends"], why: "Every twist lands. Every frame is composed.", color: "#3f3f46" },
  { id: "squid", title: "Squid Game", year: 2021, genres: ["thriller", "drama"], moods: ["tense", "dark", "excited"], rating: 8.0, imdb: "tt10919420", language: "korean", format: "series", episodes: 9, platforms: ["netflix"], era: "recent", audience: ["solo", "friends"], why: "Bingeable, brutal, and impossible to pause.", color: "#db2777" },

  // Spanish
  { id: "moneyheist", title: "Money Heist", year: 2017, genres: ["thriller", "crime"], moods: ["tense", "excited", "stylish"], rating: 8.2, imdb: "tt6468322", language: "european", format: "series", episodes: 41, platforms: ["netflix"], era: "2010s", audience: ["solo", "friends", "partner"], why: "A heist that just keeps escalating.", color: "#dc2626" },
  { id: "panslab", title: "Pan's Labyrinth", year: 2006, genres: ["fantasy", "drama"], moods: ["dark", "magical", "emotional"], rating: 8.2, imdb: "tt0457430", language: "european", format: "movie", runtime: 118, platforms: ["prime"], era: "2000s", audience: ["solo", "partner"], why: "Del Toro's dark fairy tale at its most haunting.", color: "#365314" },

  // Japanese
  { id: "spirited", title: "Spirited Away", year: 2001, genres: ["animation", "fantasy"], moods: ["magical", "happy", "emotional"], rating: 8.6, imdb: "tt0245429", language: "japanese", format: "movie", runtime: 125, platforms: ["netflix"], era: "2000s", audience: ["family", "solo", "partner"], why: "Miyazaki's most enchanting world.", color: "#0f766e" },
  { id: "yourname", title: "Your Name", year: 2016, genres: ["animation", "romance"], moods: ["romantic", "emotional", "magical"], rating: 8.4, imdb: "tt5311514", language: "japanese", format: "movie", runtime: 106, platforms: ["netflix"], era: "2010s", audience: ["partner", "solo"], why: "A romance that breaks and remakes your heart.", color: "#7c3aed" },

  // French
  { id: "amelie", title: "Amélie", year: 2001, genres: ["romance", "comedy"], moods: ["happy", "romantic", "fun"], rating: 8.3, imdb: "tt0211915", language: "european", format: "movie", runtime: 122, platforms: ["prime"], era: "2000s", audience: ["partner", "solo"], why: "Paris, whimsy, and Audrey Tautou's smile.", color: "#dc2626" },

  // German
  { id: "dark", title: "Dark", year: 2017, genres: ["sci-fi", "thriller"], moods: ["tense", "mind-bending", "dark"], rating: 8.8, imdb: "tt5753856", language: "european", format: "series", episodes: 26, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Time-travel done with terrifying precision.", color: "#0c0a09" },

  // English series
  { id: "breakingbad", title: "Breaking Bad", year: 2008, genres: ["drama", "thriller"], moods: ["tense", "dark", "intense"], rating: 9.5, imdb: "tt0903747", language: "english", format: "series", episodes: 62, platforms: ["netflix"], era: "2000s", audience: ["solo", "partner"], why: "Television's most perfect descent into hell.", color: "#a16207" },
  { id: "stranger", title: "Stranger Things", year: 2016, genres: ["sci-fi", "horror"], moods: ["tense", "excited", "fun"], rating: 8.7, imdb: "tt4574334", language: "english", format: "series", episodes: 34, platforms: ["netflix"], era: "2010s", audience: ["friends", "family", "partner"], why: "Nostalgic, scary, and impossible to stop watching.", color: "#dc2626" },
  { id: "office", title: "The Office (US)", year: 2005, genres: ["comedy"], moods: ["fun", "happy"], rating: 9.0, imdb: "tt0386676", language: "english", format: "series", episodes: 201, platforms: ["netflix"], era: "2000s", audience: ["solo", "partner", "friends"], why: "Endlessly rewatchable comfort food.", color: "#0369a1" },
  { id: "friends", title: "Friends", year: 1994, genres: ["comedy", "romance"], moods: ["fun", "happy"], rating: 8.9, imdb: "tt0108778", language: "english", format: "series", episodes: 236, platforms: ["netflix"], era: "classic", audience: ["solo", "partner", "friends", "family"], why: "The forever sitcom. You know what you're getting.", color: "#facc15" },
  { id: "blackmirror", title: "Black Mirror", year: 2011, genres: ["sci-fi", "thriller"], moods: ["mind-bending", "dark"], rating: 8.8, imdb: "tt2085059", language: "english", format: "series", episodes: 27, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Standalone episodes, each one a punch.", color: "#0f172a" },
  { id: "tedlasso", title: "Ted Lasso", year: 2020, genres: ["comedy", "drama"], moods: ["happy", "inspiring", "heartwarming", "hopeful"], rating: 8.8, imdb: "tt10986410", language: "english", format: "series", episodes: 34, platforms: ["apple"], era: "recent", audience: ["family", "solo", "partner"], why: "The kindest show on TV. You need it.", color: "#0891b2" },
  { id: "fleabag", title: "Fleabag", year: 2016, genres: ["comedy", "drama"], moods: ["dark-comedy", "emotional"], rating: 8.7, imdb: "tt5687612", language: "english", format: "series", episodes: 12, platforms: ["prime"], era: "2010s", audience: ["solo", "partner"], why: "Twelve episodes of near-perfect television.", color: "#9f1239" },
  { id: "mindhunter", title: "Mindhunter", year: 2017, genres: ["crime", "thriller"], moods: ["tense", "dark", "intense"], rating: 8.6, imdb: "tt5290382", language: "english", format: "series", episodes: 19, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Fincher's slow-burn dive into serial killer minds.", color: "#1f2937" },
  { id: "atla", title: "Avatar: The Last Airbender", year: 2005, genres: ["animation", "adventure"], moods: ["excited", "inspiring", "fun", "happy"], rating: 9.3, imdb: "tt0417299", language: "english", format: "series", episodes: 61, platforms: ["netflix"], era: "2000s", audience: ["family", "solo", "friends"], why: "Yes, the cartoon. Yes, it really is that good.", color: "#0d9488" },
  { id: "ozark", title: "Ozark", year: 2017, genres: ["crime", "thriller"], moods: ["tense", "dark", "intense"], rating: 8.4, imdb: "tt5071412", language: "english", format: "series", episodes: 44, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Cold, blue, and constantly tightening the screws.", color: "#0c4a6e" },
  { id: "got", title: "Game of Thrones", year: 2011, genres: ["fantasy", "drama"], moods: ["epic", "tense", "dark"], rating: 9.2, imdb: "tt0944947", language: "english", format: "series", episodes: 73, platforms: ["any"], era: "2010s", audience: ["solo", "partner"], why: "The biggest TV event of the decade, finale aside.", color: "#7c2d12" },
  { id: "crown", title: "The Crown", year: 2016, genres: ["drama", "history"], moods: ["inspiring", "emotional"], rating: 8.6, imdb: "tt4786824", language: "english", format: "series", episodes: 60, platforms: ["netflix"], era: "2010s", audience: ["solo", "partner"], why: "Sumptuous, stately, and quietly addictive.", color: "#1e3a8a" },
  { id: "succession", title: "Succession", year: 2018, genres: ["drama", "comedy"], moods: ["dark-comedy", "tense", "intense"], rating: 8.9, imdb: "tt7660850", language: "english", format: "series", episodes: 39, platforms: ["any"], era: "2010s", audience: ["solo", "partner"], why: "Awful people, magnificent writing.", color: "#1f2937" },
  { id: "thebear", title: "The Bear", year: 2022, genres: ["drama", "comedy"], moods: ["tense", "emotional", "intense"], rating: 8.6, imdb: "tt14452776", language: "english", format: "series", episodes: 28, platforms: ["disney"], era: "recent", audience: ["solo", "partner"], why: "A kitchen show with the heart rate of a thriller.", color: "#7f1d1d" },
  { id: "normalppl", title: "Normal People", year: 2020, genres: ["romance", "drama"], moods: ["romantic", "emotional", "bittersweet"], rating: 8.1, imdb: "tt9059760", language: "english", format: "series", episodes: 12, platforms: ["prime"], era: "recent", audience: ["solo", "partner"], why: "Quiet, aching, and devastatingly real.", color: "#475569" },
];

// Score a title against user answers
export type Answers = {
  mood: string;
  genre: string;
  language: string;
  format: string;
  audience: string;
  time: string;
  era: string;
  platform: string;
};

export function recommend(answers: Answers): Title[] {
  const scored = CATALOG.map((t) => {
    let s = 0;

    // Language
    if (answers.language === "any") s += 1;
    else if (t.language === answers.language) s += 5;
    else s -= 3;

    // Format
    if (answers.format === "either") s += 1;
    else if (answers.format === "movie" && t.format === "movie") s += 4;
    else if (answers.format === "series" && t.format === "series") s += 4;
    else if (answers.format === "mini" && (t.format === "mini" || (t.format === "series" && (t.episodes ?? 0) <= 10))) s += 4;
    else s -= 4;

    // Mood
    if (t.moods.includes(answers.mood)) s += 3;

    // Genre
    if (t.genres.includes(answers.genre)) s += 3;

    // Audience
    if (t.audience.includes(answers.audience)) s += 2;
    if (answers.audience === "family" && (t.moods.includes("dark") || t.genres.includes("horror") || t.genres.includes("crime"))) s -= 3;

    // Time
    if (answers.time === "under2" && t.format === "movie" && (t.runtime ?? 0) <= 120) s += 3;
    else if (answers.time === "2to3" && t.format === "movie" && (t.runtime ?? 0) > 120 && (t.runtime ?? 0) <= 200) s += 3;
    else if (answers.time === "binge" && t.format === "series") s += 3;
    else if (answers.time === "oneep" && t.format === "series") s += 2;
    else if (answers.time === "oneep" && t.format === "movie") s -= 2;

    // Era
    if (answers.era === "any") s += 1;
    else if (answers.era === "classic" && t.era === "classic") s += 2;
    else if (answers.era === "2000s" && t.era === "2000s") s += 2;
    else if (answers.era === "2010s" && t.era === "2010s") s += 2;
    else if (answers.era === "recent" && t.era === "recent") s += 2;

    // Platform
    if (answers.platform === "any") s += 1;
    else if (t.platforms.includes(answers.platform) || t.platforms.includes("any")) s += 2;

    // Rating bonus
    s += (t.rating - 7.0) * 0.5;

    return { t, s };
  });

  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, 5).map((x) => x.t);
}

export const PLATFORM_LABEL: Record<string, string> = {
  netflix: "Netflix",
  prime: "Amazon Prime",
  disney: "Disney+",
  apple: "Apple TV+",
  any: "Widely available",
};
