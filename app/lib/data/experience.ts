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
    title: "Software Engineer Intern",
    company: "Lindy",
    location: "San Francisco, CA",
    period: "Jun 2026 - Aug 2026",
    description: [
      "Shipping production infrastructure for Lindy's high-volume AI agent platform",
      "Lead engineer of Routines, enabling agents to act on schedules and real-world events",
      "Built natural-language CRUD, dry-run previews, proactive triggers, and zero-LLM script routines end to end, from data model to UI, eventually scaling it into a managed catalog with fleet-wide rollout",
      "Integrated the system into workspace-wide agents driven through Slack, enforcing capability boundaries and attribution on shared multi-user surfaces",
    ],
    skills: [
      "typescript",
      "graphql & relay",
      "api & data modeling",
      "distributed systems",
      "agentic ai development",
    ],
  },
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
      "Built navigation features for Mustang Maps, a React Native campus navigation app for Cal Poly students",
      "Implemented A* pathfinding and integrated it into the routing UI",
      "Built map layer filtering and building category matching; fixed core search and directions UX across bottom sheets and input handling",
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
      "Led a 50+ member coding club, directing full-stack project development and delivering weekly technical workshops on TypeScript, Next.js, and system design",
      "Expanded club scope to support member-led passion projects, enabling students to ideate, build, and ship their own software",
      "Organized hackathons and collaborative sprints, growing active participation year over year",
    ],
    skills: [
      "typescript & next.js",
      "leadership",
      "teaching",
      "team management",
    ],
  },
  {
    title: "Freelance Website Developer",
    company: "Various Organizations",
    location: "Remote",
    period: "Jun 2021 - Present",
    description: [
      "Built and deployed responsive websites for clients including EuclidLearn and Care for Our Common Home using Next.js and Tailwind CSS",
      "Managed full project lifecycle for paid and pro bono engagements, including post-launch support and feature iterations",
      "Delivered across education, nonprofit, and local business sectors from initial scoping through long-term maintenance",
    ],
    skills: [
      "next.js & tailwindcss",
      "client communication",
      "project management",
    ],
  },
  // {
  //   title: "Director of Technology & CS Instructor",
  //   company: "STEMist Education",
  //   location: "San Jose, CA",
  //   period: "Jan 2022 - Jan 2023",
  //   description: [
  //     "Built the organization's website from scratch and led a developer team to ship new features and improvements",
  //     "Designed and taught a structured CS curriculum covering programming fundamentals and web development",
  //     "Guided students through end-to-end coding projects, from concept to working software, with hands-on mentorship",
  //   ],
  //   skills: [
  //     "web development",
  //     "leadership",
  //     "curriculum development",
  //     "mentorship",
  //   ],
  // },
  // {
  //   title: "Music Producer & Audio Engineer",
  //   company: "Freelance/Independent",
  //   location: "Remote",
  //   period: "Nov 2022 - Present",
  //   description: [
  //     "Produced and released hip-hop albums across streaming platforms, collaborating with multiple artists",
  //     "Served as Head of Sound for multiple theatre productions, managing live audio systems",
  //   ],
  //   skills: [
  //     "audio engineering",
  //     "sound design",
  //     "collaboration",
  //     "creative direction",
  //   ],
  // },
];
