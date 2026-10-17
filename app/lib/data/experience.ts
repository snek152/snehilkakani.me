export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  previously?: string;
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
    summary: "Built production infrastructure for Lindy's AI agent platform.",
    details: [
      "Lead engineer of Routines, which lets agents act on schedules and real-world events",
      "Designed it from data model to UI, then scaled it into a managed catalog with fleet-wide rollout",
      "Extended it into workspace-wide Slack agents",
    ],
    impact:
      "Shipped 400+ PRs in 10 weeks, including Routines in Lindy Teammate, the company's biggest launch to date",
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
    summary: "Built features for the Paso Robles Food Co-op member portal.",
    details: [
      "Server actions for group messaging and admin blasts, with role-based auth and Zod validation",
      "Modals with member search, owner-pinned ordering, and accessibility support",
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
    previously: "Software Engineer",
    summary:
      "Built navigation features for Mustang Maps, a React Native campus navigation app.",
    details: [
      "Implemented A* pathfinding in the routing UI",
      "Built map layer filtering and building category matching, and fixed search and directions across bottom sheets and input handling",
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
