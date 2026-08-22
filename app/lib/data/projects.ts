import drama from "@/public/projects/drama.jpg";
import sra from "@/public/projects/sranew.jpg";
import genalt from "@/public/projects/genaltnew.jpg";
import floodsafe from "@/public/projects/floodsafe.jpg";
import steamforce from "@/public/projects/steamforce.jpg";
import proco from "@/public/projects/proco.jpg";
import euclidlearn from "@/public/projects/euclidlearn.jpg";

import impasse from "@/public/projects/impasse.png";
import orbis from "@/public/projects/orbis.png";
import fere from "@/public/projects/fere.jpg";
import fere2 from "@/public/projects/fere-win.jpeg";
import clearance from "@/public/projects/clearance.jpg";
import { StaticImageData } from "next/image";

export type Project = {
  title: string;
  subtitle?: string;
  description: string;
  image: StaticImageData | string;

  secondaryImage?: StaticImageData | string;
  skills: string[];
  link?: string;
  github?: string;
  privateRepo?: boolean;
};

export const projects: Project[] = [
  {
    title: "Fere: AI-Powered Desktop Dev Tooling Platform",
    subtitle: "January 2026 - May 2026",
    description:
      "Built a desktop platform that maps a local dev environment into a live, interactive service graph, tracking processes, ports, Docker containers, and API routes in real time. Won 2nd place ($10K) at Cal Poly's Innovation Quest. Designed an in-app AI assistant wired into the graph for querying, debugging, and proactive background monitoring with service-scoped context and adaptive suggestions.",
    skills: ["electron", "typescript", "agentic ai", "desktop development"],
    image: fere,
    github: "https://github.com/fere-oss/fere",
    link: "https://getfere.com",
    secondaryImage: fere2,
  },
  {
    title: "Impasse: AI-Powered Negotiation Training Platform",
    subtitle: "January 2026",
    description:
      "Engineered a full-stack AI negotiation simulator with agentic opponent, coaching, and analysis agents running concurrently at a 24-hour hackathon. Designed a multi-agent orchestration layer with real-time voice interaction via WebSockets, session analytics, and persistent storage.",
    image: impasse,
    skills: [
      "next.js & tailwindcss",
      "fastapi & websockets",
      "agentic ai development",
    ],
    github: "https://github.com/RahulThennarasu/impasse",
    link: "https://youtu.be/VSajuy4SSEM",
  },
  {
    title: "GU-Net: Diffuse Glioma Segmentation Research",
    subtitle: "June 2023 - July 2023",
    description:
      "Developed GU-Net, a novel U-Net-based architecture for segmenting diffuse gliomas in T2-FLAIR brain MRIs from the BraTS 2021 dataset, achieving 71.58% accuracy while training on just 1,647 images from 549 scans. Applied advanced data augmentation to compensate for the limited training data, aiming to make the model viable for underfunded hospitals with less imaging data on hand. Presented at UCSB and published in the Journal of Student Research.",
    link: "/projects/gu_net_diffuse_glioma_segmentation.pdf",
    github: "https://github.com/snek152/GU_Net_Glioma_Segmentation_SRA",
    image: sra,
    skills: [
      "pytorch neural network",
      "medical imaging",
      "research & presentation",
    ],
  },
  {
    title: "Clearance: Car Repair Shop Agent",
    subtitle: "June 2026",
    description:
      "Built a FastAPI agent that lets a car repair shop's sales, manager, and technician roles query jobs and generate quotes through one interface. Scoped every tool call to per-user Scalekit connected accounts so a technician's access denies at the identity layer before reaching an external tool, and grounded quotes in real job history via Actian VectorAI retrieval. Won 1st place ($500) in the Actian VectorAI DB track at the Scalekit x Actian x Render hackathon.",
    image: clearance,
    skills: [
      "fastapi & python",
      "agentic ai development",
      "role-based identity scoping",
      "vector db retrieval",
    ],
    github: "https://github.com/Theswagblader/agents-in-production",
  },
  {
    title: "FloodSafe: Atmospheric River Prediction",
    subtitle: "January 2023 - March 2023",
    description:
      "Assembled a dataset from scratch by scraping and processing historical weather data, then constructed a neural network for atmospheric river prediction, achieving over 95% accuracy. Built the full pipeline end-to-end, from scraping and train/test/val splitting to model training and evaluation. Deployed the model behind a FastAPI backend and built a web app for real-time predictions.",
    image: floodsafe,
    skills: [
      "pytorch computer vision",
      "full-stack web development",
      "data science & engineering",
    ],
    github: "https://github.com/snek152/floodsafe",
  },
  {
    title: "Orbis: AI Agent Observability Dashboard",
    subtitle: "October 2025 - December 2025",
    description:
      "Built a full-stack observability platform and Python SDK for devs to instrument and track AI agent executions, costs, and performance in real time. Engineered interactive DAG visualizations mapping agent execution graphs, integrated prompt versioning with rollback, and built cost analytics across runs.",
    image: orbis,
    skills: [
      "next.js & tailwindcss",
      "python sdk development",
      "data visualization & analytics",
      "postgresql & redis",
    ],
    github: "https://github.com/sbalaji09/Orbis",
  },
  {
    title: "ProCo: Code Contest Platform",
    subtitle: "September 2022 - June 2025",
    description:
      "Contributed to and maintained a competitive programming platform for 200+ users across 4 high schools. Engineered a remote code execution and grading server, SQL-based user management, and a responsive contest UI.",
    link: "https://proco.vercel.app",
    privateRepo: true,
    skills: [
      "next.js & prisma",
      "full-stack web development",
      "code collaboration",
      "ec2 server hosting",
    ],
    image: proco,
  },
  {
    title: "Website Development for Lynbrook Drama Department",
    link: "https://bit.ly/s74lhs",
    github: "https://github.com/lynbrookstudio74/studio74website",
    subtitle: "April 2024 - October 2024",
    description:
      "Architected a custom design and responsive website for Lynbrook Drama to showcase productions, events, and crew info. Implemented a custom GitHub-based CMS for seamless updates, enabling non-technical officers to maintain it themselves for 2+ years.",
    image: drama,
    skills: [
      "next.js & tailwindcss",
      "client collaboration",
      "responsive design & implementation",
    ],
  },
  {
    title: "Website Development for EuclidLearn",
    subtitle: "November 2023 - February 2024",
    description:
      "Designed and developed a custom website for EuclidLearn, a consulting company focused on high school test prep, emphasizing user experience and responsive design.",
    image: euclidlearn,
    skills: [
      "next.js & tailwindcss",
      "tailored design",
      "responsive web development",
    ],
    github: "https://github.com/snek152/euclidlearn",
    link: "https://euclidlearn.vercel.app",
  },
  {
    title: "GenAlt: AI-Powered Web Accessibility",
    subtitle: "November 2022 - April 2023",
    description:
      "Collaborated on an AI prototype improving web accessibility for the visually impaired. Received the Horn Entrepreneurship through Equity Award at the Diamond Challenge 2023.",
    image: genalt,
    skills: ["ml model deployment", "business development", "public speaking"],
    link: "/projects/genalt.jpg",
    privateRepo: true,
  },
  {
    title: "Steam Force: Accessible STEAM Learning App",
    subtitle: "November 2021 - April 2022",
    description:
      "Built a Next.js and Firebase web app delivering interactive STEAM education to underprivileged kids, spanning units across science, tech, engineering, art, and math with quiz-based lessons throughout. Focused on offline-capable, accessible design so the app worked regardless of a student's internet access or hardware. Won Honorable Mention in Physical Science and Engineering at the 2022 Synopsys Science Fair.",
    image: steamforce,
    skills: [
      "next.js & firebase",
      "accessibility & ux design",
      "constraint optimization",
    ],
    github: "https://github.com/snek152/steam-force",
  },
];
