import { PLATFORM_LABEL, type Answers } from "./catalog";

export const SARCASTIC: Partial<Record<string, Record<string, string>>> = {
  mood: {
    happy: "Rare. Suspicious. What are you hiding?",
    emotional: "Voluntarily choosing to cry. Very healthy. Carry on.",
    tense: "Can't unwind without first re-winding yourself tighter. Classic you.",
    fun: "Outsourcing your sense of humour to a film. Bold move.",
    romantic: "Setting up expectations only a fictional character can meet.",
    "mind-bending": "You just love staring at your ceiling at 2am going 'but WHAT does it mean'.",
    scared: "Paying with your time and sanity to feel scared. Capitalism loves you.",
    inspiring: "You'll feel unstoppable for 20 minutes and then eat cereal for dinner.",
  },
  genre: {
    thriller: "Nothing like manufactured dread to unwind from your regular dread.",
    comedy: "Your actual life not cutting it? Fair.",
    drama: "Watching fictional people suffer so you feel better about yourself. Genius.",
    action: "Big explosions, zero context, maximum satisfaction. You are simple. Own it.",
    "sci-fi": "Escaping to a universe where your problems still exist, just with robots.",
    horror: "Voluntarily activating fight-or-flight alone at midnight. Brilliant.",
    romance: "Preparing to feel single even in a relationship. Classic.",
    animation: "For kids, technically. But look at you, living your truth.",
  },
  language: {
    english: "Subtitles too much work. Respect for owning it.",
    hindi: "Three hours of drama, two plot twists, one item number. Chef's kiss.",
    korean: "You'll be ugly-crying by episode two and furious about it.",
    japanese: "Existential dread served beautifully. Very you.",
    european: "Très sophisticated. You definitely own a beret.",
    any: "No filter whatsoever. Respectable chaos.",
  },
  format: {
    movie: "Two hours and done. The commitment issues are showing.",
    series: "There goes your sleep schedule. Hope your boss is understanding.",
    mini: "Ten episodes max — said by someone who watches four more. Every time.",
    either: "Can't even decide this. Riveting personality.",
  },
  audience: {
    solo: "Just you and the glow of a screen. A classic Thursday.",
    partner: "Hope they like your taste. Spoiler: they won't.",
    family: "Nothing that could traumatise, offend, or entertain anyone. Fun.",
    friends: "One wants action. One wants romance. Nobody agrees. Perfect chaos.",
  },
  time: {
    under2: "Starting at 11pm with 'just a quick one'. Legendary.",
    "2to3": "You actually allocated real hours for this. There's hope for you.",
    binge: "Work is a tomorrow problem. Tonight belongs to the couch.",
    oneep: "We both know you're watching four. Don't lie to yourself.",
  },
  era: {
    classic: "They made better films before you were born and you love to be reminded.",
    "2000s": "Nostalgia goggles on. Ignoring the questionable fashion. Correct.",
    "2010s": "The decade where TV saved cinema and everyone was on Twitter too much.",
    recent: "Only new things. The past is cringe. Understood.",
    any: "No era preference whatsoever. A ghost of the algorithm.",
  },
  platform: {
    netflix: "They keep raising prices and you keep paying. A love story.",
    prime: "Came for the shipping, stayed for the content. They planned this.",
    disney: "There's no shame in being an adult watching Disney+. Almost none.",
    apple: "Nine dollars. Six shows. All of them strangely good. Infuriating.",
    any: "The resourceful type. Say no more.",
  },
};

export function getSarcasticLine(key: string, value: string): string {
  return SARCASTIC[key]?.[value] ?? "Interesting choice. Definitely intentional.";
}

export function getMoodSummary(a: Answers): string[] {
  const moodDesc: Record<string, string> = {
    happy: "suspiciously cheerful",
    emotional: "emotionally leaking",
    tense: "pre-stressed before the film even starts",
    fun: "desperately in need of a laugh",
    romantic: "dangerously hopeful",
    "mind-bending": "one documentary away from a conspiracy board",
    scared: "a willing victim",
    inspiring: "briefly but intensely motivated",
  };

  const formatDesc: Record<string, string> = {
    movie: "a contained story you can emotionally process before bed",
    series: "a full commitment that will absolutely not end before midnight",
    mini: "something short enough to feel responsible, and won't be",
    either: "literally anything — the decision was too hard",
  };

  const timeDesc: Record<string, string> = {
    under2: "two hours (you said)",
    "2to3": "a proper sit-down",
    binge: "as many hours as it takes",
    oneep: "one episode (sure, buddy)",
  };

  const audienceDesc: Record<string, string> = {
    solo: "alone with your thoughts and the glow",
    partner: "with a co-watcher who will definitely look at their phone",
    family: "surrounded by people with deeply conflicting opinions",
    friends: "in a group that statistically cannot agree on a single thing",
  };

  const platform = PLATFORM_LABEL[a.platform] ?? "wherever you can find it";

  return [
    `Tonight's energy: ${moodDesc[a.mood] ?? "uncertain"}, ${audienceDesc[a.audience] ?? "somehow"}.`,
    `You want ${formatDesc[a.format] ?? "something"} and have ${timeDesc[a.time] ?? "some time"}.`,
    `Opening ${platform} in 3… 2… then scrolling for 40 minutes anyway.`,
  ];
}
