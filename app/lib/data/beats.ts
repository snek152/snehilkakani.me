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
};

export const beats: Beat[] = [
  {
    name: "alien trap",
    file: "/beats/alien_trap.mp3",
    category: "spacey",
    tempo: 146,
  },
  {
    name: "alien trap 3",
    file: "/beats/alien_trap_3.mp3",
    category: "trap",
    tempo: 134,
  },
  {
    name: "all i do",
    file: "/beats/all_i_do.mp3",
    category: "acoustic",
    tempo: 72,
  },
  {
    name: "ascension",
    file: "/beats/ascension.mp3",
    category: "trap",
    tempo: 160,
  },
  {
    name: "boat",
    file: "/beats/boat.mp3",
    category: "synth",
    tempo: 140,
  },
  {
    name: "bounce back",
    file: "/beats/bounce_back.mp3",
    category: "synth",
    tempo: 110,
  },
  {
    name: "college dropout beat",
    file: "/beats/college_dropout_beat.mp3",
    category: "acoustic",
    tempo: 80,
  },
  {
    name: "comedy",
    file: "/beats/comedy_crazy.mp3",
    category: "synth",
    tempo: 145,
  },
  {
    name: "feelings",
    file: "/beats/feelings.mp3",
    category: "mellow",
    tempo: 84,
  },
  {
    name: "game over",
    file: "/beats/game_over.mp3",
    category: "synth",
    tempo: 145,
  },
  {
    name: "hell",
    file: "/beats/hell.mp3",
    category: "spacey",
    tempo: 140,
  },
  {
    name: "in my mind",
    file: "/beats/in_my_mind.mp3",
    category: "synth",
    tempo: 126,
  },
  {
    name: "spooky",
    file: "/beats/spooky_extended.mp3",
    category: "spacey",
    tempo: 138,
  },
  {
    name: "static",
    file: "/beats/static.mp3",
    category: "mellow",
    tempo: 140,
  },
  {
    name: "stranded",
    file: "/beats/stranded.mp3",
    category: "mellow",
    tempo: 122,
  },
  {
    name: "the bag",
    file: "/beats/the_bag.mp3",
    category: "acoustic",
    tempo: 95,
  },
  {
    name: "thirty three",
    file: "/beats/thirty_three.mp3",
    category: "spacey",
    tempo: 145,
  },
  {
    name: "trouble",
    file: "/beats/trouble.mp3",
    category: "acoustic",
    tempo: 100,
  },
  {
    name: "utopia",
    file: "/beats/utopia.mp3",
    category: "trap",
    tempo: 132,
  },
  {
    name: "vengeance",
    file: "/beats/vengeance.mp3",
    category: "synth",
    tempo: 150,
  },
  {
    name: "vengeance 3",
    file: "/beats/vengeance_3.mp3",
    category: "trap",
    tempo: 150,
  },
  {
    name: "zombie",
    file: "/beats/zombie_2.mp3",
    category: "mellow",
    tempo: 138,
  },
];
