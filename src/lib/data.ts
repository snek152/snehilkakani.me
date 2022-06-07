import Adobe from '@svicons/simple-icons/adobe.svelte';
import Autodesk from '@svicons/simple-icons/autodesk.svelte';
import Blender from '@svicons/simple-icons/blender.svelte';
import Bootstrap from '@svicons/simple-icons/bootstrap.svelte';
import Canva from '@svicons/simple-icons/canva.svelte';
import Css3 from '@svicons/simple-icons/css3.svelte';
import Figma from '@svicons/simple-icons/figma.svelte';
import Firebase from '@svicons/simple-icons/firebase.svelte';
import Flask from '@svicons/simple-icons/flask.svelte';
import Git from '@svicons/simple-icons/git.svelte';
import Html5 from '@svicons/simple-icons/html5.svelte';
import Java from '@svicons/simple-icons/java.svelte';
import Javascript from '@svicons/simple-icons/javascript.svelte';
import Jquery from '@svicons/simple-icons/jquery.svelte';
import Mongodb from '@svicons/simple-icons/mongodb.svelte';
import Mysql from '@svicons/simple-icons/mysql.svelte';
import Nextdotjs from '@svicons/simple-icons/nextdotjs.svelte';
import Nodedotjs from '@svicons/simple-icons/nodedotjs.svelte';
import Python from '@svicons/simple-icons/python.svelte';
import React from '@svicons/simple-icons/react.svelte';
import Sass from '@svicons/simple-icons/sass.svelte';
import Svelte from '@svicons/simple-icons/svelte.svelte';
import Tailwindcss from '@svicons/simple-icons/tailwindcss.svelte';
import Typescript from '@svicons/simple-icons/typescript.svelte';
import Vuedotjs from '@svicons/simple-icons/vuedotjs.svelte';

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
