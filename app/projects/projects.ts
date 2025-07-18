export type Project = {
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    skills: string[];
    slug: string;
    link?: string;
}

export const projects: Project[] = [
    {
        link: "https://lhsdevx.vercel.app/",
        title: "President & Officer @ Lynbrook Web Development Club/DevX Club",
        slug: "lynbrook-wdc",
        subtitle: "May 2022 - June 2025",
        description: "Directed club projects like ProCo and Tonz. Collaborated on websites for Lynbrook ML Club and Athletes4Others. Presented technical slides and expanded the club's agenda to include passion projects, broadening member engagement.",
        image: "webdev.png",
        skills: ["leadership & communication", "full-stack web development", "community engagement"],
    },
    {
        title: "Freelance Web Consultant",
        slug: "freelance-web",
        subtitle: "June 2021 - Present",
        description: "Designed and deployed custom websites and web applications for clients, emphasizing user experience and performance. Recognized with a gold PVSA and earned over $1K for client projects.",
        image: "freelance.jpeg",
        skills: ["client collaboration", "custom web solutions", "user experience design"],
    },
    {
        title: "GU-Net: Diffuse Glioma Segmentation Research",
        slug: "gu-net-glioma",
        subtitle: "Summer 2023",
        description: "Developed GU-Net for segmenting gliomas with limited data, achieving 71.58% accuracy. Presented research at UCSB and published findings in JSR.",
        link: "https://www.jsr.org/hs/index.php/path/article/view/6376",
        image: "sra.jpg",
        skills: ["machine learning", "medical imaging", "research & presentation"],
    },
    {
        title: "Director of Technology & CS Instructor @ STEMist Education",
        slug: "stemist-edu",
        subtitle: "January 2022 - January 2023",
        description: "Led the development of the STEMist Education website. Managed a developer team on projects including a Discord bot and student portal. Organized hackathons, trained new tech team members, and created lesson materials for web development and computer science. Awarded a gold PVSA for exceptional community service.",
        image: "stemist.jpg",
        skills: ["team leadership & project management", "web development", "curriculum design", "community service"],
    },
    {
        title: "Synopsys Science Fair Two Time Participant",
        slug: "synopsys-eng",
        subtitle: "2022 & 2023",
        description: "Showcased projects on neural network-based flood detection using novel algorithms and a full-stack web application for accessible STEAM education for underprivileged youth. Awarded Honorable Mention for physical science and engineering.",
        image: "synopsys.jpg",
        skills: ["machine learning", "full-stack web development", "engineering constraint design", "project presentation"],
    }
]
