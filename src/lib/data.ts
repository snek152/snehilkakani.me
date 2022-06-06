import {
	Adobe,
	Autodesk,
	Blender,
	Bootstrap,
	Canva,
	Css3,
	Figma,
	Firebase,
	Flask,
	Git,
	Html5,
	Java,
	Javascript,
	Jquery,
	Mongodb,
	Mysql,
	Nextdotjs,
	Nodedotjs,
	Python,
	React,
	Sass,
	Svelte,
	Tailwindcss,
	Typescript,
	Vuedotjs
} from '@svicons/simple-icons';
import FaDrum from 'svelte-icons/fa/FaDrum.svelte';
import FaPenSquare from 'svelte-icons/fa/FaPenSquare.svelte';
import FaGuitar from 'svelte-icons/fa/FaGuitar.svelte';
import GiPianoKeys from 'svelte-icons/gi/GiPianoKeys.svelte';

export const navLinks: {
	title: string;
	href: string;
}[] = [
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
	icon: any;
};

export const codingSkills: Skill[] = [
	{
		name: 'React',
		progress: 95,
		icon: React
	},
	{
		name: 'Next.js',
		progress: 95,
		icon: Nextdotjs
	},
	{
		name: 'HTML',
		progress: 95,
		icon: Html5
	},
	{
		name: 'Git',
		progress: 90,
		icon: Git
	},
	{
		name: 'Tailwind',
		progress: 90,
		icon: Tailwindcss
	},
	{
		name: 'CSS',
		progress: 90,
		icon: Css3
	},
	{
		name: 'Svelte',
		progress: 90,
		icon: Svelte
	},
	{
		name: 'Javascript',
		progress: 90,
		icon: Javascript
	},
	{
		name: 'Typescript',
		progress: 90,
		icon: Typescript
	},
	{
		name: 'Bootstrap',
		progress: 85,
		icon: Bootstrap
	},
	{
		name: 'Firebase',
		progress: 85,
		icon: Firebase
	},
	{
		name: 'jQuery',
		progress: 80,
		icon: Jquery
	},
	{
		name: 'Python',
		progress: 80,
		icon: Python
	},
	{
		name: 'Java',
		progress: 80,
		icon: Java
	},
	{
		name: 'Node.js',
		progress: 70,
		icon: Nodedotjs
	},
	{
		name: 'Sass',
		progress: 70,
		icon: Sass
	},
	{
		name: 'Flask',
		progress: 70,
		icon: Flask
	},
	{
		name: 'Vue.js',
		progress: 50,
		icon: Vuedotjs
	},
	{
		name: 'MongoDB',
		progress: 15,
		learning: true,
		icon: Mongodb
	},
	{
		name: 'MySQL',
		progress: 15,
		learning: true,
		icon: Mysql
	}
];

export const designSkills: Skill[] = [
	{
		name: 'Canva',
		progress: 90,
		icon: Canva
	},
	{
		name: 'TinkerCAD',
		progress: 85,
		icon: Autodesk
	},
	{
		name: 'Procreate',
		progress: 80,
		icon: FaPenSquare
	},
	{
		name: 'Figma',
		progress: 70,
		icon: Figma
	},
	{
		name: 'Blender',
		progress: 15,
		learning: true,
		icon: Blender
	},
	{
		name: 'Creative Cloud',
		progress: 15,
		learning: true,
		icon: Adobe
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
