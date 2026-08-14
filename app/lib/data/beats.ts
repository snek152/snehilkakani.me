export const categories = [
  "mellow",
  "trap",
  "acoustic",
  "spacey",
  "synth",
] as const;

export type Beat = {
  name: string;
  file: string;
  category: (typeof categories)[number];
  tempo: number;
  description?: string;
};

/**
 * Array order IS the running order on `/music` — nothing sorts at render, so
 * this sequence is what a visitor scrolls.
 *
 * It is sequenced, not sorted. It used to be alphabetical, which is a
 * directory listing rather than a release sheet, and it read like one: the
 * first two rows were "Alien Trap" and "Alien Trap 3", and "Vengeance" sat
 * next to "Vengeance 3" further down. Opening on two near-identical names
 * makes 22 beats look like variants of each other.
 *
 * Three rules hold this order together:
 * 1. No two adjacent entries share a `category`.
 * 2. The first five rows cover all five categories, so the top of the page
 *    demonstrates range — the claim the whole site is making — before the
 *    visitor decides whether to keep scrolling.
 * 3. Name variants never sit adjacent, and tempo swings between neighbours
 *    instead of settling into one energy band.
 *
 * Which beat LEADS is a taste call, not a derivable one: `Ascension` opens
 * because it is the most immediately genre-legible of the set (160 BPM, "fast
 * hi-hats and booming 808s"), which is the right first impression for someone
 * arriving from a shared link. Reorder freely — just keep the three rules, and
 * do not re-alphabetize.
 */
export const beats: Beat[] = [
  {
    name: "Ascension",
    file: "/beats/ascension.mp3",
    category: "trap",
    tempo: 160,
    description: "High-energy trap beat with fast hi-hats and booming 808s",
  },
  {
    name: "Feelings",
    file: "/beats/feelings.mp3",
    category: "mellow",
    tempo: 84,
    description: "Slower beat with soft keys and a simple drum pattern",
  },
  {
    name: "Vengeance",
    file: "/beats/vengeance.mp3",
    category: "synth",
    tempo: 150,
    description: "Energetic, aggressive synths and a driving drum rhythm",
  },
  {
    name: "Trouble",
    file: "/beats/trouble.mp3",
    category: "acoustic",
    tempo: 100,
    description:
      "Atmospheric piano melodies combined with a laid-back acoustic drum pattern",
  },
  {
    name: "Alien Trap",
    file: "/beats/alien_trap.mp3",
    category: "spacey",
    tempo: 146,
    description: "Distorted and cloudy synths paired with catchy trap drums",
  },
  {
    name: "Utopia",
    file: "/beats/utopia.mp3",
    category: "trap",
    tempo: 132,
    description: "String sample chop with a hard-hitting trap drum pattern",
  },
  {
    name: "Static",
    file: "/beats/static.mp3",
    category: "mellow",
    tempo: 140,
    description:
      "An emotional piano beat with soft synths and a simple drum pattern",
  },
  {
    name: "Bounce Back",
    file: "/beats/bounce_back.mp3",
    category: "synth",
    tempo: 110,
    description: "Layered synths, a rhythmic bass, and a bouncy drum pattern",
  },
  {
    name: "All I Do",
    file: "/beats/all_i_do.mp3",
    category: "acoustic",
    tempo: 72,
    description: "Slow acoustic hip-hop drums with chipmunk soul elements",
  },
  {
    name: "Hell",
    file: "/beats/hell.mp3",
    category: "spacey",
    tempo: 140,
    description: "Dark, atmospheric synths with a laid-back trap drum pattern",
  },
  {
    name: "Vengeance 3",
    file: "/beats/vengeance_3.mp3",
    category: "trap",
    tempo: 150,
    description: "Trap drums with more aggressive synths and melodies",
  },
  {
    name: "Beach",
    file: "/beats/beach.mp3",
    category: "mellow",
    tempo: 105,
    description: "Laid-back beat with bouncy chords and catchy drums",
  },
  {
    name: "Comedy",
    file: "/beats/comedy_crazy.mp3",
    category: "synth",
    tempo: 145,
    description: "Synth melodies overlaying a vocal sample and energetic drums",
  },
  {
    name: "The Bag",
    file: "/beats/the_bag.mp3",
    category: "acoustic",
    tempo: 95,
    description: "Jazzy sample flip paired with a boom bap drum pattern",
  },
  {
    name: "Cloud",
    file: "/beats/cloud.mp3",
    category: "spacey",
    tempo: 134,
    description:
      "Emotional synths and airy pads with a trap-inspired drum pattern",
  },
  {
    name: "Alien Trap 3",
    file: "/beats/alien_trap_3.mp3",
    category: "trap",
    tempo: 134,
    description: "Punchy trap drums combined with eerie, spacey synths",
  },
  {
    name: "Zombie",
    file: "/beats/zombie_2.mp3",
    category: "mellow",
    tempo: 138,
    description: "Atmospheric strings and synths with simple, laid-back drums",
  },
  {
    name: "In My Mind",
    file: "/beats/in_my_mind.mp3",
    category: "synth",
    tempo: 126,
    description: "Bright synths and a catchy rhythm",
  },
  {
    name: "College Dropout Beat",
    file: "/beats/college_dropout_beat.mp3",
    category: "acoustic",
    tempo: 80,
    description: "A soul sample chop with laid-back drums",
  },
  {
    name: "Boat",
    file: "/beats/boat.mp3",
    category: "synth",
    tempo: 140,
    description: "Nostalgic synths and bells with a triplet bounce",
  },
  {
    name: "Spooky",
    file: "/beats/spooky_extended.mp3",
    category: "spacey",
    tempo: 138,
    description: "Eerie synths and bells with various switch ups",
  },
  {
    name: "Game Over",
    file: "/beats/game_over.mp3",
    category: "synth",
    tempo: 145,
    description: "Energetic, retro synths and a driving rhythm",
  },
];
