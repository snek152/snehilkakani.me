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
      "Led development of numerous club projects and taught variety of software-related topics weekly to 50+ members",
      "Expanded club to include passion project development, fostering creativity and technical skill growth",
      "Organized workshops, hackathons, and collaborative coding sessions to enhance member engagement",
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
      "Took phone and in-person orders and served pizza for 500+ customers per week, ensuring high-quality service",
      "Led shifts and coordinated team members to maintain efficient restaurant operations during peak hours",
      "Managed cleanup tasks, inventory, and resolved customer issues professionally across all areas of the business",
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
      "Developed and delivered tailored web solutions for organizations including EuclidLearn and Care for Our Common Home",
      "Provided professional and pro bono contributions, creating responsive, modern websites with optimal user experience",
      "Collaborated with clients to understand requirements and delivered projects on time with ongoing maintenance support",
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
      "Created organization website from scratch and led a team of developers to implement new features and improvements",
      "Taught comprehensive CS curriculum to students, covering programming fundamentals and web development concepts",
      "Mentored students in coding projects and provided guidance on best practices in software development",
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
