import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const array1 = [
  "Software Engineer",
  "Full-Stack Developer",
  // "Creator",
];

const array2 = ["Music Producer", "Audio Engineer"];

const array3 = ["Photographer", "Graphic Designer", "Actor"];

const MetaPage = () => {
  return (
    <div className="w-screen max-w-screen fixed left-0 top-0 z-[1000] bg-secondary h-dvh lg:h-screen lg:max-h-full max-h-[calc(100dvh-4.5rem)] overflow-x-hidden ">
      <div className="w-full h-full flex items-center justify-end relative overflow-x-hidden bg-secondary p-8 bg-gradient-to-bl from-primary/30 via-background to-primary/20 border-0 border-primary/5 shadow-xl pr-20">
        <div className="flex flex-col items-end justify-center gap-0.5 text-right text-surface">
          <h1 className="font-domine text-5xl md:text-8xl font-bold">
            Snehil Kakani
          </h1>
          <div className="mt-2 flex items-end font-ibm justify-center gap-x-2 gap-y-1">
            {array1.map((t, index) => (
              <div
                key={t}
                className="flex items-center gap-x-2 text-xl text-surface/80"
              >
                <span>{t}</span>
                {index < array1.length - 1 && (
                  <span className="text-surface/70 select-none">•</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-end font-ibm justify-center gap-x-2 gap-y-1">
            {array2.map((t, index) => (
              <div
                key={t}
                className="flex items-center gap-x-2 text-xl text-surface/80"
              >
                <span>{t}</span>
                {index < array2.length - 1 && (
                  <span className="text-surface/70 select-none">•</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-end font-ibm justify-center gap-x-2 gap-y-1">
            {array3.map((t, index) => (
              <div
                key={t}
                className="flex items-center gap-x-2 text-xl text-surface/80"
              >
                <span>{t}</span>
                {index < array3.length - 1 && (
                  <span className="text-surface/70 select-none">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaPage;
