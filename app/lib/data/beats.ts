export const categories = [
  "mellow",
  "trap",
  "acoustic",
  "spacey",
  "synth",
  "other",
] as const;

export type Beat = {
  name: string;
  file: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  category: (typeof categories)[number];
  tempo: number;
  key?: string;
};

export const beats: Beat[] = [
  {
    name: "alien trap",
    file: "/beats/alien_trap.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/5Cbk4pO9vukHhAJBunpRs9?si=0c4775b5303e48f1",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/alien/1812580779?i=1812580782",
    category: "spacey",
    tempo: 146,
    key: "Gmin",
  },
  {
    name: "alien trap 3",
    file: "/beats/alien_trap_3.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/19e91wHdNxh0pikniC4fz3?si=586efe57ddcb473b",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/overflow/1823553490?i=1823553491",
    category: "spacey",
    tempo: 134,
    key: "C#min",
  },
  {
    name: "alien trap 4",
    file: "/beats/alien_trap_4.mp3",
    category: "synth",
    tempo: 134,
  },
  {
    name: "all i do",
    file: "/beats/all_i_do.mp3",
    category: "acoustic",
    tempo: 72,
    key: "Gmaj",
  },
  {
    name: "alone",
    file: "/beats/alone.mp3",
    category: "spacey",
    tempo: 120,
    key: "Bbmaj",
  },
  {
    name: "apocalypse",
    file: "/beats/apocalypse.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/0Uv09DdE0nfqmiQUEM1rKE?si=484e72530e8e4833",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/no-bodies/1812580779?i=1812580789",
    category: "spacey",
    tempo: 130,
    key: "Dmin",
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
    // spotifyUrl:
    //   "https://open.spotify.com/track/4v0fZ7YkKMcioBM4UWhDTx?si=a949b9231649498b",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/thats-it/1741673619?i=1741673948",
    category: "synth",
    tempo: 140,
    key: "C#min",
  },
  {
    name: "boat 2",
    file: "/beats/boat_2.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/4pTtxQRgYiG3HTfOY3g4K0?si=ef377d95e1c74191",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/who/1741673619?i=1741674482",
    category: "synth",
    tempo: 130,
    key: "Dmaj",
  },
  {
    name: "boat 3",
    file: "/beats/boat_3.mp3",
    category: "mellow",
    tempo: 130,
    key: "F#min",
  },
  {
    name: "boat 4",
    file: "/beats/boat_4.mp3",
    category: "synth",
    tempo: 140,
    key: "F#min",
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
    // spotifyUrl:
    //   "https://open.spotify.com/track/0LQQek7Pep6Fp2puwAmNPB?si=f7f5dd0af9444513",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/com/1812580779?i=1812580785",
    category: "synth",
    tempo: 145,
    key: "Gmin",
  },
  {
    name: "drama",
    file: "/beats/drama.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/6KWNvyljumISmf0nMYbxcJ?si=17093579a1e24fda",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/drama/1812580779?i=1812580881",
    category: "trap",
    tempo: 158,
    key: "Amaj",
  },
  {
    name: "drifting",
    file: "/beats/drifting.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/4TKJnrXB6m0Uk0OsSKWvhX?si=bad63108da9847b6",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/jailed/1741673619?i=1741674181",
    category: "mellow",
    tempo: 130,
    key: "Gmaj",
  },
  {
    name: "dumb",
    file: "/beats/dumb.mp3",
    category: "spacey",
    tempo: 132,
  },
  {
    name: "e",
    file: "/beats/e.mp3",
    category: "other",
    tempo: 139,
    key: "Emin",
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
    // spotifyUrl:
    //   "https://open.spotify.com/track/0jBrSDS7KKTnDgW0zOmlpT?si=47290fecefc94435",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/game-over/1741673619?i=1741674485",
    category: "synth",
    tempo: 145,
    key: "Emin",
  },
  {
    name: "hell",
    file: "/beats/hell.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/6E8KSaOSEucNwipzeBk3kn?si=cf75bbcbd3ea4b7d",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/death-of-the-mind/1812580779?i=1812580786",
    category: "spacey",
    tempo: 140,
    key: "Amin",
  },
  {
    name: "hell 2",
    file: "/beats/hell_2.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/5hmbLXxXMDxPobjKDQusFn?si=fd9b726f7a2244cc",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/look-at-me/1823553490?i=1823553492",
    category: "trap",
    tempo: 142,
    key: "Amin",
  },
  {
    name: "hero",
    file: "/beats/hero.mp3",
    category: "synth",
    tempo: 160,
    key: "Bbmaj",
  },
  {
    name: "in my mind",
    file: "/beats/in_my_mind.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/36fPERmAdvCWnP2lH9nZTD?si=97d57eb5f1d14dee",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/in-my-mind/1812580779?i=1812580884",
    category: "synth",
    tempo: 126,
  },
  {
    name: "king",
    file: "/beats/king.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/1olMepH9LQeO1aQOAOzvpQ?si=e6150e6608c34d3b",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/the-king/1741673619?i=1741674489",
    category: "acoustic",
    tempo: 95,
  },
  {
    name: "lowkey vibe",
    file: "/beats/lowkey_vibe.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/2uFt52Z49TSq7iTjkJ1y0y?si=9985c91b5d604fb8",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/low-key/1812580779?i=1812580880",
    category: "mellow",
    tempo: 132,
  },
  {
    name: "memories",
    file: "/beats/memories.mp3",
    category: "mellow",
    tempo: 150,
  },
  {
    name: "monster",
    file: "/beats/cringe_beat.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/1tMznSU41DVnqaIrjun2ME?si=da09069952794a47",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/i-am/1741673619?i=1741674177",
    category: "trap",
    tempo: 136,
  },
  {
    name: "music box",
    file: "/beats/music_box.mp3",
    category: "mellow",
    tempo: 140,
  },
  {
    name: "ny beat",
    file: "/beats/ny_beat.mp3",
    category: "acoustic",
    tempo: 130,
  },
  {
    name: "operator",
    file: "/beats/operator.mp3",
    category: "spacey",
    tempo: 130,
  },
  {
    name: "shadow",
    file: "/beats/shadow.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/6IcItQ2bYVshKjjb88zh2f?si=32c9d7b5cf1a48cd",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/attn-addict/1812580779?i=1812580787",
    category: "trap",
    tempo: 115,
  },
  {
    name: "shut the front door",
    file: "/beats/shut_the_front_door.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/2Z4vcwNRINjoJ2XAu4acDd?si=27442a0956d9404a",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/lost-my-youth/1812580779?i=1812580781",
    category: "trap",
    tempo: 140,
  },
  {
    name: "space",
    file: "/beats/space.mp3",
    category: "spacey",
    tempo: 127,
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
    // spotifyUrl:
    //   "https://open.spotify.com/track/2txXJlPmJ5W2tDtKBGV9D6?si=691a5d817d3c4c04",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/nobody-in-my-way/1741673619?i=1741674183",
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
    name: "sunken",
    file: "/beats/sunken.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/2Hp4NpdI4uNXP6Z2ZKHcWW?si=18fe786740f14b92",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/on-my-own-tonight/1741673619?i=1741673627",
    category: "trap",
    tempo: 170,
  },
  { name: "sunset", file: "/beats/sunset.mp3", category: "synth", tempo: 130 },
  {
    name: "the bag",
    file: "/beats/the_bag.mp3",
    category: "acoustic",
    tempo: 95,
  },
  {
    name: "thirty three",
    file: "/beats/thirty_three.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/0XoDkApdAHb2ajqnvvm2Gm?si=9e27663514284c25",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/thirty-three/1823553490?i=1823553494",
    category: "spacey",
    tempo: 145,
    key: "Bbmin",
  },
  {
    name: "thunder",
    file: "/beats/thunder.mp3",
    category: "other",
    tempo: 140,
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
    // spotifyUrl:
    //   "https://open.spotify.com/track/5NrzQTaiFQvnIR6cTlJmH1?si=1804a3afe70c45a3",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/utopia/1812580779?i=1812580780",
    category: "trap",
    tempo: 132,
  },
  {
    name: "vengeance",
    file: "/beats/vengeance.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/1hOwgZEUA0b7vs8CXopadG?si=46ec994119fa455d",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/vengeance/1812580779?i=1812580882",
    category: "synth",
    tempo: 150,
  },
  {
    name: "vengeance 2",
    file: "/beats/vengeance_2.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/6QzkhU10zGDONjh8VOTDns?si=293f21d98abe47da",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/puppy-coat/1741673619?i=1741674062",
    category: "synth",
    tempo: 160,
  },
  {
    name: "vengeance 3",
    file: "/beats/vengeance_3.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/36PV7mLQwYQpVgK5M3Uarr?si=dd80c7aba79c4b92",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/lying-to-myself/1812580779?i=1812580883",
    category: "trap",
    tempo: 150,
  },
  {
    name: "zombie",
    file: "/beats/zombie_2.mp3",
    // spotifyUrl:
    //   "https://open.spotify.com/track/4wOzWjzN5w8Tri6wuztuBU?si=54f77b4a1137456f",
    // appleMusicUrl:
    //   "https://music.apple.com/us/album/stuck-in-a-hole/1741673619?i=1741674059",
    category: "mellow",
    tempo: 138,
  },
];
