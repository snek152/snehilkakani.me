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
	GmailIcon as EmailIcon
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
		title: 'Projects',
		href: 'projects'
	},
	{
		title: 'Contact',
		href: 'contact'
	}
];

type Skill = {
	name: string;
	progress: number;
	learning?: boolean;
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
		name: 'Python',
		progress: 80,
		icon: PythonIcon
	},
	{
		name: 'Java',
		progress: 80,
		icon: JavaIcon
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
		progress: 50,
		icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Vue.js</title><path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"/></svg>'
	},
	{
		name: 'MongoDB',
		progress: 15,
		learning: true,
		icon: MongodbIcon
	},
	{
		name: 'MySQL',
		progress: 15,
		learning: true,
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
		learning: true,
		icon: BlenderIcon
	},
	{
		name: 'Creative Cloud',
		progress: 15,
		learning: true,
		icon: AdobeIcon
	}
];

export const musicSkills: Skill[] = [
	{
		name: 'Drums',
		progress: 85,
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
			"I've known Snehil for quite a while now, and he is very self-driven and someone who will consistently follow through on his word.  For the past year or so, he has helped me create the webpage for STEMist, dedicating hours each week to fixing bugs and improving the site.  His web development skills have made creating the webpage so much easier, because I can rely on him instead of some wacky online website builder.  He transformed the website from a weebly page to what it is today, implementing design requests as soon as I pointed out some error.  It's been great working with Snehil both as a friend and as a teamate!",
		name: 'Steve Yang, Founder and CEO of STEMist Education'
	},
	{
		testimonial:
			'I highly recommend Snehil Kakani as a website developer and designer. He has done an outstanding job designing the website for the nonprofit organization Care for our Common Home Foundation from scratch, capturing my vision perfectly and with an attention to detail that has resulted in a website that exceeds my expectations. Snehil is reliable, communicative, and a pleasure to work with. I am delighted with his work and I would not hesitate to collaborate with him again in the future.',
		name: 'Eleanor Koo, Founder and CEO of CFOCH Foundation'
	},
	{
		testimonial:
			'Snehil is one of the best people - not just the best developer, not just the best graphic designer - but the most fulfilling and giving person you will ever meet. When I first started working with Snehil, I could see his ability in picking skills up quickly and his humbleness in asking for help whenever needed. Snehil is down-to-earth and will never let you down on a promise and yet push you to be better. If you need a web developer or a friend, Snehil is the man.',
		name: 'Anish Lakkapragada, Vice President of Lynbrook Web Dev Club'
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
		title: 'Director of Technology - STEMist Education',
		description:
			'As Director of Technology at STEMist, I designed and constructed the website using React, Next.js, and Tailwind working with my subordinates, as well as leading several other tech projects.',
		image: '/images/stemist.webp',
		url: 'https://joinstemist.org',
		buttonText: 'check it out',
		chips: ['React', 'Next.js', 'Tailwind', 'Typescript']
	},
	{
		title: 'Website Developer and Designer - Care for our Common Home',
		description:
			'As a freelance web developer for CFOCH, my responsibility was to design and build a new website for their organization from scratch.',
		image: '/images/cfoch.webp',
		url: 'https://cfoch.org',
		buttonText: 'check it out',
		chips: ['React', 'Next.js', 'Tailwind', 'Figma', 'Typescript']
	},
	{
		title: 'Beat Box - Music Album',
		description:
			'My first album, produced entirely by me, is an amalgamation of my musical interests and inspirations. It is a collection of nine songs, each with a different genre and style.',
		image: '/images/beatbox.webp',
		url: 'https://soundcloud.com/snek152/sets/beat-box',
		buttonText: 'listen on soundcloud'
	}
];

export const projects: Project[] = [
	{
		title: 'Romeo and Juliet Spring Outdoor Show 2022 - LHS Studio 74',
		type: 'drama',
		image: '/images/romeojuliet2122.webp',
		description:
			"In Lynbrook High School Studio 74's Spring Outdoor show, I was cast as the County Paris in the play Romeo and Juliet, performing through May 2022.",
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
		url: 'https://drive.google.com/file/d/1AFItfeM42BsmTmQjFmsahRxzP16SVbEh/view?usp=sharing',
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
	{
		title: "Check Please Valentine's Day Show 2022 - LHS Studio 74",
		type: 'drama',
		image: '/images/checkplease.webp',
		description:
			"In Lynbrook High School Studio 74's Valentine's Day show, I was cast as the young Tod in the play Check Please, which was performed in February 2022.",
		url: 'https://www.playscripts.com/play/202',
		buttonText: 'view on playscript'
	},
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
	},
	{
		title: 'React Web Calculator',
		type: 'cs',
		image: '/images/calculator.webp',
		chips: ['React', 'Tailwind'],
		description:
			'Using React and Tailwind, I built a simple basic and scientific calculator for the web, optimized as a PWA.',
		url: 'https://calculator.snehilkakani.me',
		buttonText: 'check it out'
	},
	{
		title: 'Dook - An Opportunity App',
		description:
			"As part of Elevate the Future's Project Falcon, myself and other web developers created a website for Dook to promote their platform.",
		buttonText: 'check it out',
		image: '/images/dook.webp',
		url: 'https://dookapp.com',
		type: 'cs',
		chips: ['Bootstrap']
	},
	{
		title: 'Music Album Covers',
		description:
			'Using Canva, I designed a multidude of album covers for each song in my album Beat Box as if it were a single.',
		url: 'https://drive.google.com/drive/folders/19Uw374XJPUG6UCvEFpKNgzGgS0rzwi6G?usp=sharing',
		buttonText: 'view on drive',
		image: '/images/albumcovers.webp',
		type: 'design'
	}
];
