import drama from "@/public/projects/drama.jpg";
import lapse from "@/public/projects/lapse.jpg";
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
import watchdog from "@/public/projects/watchdog.jpg";
import { StaticImageData } from "next/image";

export type Project = {
  title: string;
  subtitle?: string;
  description: string;
  details?: string[];
  award?: string;
  image: StaticImageData;

  secondaryImage?: StaticImageData;
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
      "A desktop dev tool that maps your local environment into a live, interactive service graph.",
    details: [
      "Tracks processes, ports, Docker containers, and API routes in real time",
      "An in-app AI assistant queries, debugs, and monitors proactively with service-scoped context",
    ],
    award: "2nd place ($10K) · Cal Poly Innovation Quest",
    skills: ["electron", "typescript", "agentic ai", "desktop development"],
    image: fere,
    github: "https://github.com/fere-oss/fere",
    link: "https://getfere.com",
    secondaryImage: fere2,
  },
  {
    title: "Watchdog: Illegal Wildlife Trade Detection",
    subtitle: "October 2026",
    description:
      "A multi-agent system that catches illegal ivory listings on online marketplaces, which current technologies miss.",
    details: [
      "Three competing agents debate in a dynamic order on Cisco's AGNTCY, calling specialists on demand",
      "Extended to live eBay listings: one flagged listing surfaces related listings and linked sellers",
      "Sorted 99.2% of an adversarial dataset correctly",
    ],
    award: "1st place ($4K in iPad Pros) · Cisco Cloud AI track, UCSC AI Hackathon",
    skills: [
      "agentic ai development",
      "cisco agntcy",
      "fastapi & next.js",
      "multi-agent orchestration",
    ],
    image: watchdog,
    github: "https://github.com/SrimanRatnapu/watchdog",
    link: "https://youtu.be/Vn_vT54s7Kw",
  },
  {
    title: "Lapse: Medicaid Coverage Retention Engine",
    subtitle: "September 2026",
    description:
      "A web app that keeps qualifying Medicaid patients covered, clearing 39% more than the state's check.",
    details: [
      "An AI pipeline pulls verified exemption evidence from clinical notes, so doctors can sign off",
      "An outreach loop emails or calls patients for the info they need to renew, in their native language",
    ],
    award:
      "3rd place ($2K) · Healthcare AI Hackathon, judged by NEA, Pear VC, AWS, OpenAI, and Stanford Medicine",
    image: lapse,
    skills: ["next.js", "aws bedrock", "openai", "healthcare ai"],
    github: "https://github.com/sbalaji09/lapse",
  },
  {
    title: "Clearance: Car Repair Shop Agent",
    subtitle: "June 2026",
    description:
      "A FastAPI agent that lets a car repair shop's sales, manager, and technician roles query jobs and generate quotes through one interface.",
    details: [
      "Every tool call scoped to per-user Scalekit accounts, so a technician is denied at the identity layer",
      "Quotes grounded in real job history via Actian VectorAI retrieval",
    ],
    award:
      "1st place ($500) · Actian VectorAI DB track, Scalekit x Actian x Render hackathon",
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
    title: "Impasse: AI-Powered Negotiation Training Platform",
    subtitle: "January 2026",
    description:
      "A full-stack AI negotiation simulator with opponent, coaching, and analysis agents running concurrently.",
    details: [
      "Made in 24 hours at a hackathon",
      "Multi-agent orchestration with real-time voice over WebSockets, session analytics, and persistent storage",
    ],
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
    title: "Orbis: AI Agent Observability Dashboard",
    subtitle: "October 2025 - December 2025",
    description:
      "An observability platform and Python SDK for tracking AI agent executions, costs, and performance in real time.",
    details: [
      "Interactive DAG visualizations of agent execution graphs",
      "Prompt versioning with rollback, and cost analytics across runs",
    ],
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
      "A competitive programming platform serving 200+ users across 4 high schools.",
    details: [
      "Remote code execution and grading server",
      "SQL-based user management and a responsive contest UI",
    ],
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
    title: "GU-Net: Diffuse Glioma Segmentation Research",
    subtitle: "June 2023 - July 2023",
    description:
      "A novel U-Net-based architecture for segmenting diffuse gliomas in T2‑FLAIR brain MRIs.",
    details: [
      "71.58% accuracy on BraTS 2021, trained on just 1,647 images from 549 scans",
      "Heavy data augmentation to make it viable for underfunded hospitals with less imaging data",
    ],
    award: "Presented at UCSB · Published in the Journal of Student Research",
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
    title: "FloodSafe: Atmospheric River Prediction",
    subtitle: "January 2023 - March 2023",
    description:
      "A neural network that predicts atmospheric rivers, with a web app for real-time predictions.",
    details: [
      "95%+ accuracy on a dataset assembled from scratch by scraping historical weather data",
      "The full pipeline, from scraping and splits to training, evaluation, and a FastAPI backend",
    ],
    image: floodsafe,
    skills: [
      "pytorch computer vision",
      "full-stack web development",
      "data science & engineering",
    ],
    github: "https://github.com/snek152/floodsafe",
  },
  {
    title: "GenAlt: AI-Powered Web Accessibility",
    subtitle: "November 2022 - April 2023",
    description:
      "An AI prototype that improves web accessibility for the visually impaired.",
    award: "Horn Entrepreneurship through Equity Award · Diamond Challenge 2023",
    image: genalt,
    skills: ["ml model deployment", "business development", "public speaking"],
    link: "/projects/genalt.jpg",
    privateRepo: true,
  },
  {
    title: "Steam Force: Accessible STEAM Learning App",
    subtitle: "November 2021 - April 2022",
    description:
      "A Next.js and Firebase web app delivering interactive STEAM education to underprivileged kids.",
    details: [
      "Quiz-based lessons across science, tech, engineering, art, and math",
      "Offline-capable and accessible regardless of internet access or hardware",
    ],
    award:
      "Honorable Mention, Physical Science and Engineering · 2022 Synopsys Science Fair",
    image: steamforce,
    skills: [
      "next.js & firebase",
      "accessibility & ux design",
      "constraint optimization",
    ],
    github: "https://github.com/snek152/steam-force",
  },
  {
    title: "Website Development for EuclidLearn",
    subtitle: "November 2023 - February 2024",
    description:
      "A custom website for EuclidLearn, a high school test prep consultancy, built around user experience and responsive design.",
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
    title: "Website Development for Lynbrook Drama Department",
    link: "https://bit.ly/s74lhs",
    github: "https://github.com/lynbrookstudio74/studio74website",
    subtitle: "April 2024 - October 2024",
    description:
      "A custom, responsive website for Lynbrook Drama showcasing productions, events, and crew info.",
    details: [
      "A GitHub-based CMS lets non-technical officers maintain it themselves, for 2+ years and counting",
    ],
    image: drama,
    skills: [
      "next.js & tailwindcss",
      "client collaboration",
      "responsive design & implementation",
    ],
  },
];
