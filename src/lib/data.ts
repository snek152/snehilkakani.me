import {
	AdobeIcon,
	// AutodeskIcon,
	BlenderIcon,
	BootstrapIcon,
	CanvaIcon,
	Css3Icon,
	FigmaIcon,
	FirebaseIcon,
	FlaskIcon,
	GitIcon,
	Html5Icon,
	JavaIcon,
	JavascriptIcon,
	JqueryIcon,
	MongodbIcon,
	MysqlIcon,
	PythonIcon,
	ReactIcon,
	SassIcon,
	SvelteIcon,
	TypescriptIcon,
	InstagramIcon,
	FacebookIcon,
	LinkedinIcon,
	GithubIcon,
	GmailIcon as EmailIcon,
	PytorchIcon
} from 'svelte-simple-icons';
// import Adobe from '@svicons/simple-icons/adobe.svelte';
// import Autodesk from '@svicons/simple-icons/autodesk.svelte';
// import Blender from '@svicons/simple-icons/blender.svelte';
// import Bootstrap from '@svicons/simple-icons/bootstrap.svelte';
// import Canva from '@svicons/simple-icons/canva.svelte';
// import Css3 from '@svicons/simple-icons/css3.svelte';
// import Figma from '@svicons/simple-icons/figma.svelte';
// import Firebase from '@svicons/simple-icons/firebase.svelte';
// import Flask from '@svicons/simple-icons/flask.svelte';
// import Git from '@svicons/simple-icons/git.svelte';
// import Html5 from '@svicons/simple-icons/html5.svelte';
// import Java from '@svicons/simple-icons/java.svelte';
// import Javascript from '@svicons/simple-icons/javascript.svelte';
// import Jquery from '@svicons/simple-icons/jquery.svelte';
// import Mongodb from '@svicons/simple-icons/mongodb.svelte';
// import Mysql from '@svicons/simple-icons/mysql.svelte';
// import Nextdotjs from '@svicons/simple-icons/nextdotjs.svelte';
// import Nodedotjs from '@svicons/simple-icons/nodedotjs.svelte';
// import Python from '@svicons/simple-icons/python.svelte';
// import React from '@svicons/simple-icons/react.svelte';
// import Sass from '@svicons/simple-icons/sass.svelte';
// import Svelte from '@svicons/simple-icons/svelte.svelte';
// import Tailwindcss from '@svicons/simple-icons/tailwindcss.svelte';
// import Typescript from '@svicons/simple-icons/typescript.svelte';
// import Vuedotjs from '@svicons/simple-icons/vuedotjs.svelte';
import FaDrum from 'svelte-icons/fa/FaDrum.svelte';
import FaPenSquare from 'svelte-icons/fa/FaPenSquare.svelte';
import FaGuitar from 'svelte-icons/fa/FaGuitar.svelte';
import GiPianoKeys from 'svelte-icons/gi/GiPianoKeys.svelte';
import type { SvelteComponent } from 'svelte';

// import Instagram from '@svicons/simple-icons/instagram.svelte';
// import Facebook from '@svicons/simple-icons/facebook.svelte';
// import Linkedin from '@svicons/simple-icons/linkedin.svelte';
// import Github from '@svicons/simple-icons/github.svelte';
// import Email from '@svicons/simple-icons/gmail.svelte';

type Social = {
	icon: typeof SvelteComponent;
	href: string;
};

export const socials: Social[] = [
	{
		icon: InstagramIcon,
		href: 'https://www.instagram.com/sne.k152/'
	},
	{
		icon: FacebookIcon,
		href: 'https://www.facebook.com/snehilkakani/'
	},
	{
		icon: LinkedinIcon,
		href: 'https://linkedin.com/in/snehilkakani'
	},
	{
		icon: GithubIcon,
		href: 'https://github.com/snek152'
	},
	{
		icon: EmailIcon,
		href: 'mailto:kakanisnehil@gmail.com?body=%0A%0A%0A%0A%0A%0A%0ASent from snehilkakani.me: the official website of Snehil Kakani.'
	}
];

type NavLink = {
	title: string;
	href: string;
};

export const navLinks: NavLink[] = [
	{
		title: 'Home',
		href: '/'
	},
	{
		title: 'About',
		href: 'about'
	},
	{
		title: 'Expertise',
		href: 'expertise'
	},
	{
		title: 'Activities',
		href: 'projects'
	},
	{
		title: 'Music',
		href: '/music'
	},
	{
		title: 'Contact',
		href: 'contact'
	}
];

