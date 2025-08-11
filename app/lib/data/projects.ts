import drama from "@/public/projects/drama.jpg";
import sra from "@/public/projects/sranew.jpg";
import genalt from "@/public/projects/genaltnew.jpg";
import floodsafe from "@/public/projects/floodsafe.jpg";
import steamforce from "@/public/projects/steamforce.jpg";
import proco from "@/public/projects/proco.jpg";
import { StaticImageData } from "next/image";

export type Project = {
  title: string;
  subtitle?: string;
  description: string;
  image: StaticImageData | string; // Use StaticImageData for local images or string for remote URLs
  skills: string[];
  link?: string;
  github?: string;
};

// Projects to include: EuclidLearn, Athletes4Others, Cfoch

export const projects: Project[] = [
  {
    title: "GU-Net: Diffuse Glioma Segmentation Research",
    subtitle: "June 2023 - July 2023",
    description:
      "Developed a neural network for segmenting diffuse gliomas in medical images, achieving 71.58% accuracy. Presented at UCSB and published in the Journal of Student Research.",
    link: "https://www.jsr.org/hs/index.php/path/article/view/6376",
    github: "https://github.com/snek152/GU_Net_Glioma_Segmentation_SRA",
    image: sra,
    skills: [
      "pytorch neural network",
      "medical imaging",
      "research & presentation",
    ],
  },
  {
    title: "Steam Force: Accessible STEAM Learning App",
    subtitle: "November 2021 - April 2022",
    description:
      "Built an offline-capable STEAM learning app for underprivileged youth, focusing on accessibility. Won Honorable Mention at the 2022 Synopsys Science Fair.",
    image: steamforce,
    skills: [
      "next.js & firebase",
      "accessibility & ux design",
      "constraint optimization",
    ],
    github: "https://github.com/snek152/steamforce",
    // link: "https://steamforce.snehilkakani.me",
  },
  {
    link: "https://bit.ly/s74lhs",
    github: "https://github.com/lynbrookstudio74/studio74website",
    title: "Website Development for Lynbrook Drama Department",
    subtitle: "April 2024 - October 2024",
    description:
      "Architected a responsive website for Lynbrook Drama to showcase productions, events, and crew info. Implemented a custom GitHub-based CMS for seamless updates using Next.js and Tailwind CSS.",
    image: drama,
    skills: [
      "next.js & tailwindcss",
      "client collaboration",
      "responsive design & implementation",
    ],
  },
  {
    title: "FloodSafe: Atmospheric River Prediction",
    subtitle: "January 2023 - March 2023",
    description:
      "Assembled a dataset and constructed a neural network for atmospheric river prediction, achieving over 95% accuracy. Deployed the model with FastAPI and produced a web app for real-time results.",
    image: floodsafe,
    skills: [
      "pytorch computer vision",
      "full-stack web development",
      "data science & engineering",
    ],
    github: "https://github.com/snek152/floodsafe",
    // link: "https://floodsafe-web.vercel.app",
  },
  {
    title: "ProCo: Code Contest Platform",
    subtitle: "September 2022 - June 2025",
    description:
      "Contributed to and maintained a competitive programming platform for 200+ users across 4 high schools. Engineered a remote grading server, SQL-based user management, and a responsive UI.",
    // github: "https://github.com/lhsdevx/proco",
    link: "https://proco.vercel.app",
    skills: [
      "next.js & prisma",
      "full-stack web development",
      "code collaboration",
      "ec2 server hosting",
    ],
    image: proco,
  },
  {
    title: "GenAlt: AI-Powered Web Accessibility",
    subtitle: "November 2022 - April 2023",
    description:
      "Collaborated with a team to develop an AI prototype improving web accessibility for the visually impaired. Received the Horn Entrepreneurship through Equity Award at the Diamond Challenge 2023.",
    image: genalt,
    skills: ["ml model deployment", "business development", "public speaking"],
    link: "/projects/genalt.jpg",
  },
  // {

  // }
];
