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

type Project = {
	image: string;
	title: string;
	description: string;
	url: string;
	buttonText: string;
	type: 'cs' | 'design' | 'music' | 'drama';
	chips?: string[];
};

export const projects: Project[] = [
	{
		title: 'Beat Box - Music Album',
		description:
			'One of my first albums produced with GarageBand, this was my first step towards developing DJ skills.',
		image: '/images/beatbox.webp',
		url: 'https://soundcloud.com/snek152/sets/beat-box',
		buttonText: 'listen on soundcloud',
		type: 'music'
	},
	{
		title: 'Beat Box - Music Album',
		description:
			'One of my first albums produced with GarageBand, this was my first step towards developing DJ skills.',
		image: '/images/beatbox.webp',
		url: 'https://soundcloud.com/snek152/sets/beat-box',
		buttonText: 'listen on soundcloud',
		type: 'music'
	},
	{
		title: 'Beat Box - Music Album',
		description:
			'One of my first albums produced with GarageBand, this was my first step towards developing DJ skills.',
		image: '/images/beatbox.webp',
		url: 'https://soundcloud.com/snek152/sets/beat-box',
		buttonText: 'listen on soundcloud',
		type: 'music'
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
		title: 'Director of Technology - STEMist Education',
		description:
			'As Director of Technology at STEMist, I designed and constructed the website using React, Next.js, and Tailwind working with my subordinates, as well as leading several other tech projects.',
		image: '/images/stemist.webp',
		type: 'cs',
		url: 'https://joinstemist.org',
		buttonText: 'check it out',
		chips: ['React', 'Next.js', 'Tailwind']
	}
];
