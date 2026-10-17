export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  roles?: { title: string; period: string }[];
  summary: string;
  details: string[];
  impact?: string;
  skills?: string[];
}

export const experiences: Experience[] = [
  {
    title: "Software Engineer Intern",
    company: "Lindy",
    location: "San Francisco, CA",
    period: "Jun 2026 - Aug 2026",
    summary:
      "Built production infrastructure for Lindy's high-volume AI agent platform",
    details: [
      "Lead engineer of Routines, enabling agents to act on schedules and real-world events",
      "Designed features from data model to UI, then scaled it into a managed catalog with fleet-wide rollout and extended it into workspace-wide Slack agents",
    ],
    impact:
      "Shipped 400+ PRs over 10 weeks, owning Routines end-to-end and integrating it into Lindy Teammate, the company's biggest launch to date",
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
    period: "Sep 2025 - Jun 2026",
    summary:
      "Contributed to the Paso Robles Food Co-op member portal after a two-month engineering bootcamp",
    details: [
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
    title: "Incoming Tech Lead",
    company: "CodeBox",
    location: "San Luis Obispo, CA",
    period: "Sep 2025 - Present",
    roles: [
      { title: "Incoming Tech Lead", period: "Sep 2026 - Present" },
      { title: "Software Engineer", period: "Sep 2025 - Jun 2026" },
    ],
    summary:
      "Built navigation features for Mustang Maps, a React Native campus navigation app",
    details: [
      "Implemented A* pathfinding and integrated it into the routing UI",
      "Built map layer filtering and building category matching; fixed core search and directions UX across bottom sheets and input handling",
    ],
    impact: "Used by 2K+ Cal Poly students",
    skills: [
      "react native",
      "front-end development",
      "algorithms & pathfinding",
      "typescript",
      "mobile development",
    ],
  },
];