type Skill = {
	name: string;
	progress: number;
	icon: typeof SvelteComponent | string;
};

export const codingSkills: Skill[] = [
	{
		name: 'React',
		progress: 95,
		icon: ReactIcon
	},
	{
		name: 'Next.js',
		progress: 95,
		icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Next.js</title><path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z"/></svg>'
	},
	{
		name: 'HTML',
		progress: 95,
		icon: Html5Icon
	},
	{
		name: 'Git',
		progress: 90,
		icon: GitIcon
	},
	{
		name: 'Tailwind',
		progress: 90,
		icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Tailwind CSS</title><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/></svg>'
	},

	{
		name: 'CSS',
		progress: 90,
		icon: Css3Icon
	},
	{
		name: 'Svelte',
		progress: 90,
		icon: SvelteIcon
	},
	{
		name: 'Javascript',
		progress: 90,
		icon: JavascriptIcon
	},
	{
		name: 'Typescript',
		progress: 90,
		icon: TypescriptIcon
	},
	{
		name: 'Python',
		progress: 90,
		icon: PythonIcon
	},
	{
		name: 'Bootstrap',
		progress: 85,
		icon: BootstrapIcon
	},
	{
		name: 'Firebase',
		progress: 85,
		icon: FirebaseIcon
	},
	{
		name: 'jQuery',
		progress: 80,
		icon: JqueryIcon
	},
	{
		name: 'Java',
		progress: 80,
		icon: JavaIcon
	},
	{
		name: 'PyTorch',
		progress: 75,
		icon: PytorchIcon
	},
	{
		name: 'Node.js',
		progress: 70,
		icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Node.js</title><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/></svg>'
	},
	{
		name: 'Sass',
		progress: 70,
		icon: SassIcon
	},
	{
		name: 'Flask',
		progress: 70,
		icon: FlaskIcon
	},
	{
		name: 'Vue.js',
		progress: 70,
		icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Vue.js</title><path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/></svg>'
	},

	{
		name: 'Prisma',
		progress: 50,
		icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Prisma</title><path d="M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7541-.5023-.0293-.9523.213-1.2062.6253L2.266 15.1271c-.2773.4518-.2718 1.0091.0158 1.4555l4.3759 6.7786c.2608.4046.7127.6388 1.1823.6388.1332 0 .267-.0188.3987-.0577l12.7019-3.7568c.3891-.1151.7072-.3904.8737-.7553s.1633-.7828-.0075-1.1454zm-1.8481.7519L9.1814 22.2242c-.3292.0975-.6448-.1873-.5756-.5194l3.8501-18.4386c.072-.3448.5486-.3996.699-.0803l7.1288 15.138c.1344.2856-.019.6224-.325.7128z"/></svg>'
	},
	{
		name: 'MongoDB',
		progress: 15,
		icon: MongodbIcon
	},
	{
		name: 'MySQL',
		progress: 15,
		icon: MysqlIcon
	}
];

export const designSkills: Skill[] = [
	{
		name: 'Canva',
		progress: 90,
		icon: CanvaIcon
	},
	{
		name: 'TinkerCAD',
		progress: 85,
		icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Autodesk</title><path d="M6.898.437S7.87.534 8.26 1.505c0 0 1.069 2.526 2.04 4.955 1.42 3.33 3.22 7.615 4.67 11.078H1.167c-.778 0-1.166-.486-1.166-.486.777 1.36 3.012 5.636 3.012 5.636.388.486.777.776 1.36.776 1.264 0 3.208-1.262 3.208-1.262l7.409-4.619c1.412 3.372 2.5 5.98 2.5 5.98H24c.097-.097-9.327-22.446-9.424-22.544-.097-.097-.292-.582-.972-.582zm-.29.875c-.583 0-.778.485-.875.582L.39 14.526c-.291.874-.097 1.943 1.458 1.943h4.177l3.693-8.841A453.32 453.32 0 0 0 7.58 2.38c-.097-.291-.389-1.068-.972-1.068z"/></svg>'
	},
	{
		name: 'Procreate',
		progress: 80,
		icon: FaPenSquare
	},
	{
		name: 'Figma',
		progress: 70,
		icon: FigmaIcon
	},
	{
		name: 'Blender',
		progress: 15,
		icon: BlenderIcon
	},
	{
		name: 'Creative Cloud',
		progress: 15,
		icon: AdobeIcon
	}
];

