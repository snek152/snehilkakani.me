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

export const beats: Beat[] = [
  {
    name: "Alien Trap",
    file: "/beats/alien_trap.mp3",
    category: "spacey",
    tempo: 146,
    description: "Distorted and cloudy synths paired with catchy trap drums",
  },
  {
    name: "Alien Trap 3",
    file: "/beats/alien_trap_3.mp3",
    category: "trap",
    tempo: 134,
    description: "Punchy trap drums combined with eerie, spacey synths",
  },
  {
    name: "All I Do",
    file: "/beats/all_i_do.mp3",
    category: "acoustic",
    tempo: 72,
    description: "Slow acoustic hip-hop drums with chipmunk soul elements",
  },
  {
    name: "Ascension",
    file: "/beats/ascension.mp3",
    category: "trap",
    tempo: 160,
    description: "High-energy trap beat with fast hi-hats and booming 808s",
  },
  {
    name: "Boat",
    file: "/beats/boat.mp3",
    category: "synth",
    tempo: 140,
    description: "Nostalgic synths and bells with a triplet bounce",
  },
  {
    name: "Bounce Back",
    file: "/beats/bounce_back.mp3",
    category: "synth",
    tempo: 110,
    description: "Layered synths, a rhythmic bass, and a bouncy drum pattern",
  },
  {
    name: "College Dropout Beat",
    file: "/beats/college_dropout_beat.mp3",
    category: "acoustic",
    tempo: 80,
    description: "A soul sample chop with laid-back drums",
  },
  {
    name: "Comedy",
    file: "/beats/comedy_crazy.mp3",
    category: "synth",
    tempo: 145,
    description: "Synth melodies overlaying a vocal sample and energetic drums",
  },
  {
    name: "Feelings",
    file: "/beats/feelings.mp3",
    category: "mellow",
    tempo: 84,
    description: "Slower beat with soft keys and a simple drum pattern",
  },
  {
    name: "Game Over",
    file: "/beats/game_over.mp3",
    category: "synth",
    tempo: 145,
    description: "Energetic, retro synths and a driving rhythm",
  },
  {
    name: "Hell",
    file: "/beats/hell.mp3",
    category: "spacey",
    tempo: 140,
    description: "Dark, atmospheric synths with a laid-back trap drum pattern",
  },
  {
    name: "In My Mind",
    file: "/beats/in_my_mind.mp3",
    category: "synth",
    tempo: 126,
    description: "Bright synths and a catchy rhythm",
  },
  {
    name: "Spooky",
    file: "/beats/spooky_extended.mp3",
    category: "spacey",
    tempo: 138,
    description: "Eerie synths and bells with various switch ups",
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
    name: "Stranded",
    file: "/beats/stranded.mp3",
    category: "mellow",
    tempo: 122,
    description: "A sentimental piano loop chopped with a triplet drum pattern",
  },
  {
    name: "The Bag",
    file: "/beats/the_bag.mp3",
    category: "acoustic",
    tempo: 95,
    description: "Jazzy sample flip paired with a boom bap drum pattern",
  },
  {
    name: "Thirty Three",
    file: "/beats/thirty_three.mp3",
    category: "spacey",
    tempo: 145,
    description: "A spacey beat with ethereal synths and a trap rhythm",
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
    name: "Utopia",
    file: "/beats/utopia.mp3",
    category: "trap",
    tempo: 132,
    description: "String sample chop with a hard-hitting trap drum pattern",
  },
  {
    name: "Vengeance",
    file: "/beats/vengeance.mp3",
    category: "synth",
    tempo: 150,
    description: "Energetic, aggressive synths and a driving drum rhythm",
  },
  {
    name: "Vengeance 3",
    file: "/beats/vengeance_3.mp3",
    category: "trap",
    tempo: 150,
    description: "Trap drums with more aggressive synths and melodies",
  },
  {
    name: "Zombie",
    file: "/beats/zombie_2.mp3",
    category: "mellow",
    tempo: 138,
    description: "Atmospheric strings and synths with simple, laid-back drums",
  },
];
