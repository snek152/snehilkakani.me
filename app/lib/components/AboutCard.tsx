// import * as motion from "motion/react-m";
import Card from "./Card";
import Image from "next/image";
import aboutphoto from "@/public/about.jpg";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { SiGithub } from "@icons-pack/react-simple-icons";

export default function AboutCard() {
  return (
    <Card className="flex flex-col mx-2 lg:mx-10 lg:h-auto h-auto">
      <div className="flex items-center justify-between px-2 lg:px-3 py-1 lg:py-2 bg-background/10 border-b rounded-t-xl border-secondary">
        <div className="flex items-center gap-2">
          <span className="block w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-surface"></span>
          <span className="block w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-surface"></span>
          <span className="block w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-surface"></span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            width="22"
            height="14"
            viewBox="0 0 22 14"
            fill="none"
            className="text-surface/60"
          >
            <rect
              x="1"
              y="1"
              width="20"
              height="12"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="17"
              cy="7"
              r="2"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <rect
              x="3"
              y="4"
              width="6"
              height="6"
              rx="2"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
      <div className="absolute top-4 right-3 flex items-center gap-2 z-10">
        <span className="w-2 h-2 rounded-full bg-primary border border-secondary"></span>
      </div>
      <div className="relative bg-surface">
        <div className="relative">
          <Image
            src={aboutphoto}
            alt="photo of snehil kakani in front of the manhattan bridge"
            width={600}
            height={600}
            className="object-cover object-center h-[25svh] lg:h-[40vh] w-full"
            priority
          />
        </div>
        <div className="flex flex-col m-4 items-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary w-full text-left font-domine tracking-tight relative">
            Snehil Kakani
          </h1>
          <h2 className="text-sm lg:text-base text-on-surface font-domine w-full text-left mb-2">
            Incoming Freshman at Cal Poly, SLO
          </h2>
          <p className="text-on-surface font-ibm text-sm w-full lg:text-base">
            Focused on computer science and software engineering. Passionate
            about creating innovative solutions and exploring new technologies.
            Exploring music production and photography.
          </p>
          <div className="flex gap-2 mt-4 items-center">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-surface z-20 relative px-4 py-2 rounded-xl text-sm font-domine shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 flex gap-1 items-center h-full"
            >
              <DocumentTextIcon className="w-6 h-6" />
              <span>Resume</span>
            </a>
            <a
              href="https://github.com/snehilk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent hover:bg-on-surface/5 text-on-surface z-20 relative text-sm font-domine hover:shadow-sm rounded-lg p-1 transition-all duration-200 flex gap-1 items-center h-full"
            >
              <SiGithub className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/snehilkakani/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent hover:bg-on-surface/5 text-on-surface z-20 relative text-sm font-domine hover:shadow-sm rounded-lg p-1 transition-all duration-200 flex gap-1 items-center h-full"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 72 72"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
                fill="currentColor"
              >
                <g fill="none" fillRule="evenodd">
                  <path
                    d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z"
                    fill="#404040"
                  />
                  <path
                    d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
                    fill="#FFF"
                  />
                </g>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 py-1.5 lg:py-2 bg-secondary">
        <span className="w-4 h-4 rounded-full bg-surface border-2 border-on-surface shadow-inner"></span>
        <span className="w-3 h-3 rounded-full bg-secondary border border-surface"></span>
        <svg
          width="18"
          height="10"
          viewBox="0 0 18 10"
          fill="none"
          className="text-surface"
        >
          <rect
            x="1"
            y="2"
            width="14"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="15"
            y="4"
            width="2"
            height="2"
            rx="0.5"
            fill="currentColor"
          />
          <rect x="3" y="4" width="8" height="2" rx="1" fill="currentColor" />
        </svg>
      </div>
    </Card>
  );
}