export const musicSkills: Skill[] = [
	{
		name: 'Logic Pro',
		progress: 90,
		icon: "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/><g transform='matrix(0.45 0 0 0.45 12 12)'><path style='stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;' transform=' translate(-25, -25)' d='M 7 3 C 6.45 3 6 3.45 6 4 L 6 46 C 6 46.55 6.45 47 7 47 L 43 47 C 43.55 47 44 46.55 44 46 L 44 4 C 44 3.45 43.55 3 43 3 L 7 3 z M 25 8 C 32.18 8 38 13.82 38 21 C 38 28.18 32.18 34 25 34 C 17.82 34 12 28.18 12 21 C 12 13.82 17.82 8 25 8 z M 25 12 C 20.041282 12 16 16.041282 16 21 C 16 25.958718 20.041282 30 25 30 C 29.958718 30 34 25.958718 34 21 C 34 16.041282 29.958718 12 25 12 z M 25 14 C 28.877838 14 32 17.122162 32 21 C 32 24.877838 28.877838 28 25 28 C 21.122162 28 18 24.877838 18 21 C 18 17.122162 21.122162 14 25 14 z M 25 19 C 23.895430500338414 19 23 19.895430500338414 23 21 C 23 22.104569499661586 23.895430500338414 23 25 23 C 26.104569499661586 23 27 22.104569499661586 27 21 C 27 19.895430500338414 26.104569499661586 19 25 19 z M 18 38 L 32 38 C 32.55 38 33 38.45 33 39 L 33 42 C 33 42.55 32.55 43 32 43 L 18 43 C 17.45 43 17 42.55 17 42 L 17 39 C 17 38.45 17.45 38 18 38 z' stroke-linecap='round' /></g></svg>"
	},
	{
		name: 'Drums',
		progress: 70,
		icon: FaDrum
	},
	{
		name: 'GarageBand',
		progress: 75,
		icon: FaGuitar
	},
	{
		name: 'Piano',
		progress: 50,
		icon: GiPianoKeys
	}
];

type Testimonial = {
	testimonial: string;
	name: string;
};

export const testimonials: Testimonial[] = [
	{
		testimonial:
			"I've known Snehil for quite a while now, and he is very *self-driven* and someone who will *consistently follow through on his word*.  For the past year or so, he has helped me create the webpage for STEMist, dedicating hours each week to fixing bugs and improving the site.  His web development skills have made creating the webpage so much easier, because *I can rely on him* instead of some wacky online website builder.  He transformed the website from a weebly page to what it is today, implementing design requests as soon as I pointed out some error.  *It's been great working with Snehil* both as a friend and as a teamate!",
		name: 'Steve Yang, Co-Founder and President of STEMist Education'
	},
	{
		testimonial:
			'I highly recommend Snehil Kakani as a website developer and designer. He has done an *outstanding job* designing the website for the nonprofit organization Care for our Common Home Foundation from scratch, *capturing my vision perfectly* and with an attention to detail that has resulted in a website that *exceeds my expectations*. Snehil is *reliable, communicative, and a pleasure to work with*. I am delighted with his work and I would not hesitate to collaborate with him again in the future.',
		name: 'Eleanor Koo, Founder of CFOCH Foundation'
	},
	{
		testimonial:
			'Snehil is one of the best people - not just the best developer, not just the best graphic designer - but the *most fulfilling and giving person you will ever meet*. When I first started working with Snehil, I could see his ability in *picking skills up quickly* and his humbleness in asking for help whenever needed. Snehil is down-to-earth and will *never let you down on a promise and yet push you to be better*. If you need a web developer or a friend, Snehil is the man.',
		name: 'Anish Lakkapragada, President of Lynbrook Web Development Club'
	}
];

type Project = {
	image: string;
	title: string;
	description: string;
	url: string;
	buttonText: string;
	type: 'cs' | 'design' | 'music' | 'drama' | ('cs' | 'design' | 'music' | 'drama')[];
	chips?: string[];
};

