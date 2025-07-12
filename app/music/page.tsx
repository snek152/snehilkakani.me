// "use client";
// import { useState, useRef } from "react";
// import { Play, Pause } from "lucide-react";

// const beats = [
//   { name: "Utopia", file: "/utopia.mp3" },
//   { name: "Crystal", file: "/crystal.mp3" },
//   { name: "Phantom", file: "/phantom.mp3" },
// ];

// const trackColors = [
//   "bg-purple-500",
//   "bg-blue-500",
//   "bg-green-500",
//   "bg-yellow-400",
//   "bg-red-500",
//   "bg-pink-400",
//   "bg-teal-400",
//   "bg-indigo-500",
// ];

// export default function BeatArrangementView() {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [selectedBeat, setSelectedBeat] = useState(beats[0]);
//   const audioRef = useRef(null);

//   const handlePlay = () => {
//     if (audioRef.current) {
//       audioRef.current.play();
//       setIsPlaying(true);
//     }
//   };

//   const handlePause = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const switchBeat = (beat) => {
//     setSelectedBeat(beat);
//     setIsPlaying(false);
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.load();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#111] text-white font-sans px-6 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-semibold tracking-tight">
//           🎛 Beat Timeline
//         </h1>
//         <div className="flex gap-2">
//           <button
//             onClick={handlePlay}
//             className="p-2 rounded-md bg-[#252525] hover:bg-[#3a3a3a]"
//           >
//             <Play className="w-5 h-5 text-white" />
//           </button>
//           <button
//             onClick={handlePause}
//             className="p-2 rounded-md bg-[#252525] hover:bg-[#3a3a3a]"
//           >
//             <Pause className="w-5 h-5 text-white" />
//           </button>
//         </div>
//       </div>

//       <div className="flex gap-3 mb-6">
//         {beats.map((beat) => (
//           <button
//             key={beat.name}
//             onClick={() => switchBeat(beat)}
//             className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
//               selectedBeat.name === beat.name
//                 ? "bg-white text-black"
//                 : "bg-[#222] text-white hover:bg-[#444]"
//             }`}
//           >
//             {beat.name}
//           </button>
//         ))}
//       </div>

//       <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-x-auto">
//         <div className="grid grid-cols-32 gap-1 p-4">
//           {Array.from({ length: 8 }).map((_, trackIdx) => (
//             <div key={trackIdx} className="flex gap-1 items-center h-10">
//               {Array.from({ length: 32 }).map((_, segIdx) => (
//                 <div
//                   key={segIdx}
//                   className={`${
//                     trackColors[trackIdx % trackColors.length]
//                   } w-8 h-full rounded-sm transition-opacity ${
//                     (trackIdx + segIdx) % 3 === 0 ? "opacity-90" : "opacity-60"
//                   } hover:opacity-100`}
//                 ></div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>

//       <p className="text-xs text-gray-400 mt-6">
//         Now Playing: {selectedBeat.name}
//       </p>
//       <audio ref={audioRef} preload="auto" className="hidden">
//         <source src={selectedBeat.file} type="audio/mpeg" />
//       </audio>
//     </div>
//   );
// }
