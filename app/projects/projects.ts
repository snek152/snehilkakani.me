import drama from "../../public/projects/drama.jpg";
import sra from "../../public/projects/sranew.jpg";
import genalt from "../../public/projects/genaltnew.jpg";
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

// Projects to include: FloodSafe, Steam Force, Proco, EuclidLearn, Athletes4Others, Cfoch

export const projects: Project[] = [
  {
    link: "https://lhsdevx.vercel.app/",
    github: "https://github.com/lynbrookstudio74/studio74website",
    title: "Website Development for Lynbrook Drama Department",
    subtitle: "April 2024 - October 2024",
    description:
      "Developed a new website for the Lynbrook High School Drama Department to showcase productions and promote events. Added a production calendar, crew information, and photo gallery. Enabled easy updates via a custom Github-based CMS. Built with Next.js and Tailwind CSS for responsive design.",
    image: drama,
    skills: [
      "next.js & tailwindcss",
      "client collaboration",
      "responsive design & implementation",
    ],
  },
  //   {
  //     title: "Freelance Web Consultant",
  //     slug: "freelance-web",
  //     subtitle: "June 2021 - Present",
  //     description:
  //       "Designed and deployed custom websites and web applications for clients, emphasizing user experience and performance. Recognized with a gold PVSA and earned over $1K for client projects.",
  //     image: freelance,
  //     skills: [
  //       "client collaboration",
  //       "custom web solutions",
  //       "user experience design",
  //     ],
  //   },
  {
    title: "GU-Net: Diffuse Glioma Segmentation Research",
    subtitle: "Summer 2023",
    description:
      "Developed a novel neural network architecture for segmenting diffuse gliomas in medical images with limited training data. Achieved 71.58% segmentation accuracy by leveraging advanced machine learning techniques and data augmentation. Presented research findings at UCSB, collaborated with experts in medical imaging, and published results in the Journal of Student Research (JSR).",
    link: "https://www.jsr.org/hs/index.php/path/article/view/6376",
    github: "https://github.com/snek152/GU_Net_Glioma_Segmentation_SRA",
    image: sra,
    skills: [
      "pytorch neural network",
      "medical imaging",
      "research & presentation",
    ],
  },
  //   {
  //     title: "Director of Technology & CS Instructor @ STEMist Education",
  //     slug: "stemist-edu",
  //     subtitle: "January 2022 - January 2023",
  //     description:
  //       "Led the development of the STEMist Education website. Managed a developer team on projects including a Discord bot and student portal. Organized hackathons, trained new tech team members, and created lesson materials for web development and computer science. Awarded a gold PVSA for exceptional community service.",
  //     image: stemist,
  //     skills: [
  //       "team leadership & project management",
  //       "web development",
  //       "curriculum design",
  //       "community service",
  //     ],
  //   },
  //   {
  //     title: "Synopsys Science Fair Two Time Participant",
  //     slug: "synopsys-eng",
  //     subtitle: "2022 & 2023",
  //     description:
  //       "Showcased projects on neural network-based flood detection using novel algorithms and a full-stack web application for accessible STEAM education for underprivileged youth. Awarded Honorable Mention for physical science and engineering.",
  //     image: synopsys,
  //     skills: [
  //       "machine learning",
  //       "full-stack web development",
  //       "engineering constraint design",
  //       "project presentation",
  //     ],
  //   },
  {
    link: "/projects/genalt.jpg",
    title: "GenAlt: Web Accessibility Initiative",
    subtitle: "November 2022 - April 2023",
    description:
      "Led outreach and worked on development for an AI-based prototype aimed at improving blind accessibility to the Internet. Collaborated with a multidisciplinary team to form a business plan and design for expansion of innovation. Presented the project at the Diamond Challenge 2023, where it was recognized with the Horn Entrepreneurship through Equity Award for its impact and technical merit.",
    image: genalt,
    skills: [
      "machine learning model hosting",
      "business development & strategy",
      "presentational skills",
    ],
  },
];