export const professionalProjects: Omit<Project, 'type'>[] = [
	{
		title: 'Director of Technology and CS Instructor - STEMist Education',
		description: `At STEMist, I led the creation and development of the organization website, worked on additional projects like hackathons and upcoming events, led a team of developers in various side projects such as a Discord bot and student portal, interviewed candidates for the tech team and training new hires, and developed lesson material for students learning web development, earning a gold PVSA for my work.`,
		image: '/images/stemist.webp',
		url: 'https://joinstemist.org',
		buttonText: 'check it out',
		chips: ['React', 'Next.js', 'Tailwind', 'Typescript']
	},
	{
		title: 'Website Developer and Designer - Care for our Common Home',
		description:
			'As a freelance web developer hired by CFOCH, I redesigned and developed the organization website from scratch, and incorporated blog features and donations, earning a gold PVSA for my work.',
		image: '/images/cfoch.webp',
		url: 'https://cfoch.org',
		buttonText: 'check it out',
		chips: ['React', 'Next.js', 'Tailwind', 'Figma', 'Typescript']
	},
	{
		title:
			'GU-Net: Novel Architecture for Brain Tumor Segmentation - Research conducted at UCSB SRA',
		image: '/images/sra.webp',
		description:
			'GU-Net is a novel and simplified version of prior architectures, built to solve the problem of segmenting diffuse gliomas, which are a prevalent type of brain tumor in adults, and intended to be used in underprivileged areas and hospitals with less funding. Using an incredibly small subset of the dataset provided and using limited computations, GU-Net achieved a 71.58% accuracy. My gorup members and I conducted and presented this research at UCSB.',
		url: '',
		buttonText: '',
		chips: ['Python', 'Pytorch', 'Machine Learning']
	}
	// club officer positions, SRA
];

