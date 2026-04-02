export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  skills?: string[];
}

export const experiences: Experience[] = [
  {
    title: "Software Engineer",
    company: "Hack4Impact Cal Poly",
    location: "San Luis Obispo, CA",
    period: "Sep 2025 - Present",
    description: [
      "Completed a two-month engineering bootcamp before contributing to the Paso Robles Food Co-op member portal",
      "Built server actions for group messaging and admin blasts with role-based auth and Zod validation",
      "Developed modals with member search, owner-pinned ordering, and accessibility support",
    ],
    skills: [
      "next.js & server actions",
      "back-end development",
      "role-based auth",
      "zod & validation",
      "typescript",
    ],
  },
  {
    title: "Software Engineer",
    company: "CodeBox",
    location: "San Luis Obispo, CA",
    period: "Sep 2025 - Present",
    description: [
      "Contributed to Mustang Maps, a React Native campus navigation app for Cal Poly students",
      "Implemented A* pathfinding and integrated it into the routing UI",
      "Built map layer filtering and building category matching, and fixed core search and directions UX across bottom sheets and input handling",
    ],
    skills: [
      "react native",
      "front-end development",
      "algorithms & pathfinding",
      "typescript",
      "mobile development",
    ],
  },
  {
    title: "President / Vice President / Head of Frontend",
    company: "Lynbrook DevX Club",
    location: "San Jose, CA",
    period: "May 2022 - Jun 2025",
    description: [
      "Led a 50+ member coding club as President, directing full-stack project development and delivering weekly technical workshops on TypeScript, Next.js, and system design",
      "Expanded club scope to support member-led passion projects, enabling students to ideate, build, and ship their own software",
      "Organized hackathons, workshops, and collaborative sprints, growing active participation year over year across all four years of high school",
    ],
    skills: [
      "typescript & next.js",
      "leadership",
      "teaching",
      "team management",
    ],
  },
  {
    title: "Cashier, Customer Service & Shift Leader",
    company: "Cicero's Pizza",
    location: "San Jose, CA",
    period: "Feb 2025 - Sep 2025",
    description: [
      "Led shift operations at a high-volume pizzeria, coordinating team members to maintain consistent service for 500+ weekly customers",
      "Managed inventory and resolved customer escalations across all areas of the business, maintaining quality standards under pressure",
      "Balanced phone, in-person, and operational responsibilities simultaneously in a fast-paced customer-facing environment",
    ],
    skills: [
      "customer service",
      "leadership",
      "team management",
      "problem solving",
      "communication",
    ],
  },
  {
    title: "Freelance Website Developer",
    company: "Various Organizations",
    location: "Remote",
    period: "Jun 2021 - Present",
    description: [
      "Built and deployed responsive websites for clients including EuclidLearn and Care for Our Common Home using Next.js and Tailwind CSS",
      "Managed full project lifecycle for both paid and pro bono engagements",
      "Maintained and iterated on live sites post-launch, providing ongoing technical support and feature additions as needed",
    ],
    skills: [
      "next.js & tailwindcss",
      "client communication",
      "project management",
    ],
  },
  {
    title: "Director of Technology & CS Instructor",
    company: "STEMist Education",
    location: "San Jose, CA",
    period: "Jan 2022 - Jan 2023",
    description: [
      "Built the organization's website from scratch and led a developer team to ship new features and improvements",
      "Designed and taught a structured CS curriculum covering programming fundamentals and web development across multiple sessions",
      "Guided students through end-to-end coding projects, from concept to working software, with hands-on mentorship",
    ],
    skills: [
      "web development",
      "leadership",
      "curriculum development",
      "mentorship",
    ],
  },
  {
    title: "Music Producer & Audio Engineer",
    company: "Freelance/Independent",
    location: "San Jose, CA",
    period: "Nov 2022 - Present",
    description: [
      "Produced and released hip-hop albums across streaming platforms, collaborating with multiple artists",
      "Developed studio-quality music using professional audio engineering techniques and industry-standard software",
      "Served as Head of Sound for multiple theatre productions, managing live audio systems and ensuring optimal acoustics",
    ],
    skills: [
      "audio engineering",
      "sound design",
      "collaboration",
      "creative direction",
    ],
  },
];
