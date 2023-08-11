const songs: string[] = [
	'/songs/boat_ffart.mp3',
	'/songs/e_ffart.mp3',
	'/songs/king_ffart.mp3',
	'/songs/memories_raja.mp3',
	'/songs/operator_ffart.mp3',
	'/songs/sea_poisonpati.mp3',
	'/songs/static_ffart.mp3',
	'/songs/sunken_ffart.mp3',
	'/songs/sunset_collab.mp3',
	'/songs/thunder_ffart.mp3',
	'/songs/ttlh_cypher.mp3',
	'/songs/zombie_2_ffart.mp3',
	'/songs/zombie_ffart.mp3'
];

const finalSongs: {
	title: string;
	file: string;
}[] = [];

songs.forEach((song) => {
	const title = song.split('.')[0].split('/').pop();
	finalSongs.push({
		title: title ? title : 'Unknown',
		file: song
	});
});

export default finalSongs;