export const projects: Project[] = [
	{
		title: 'Laughing Stock',
		type: 'drama',
		image: '/images/laughingstock.webp',
		description:
			'Returning to the stage as an actor in Laughing Stock, as the character Tyler, was unforgettable. The contrast between comedy and seriousness in this play created a memorable and educative actor experience for me. I spent many hours in rehearsals, fine-tuning my character, and I was able to develop him significantly. I was also the head of sound once again, and applied all of the lessons I learned from the Laramie Project to this show, in conjunction with training a new sound team to run the show since I was going to be on stage. As I was playing two key roles in this production, it was a great challenge, but nevertheless one I was able to overcome.',
		url: 'https://youtu.be/7erYKVXOw6A?si=Y-C9FoFglhhm9xfR',
		buttonText: 'watch the recording'
	},
	{
		title: 'Lynbrook Improv Team',
		type: 'drama',
		image: '/images/improv.webp',
		description:
			'As a member of the improv team in sophomore year, the vice-captain in junior year, and co-captain in senior year, I have been able to learn a lot about improvisational acting and comedy, and have performed in front of an audience in multiple shows. I have learned how to think on my feet and create a story on the spot, and I came up with new games and ideas for the show, guided rehearsals, and mentored new members.',
		url: '',
		buttonText: ''
	},
	{
		title: 'The Laramie Project',
		type: 'drama',
		image: '/images/laramie.webp',
		description:
			'I took on the challenge of being the head of sound for The Laramie Project, a show that was very complex in terms of sound design and sound effects. A problem we faced was that our hardware was taken by the school contractors only a few weeks before the show, which meant we had to wait to practice with it. Additionally, this was the first time I had worked on sound design, and due to a lack of foresight I left it until two weeks before the show, but I was able to quickly fix my mistake and put in more time to complete it fast enough. In the end, I was able to once again create a seamless audio experience for the audience, learned about sound design, and am ready to mentor new sound team members in the future.',
		url: '',
		buttonText: ''
	},
	{
		title: 'Ranked, the Musical',
		type: 'drama',
		image: '/images/ranked.webp',
		description:
			"Ranked was my first production as a member of the sound team, and under the instruction of my friend and the head of sound, I was able to quickly pick up the skills needed to set up the mic hardware and operate the soundboard for the show. Using my audio engineering experience to mix all the actors together and adjust and compress individual frequencies of their voice, I was able to create a seamless and professional audio experience for the audience. The show also brought more attention to the theatre department, which hadn't been recognized in such a way since the pandemic, and I'm glad I got to help with that.",
		url: 'https://youtu.be/LKQmaYzCqIk',
		buttonText: 'watch the recording'
	},
	{
		title: 'The Lion in Winter',
		type: 'drama',
		image: '/images/lion.webp',
		description:
			'In my only production of sophomore year, I took on the lead role of The Lion in Winter as King Henry II. Although the cast and show were relatively smaller than the last show, we put in several hours every day to rehearse, memorize our lines, and become our characters over the course of multiple months. The show was a great success, and I was able to learn a lot about acting and performing in a lead role.',
		url: 'https://youtu.be/Q5i8JM3NRQQ',
		buttonText: 'watch the recording'
	},
	{
		title: 'Romeo and Juliet',
		type: 'drama',
		image: '/images/romeojuliet2122.webp',
		description:
			'In my first major production, I initially started out unsure of what to expect in my role as Paris and the outdoor quad setting of the production as opposed to a show in the theater. Along with difficulties with facing two sides of the audience at the same time, there were numerous technical challenges. The memorization and acting were also difficult because the play was Shakespearean, but after many months of stage blocking, learning stage combat, characterization, and line memorization, I was able to perform the show successfully.',
		url: 'https://youtu.be/ngWYAiN_Yh8',
		buttonText: 'watch the recording'
	},
	{
		title: 'JS Barrels - A CLI for Generating Javascript and Typescript Barrels',
		description:
			'JS-Barrels is a CLI to create barrel files, or files that re-export all the files in a directory, for Javascript and Typescript projects.',
		image: '/images/jsbarrels.webp',
		url: 'https://github.com/snek152/js-barrels',
		type: 'cs',
		buttonText: 'view on github',
		chips: ['Typescript', 'Node.js']
	},
	{
		title: 'Next.js Utilities - A Collection of Utilities for Next.js Projects',
		description:
			'Nextjs-utilities is a collection of helpers and utilities to simplify the Next.js developer experience in large and small scale projects alike.',
		image: '/images/nextjsutils.webp',
		url: 'https://github.com/snek152/nextjs-utilities',
		type: 'cs',
		buttonText: 'view on github',
		chips: ['Typescript', 'Next.js']
	},
	{
		title: 'Typescript Library Template - A Template for Creating Typescript Libraries with Ease',
		description:
			'TS-lib-template is an extremely powerful, batteries-included template for creating Typescript libraries with ease, including many utilities out of the box.',
		image: '/images/tslibtemplate.webp',
		url: 'https://github.com/snek152/ts-lib-template',
		type: 'cs',
		buttonText: 'view on github',
		chips: ['Typescript', 'Github Actions', 'Node.js']
	},
	{
		title: 'Drum Performance 2021',
		description:
			'As part of my annual drum live performance, I performed "Riff Raff" by AC/DC on my drumset with an audience of 100+.',
		image: '/images/riffraff.webp',
		url: 'https://youtu.be/y9Et4WJt7hs',
		buttonText: 'watch now',
		type: 'music'
	},
	{
		title: 'STEAM Force - Accessible and Interactive Education Platform',
		description:
			'As my Synopsys project in 2022 (winning an Honorable Mention in Physical Science and Engineering), the STEAM Force is a fast education platform optimized for third world countries.',
		image: '/images/steamforce.webp',
		url: 'https://steamforce.snehilkakani.me',
		buttonText: 'check it out',
		type: 'cs',
		chips: ['React', 'Next.js', 'Firebase', 'Typescript']
	},
	// {
	// 	title: "Check Please Valentine's Day Show 2022 - LHS Studio 74",
	// 	type: 'drama',
	// 	image: '/images/checkplease.webp',
	// 	description:
	// 		"In Lynbrook High School Studio 74's Valentine's Day show, I was cast as the young Tod in the play Check Please, which was performed in February 2022.",
	// 	url: 'https://www.playscripts.com/play/202',
	// 	buttonText: 'view on playscript'
	// },
	{
		title: 'Sword Selection - A Minecraft Mod',
		type: 'cs',
		image: '/images/swordselection.webp',
		description:
			'My first mod for Minecraft with over 1.5k downloads, Sword Selection is a mod that adds all kinds of swords to the game such as daggers, longswords, sickles, and more!',
		url: 'https://swordselection.snehilkakani.me',
		buttonText: 'learn more',
		chips: ['Java', 'Minecraft Forge', 'Gradle']
	},
	{
		title: 'Georepair - An Open-Source Project',
		description:
			"As YoungWonks's 2021 Summer Open Source Project, GeoRepair is a geotagging web application and mobile app allowing users to scan broken public-owned objects.",
		chips: ['Bootstrap', 'Vue.js', 'Flask'],
		image: '/images/georepair.webp',
		url: 'https://github.com/youngwonks/ywsos2021_web',
		type: 'cs',
		buttonText: 'learn more'
	},
	{
		title: 'Drum Recording 2021',
		description:
			'As part of my annual drum showcase, I played "Whistle" by Flo Rida on my drumset.',
		image: '/images/drums2021.webp',
		url: 'https://youtu.be/oCek4xPO3yw',
		buttonText: 'watch now',
		type: 'music'
	},
	{
		title: 'YEI - Econ Concepts and Instagram Posts',
		type: 'design',
		image: '/images/econconcepts.webp',
		description:
			'As part of the YEI, I designed many econ concept posts for Instagram, as well as various stories and announcements.',
		url: 'https://drive.google.com/drive/folders/1p9jnuJM7ywy8azSGWwqjG6bF8lpHrp2B?usp=sharing',
		buttonText: 'view on drive'
	}
];

