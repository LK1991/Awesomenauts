game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */
	// inserting images so it can show when i run the page 
	{name: "background-tiles", type:"image", src: "data/img/background-tiles.png"},
	{name: "meta-tiles", type:"image", src: "data/img/meta-tiles.png"},
	{name: "player", type:"image", src: "data/img/orcSpear.png"},
	{name: "tower", type:"image", src: "data/img/tower_round.svg.png"},
	{name: "creep1", type:"image", src: "data/img/brainmonster.png"},
	{name: "title-screen", type:"image", src: "data/img/title.png"},
	{name: "gold-screen", type:"image", src: "data/img/spend.png"},
	{name: "exp-screen", type:"image", src: "data/img/loadpic.png"},
	{name: "load-screen", type:"image", src: "data/img/loadpic.png"},
	{name: "new-screen", type:"image", src: "data/img/newpic.png"},

	// intermediate /*{name: "playercreep", type:"image", src: "data/img/gloop.png"},*/

	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */
 	// inserting the map so it can show when i run the page
 	{name: "level01", type: "tmx", src: "data/map/test.tmx"},

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/"},
	 */	
	{name: "game over-fir", type: "audio", src: "data/bgm/"},
	{name: "sidescroller-j", type: "audio", src: "data/bgm/"},
	{name: "venom love-j", type: "audio", src: "data/bgm/"},

	/* Sound effects. 
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/"}
	 */
	{name: "jumping_teon", type: "audio", src: "data/sfx/"},
];