export type Beat = {
	title: string;
	file: string;
	primary?: boolean;
	image?: string;
};

export const beats: Beat[] = [
	// { title: 'a', file: '/beats/a_soup.mp3' },
	{ title: 'alien trap', file: '/beats/alien_trap.mp3' },
	// { title: 'alien trap 2', file: '/beats/alien_trap_2.mp3' },
	{ title: 'alone', file: '/beats/alone.mp3' },
	{ title: 'apocalypse', file: '/beats/apocalypse.mp3' },
	{ title: 'boat', file: '/beats/boat.mp3' },
	{ title: 'boat 2', file: '/beats/boat_2.mp3' },
	{ title: 'boat 3', file: '/beats/boat_3.mp3', primary: true, image: '/images/boat.jpg' },
	{ title: 'bollybeat', file: '/beats/bollybeat.mp3' },
	{ title: 'sea', file: '/beats/c_soup.mp3' },
	{ title: 'comedy', file: '/beats/comedy_crazy.mp3' },
	{ title: 'monster', file: '/beats/cringe_beat.mp3' },
	{ title: 'danger', file: '/beats/danger.mp3' },
	{ title: 'deserted', file: '/beats/deserted.mp3' },
	{ title: 'drama', file: '/beats/drama.mp3' },
	{ title: 'drifting', file: '/beats/drifting.mp3' },
	// { title: 'e', file: '/beats/e.mp3' },
	{
		title: 'game over',
		file: '/beats/game_over.mp3',
		primary: true,
		image: '/images/gameover.jpg'
	},
	{ title: 'hell', file: '/beats/hell.mp3', primary: true, image: '/images/hell.jpg' },
	{ title: 'hero', file: '/beats/hero.mp3' },
	{ title: 'in my mind', file: '/beats/in_my_mind.mp3' },
	{ title: 'king', file: '/beats/king.mp3' },
	{ title: 'lonely', file: '/beats/lonely.mp3' },
	{ title: 'melodrama', file: '/beats/melodrama.mp3' },
	{ title: 'memories', file: '/beats/memories.mp3' },
	{ title: 'music box', file: '/beats/music_box.mp3' },
	{ title: 'operator', file: '/beats/operator.mp3' },
	{ title: 'rain falling', file: '/beats/rain_falling.mp3' },
	{ title: 'shut the front door', file: '/beats/shut_the_front_door.mp3' },
	{ title: 'static', file: '/beats/static.mp3', primary: true, image: '/images/static.jpg' },
	{ title: 'stranded', file: '/beats/stranded.mp3' },
	{ title: 'sunken', file: '/beats/sunken.mp3' },
	{ title: 'sunset', file: '/beats/sunset.mp3' },
	{ title: 'thunder', file: '/beats/thunder.mp3', primary: true, image: '/images/thunder.jpg' },
	{
		title: 'vengeance',
		file: '/beats/vengeance.mp3',
		primary: true,
		image: '/images/vengeance.jpg'
	},
	{ title: 'vengeance 2', file: '/beats/vengeance_2.mp3' },
	{ title: 'vengeance 3', file: '/beats/vengeance_3.mp3' },
	{ title: 'zombie', file: '/beats/zombie_2.mp3' }
];
