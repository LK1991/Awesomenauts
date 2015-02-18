game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
		// loads level 1 
		me.levelDirector.loadLevel("level01");

		this.resetPlayer(0, 420);

		var gamemanager = me.pool.pull("GameManager", 0, 0, {});
		me.game.world.addChild(gamemanager, 0);

		// moving player right by hitting the right key
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		// moving player left by hitting the left key
		me.input.bindKey(me.input.KEY.LEFT, "left");
		// making the player jump by hitting the space key
		me.input.bindKey(me.input.KEY.SPACE, "jump");
		// making the creep jump by hitting the up key 
		me.input.bindKey(me.input.KEY.UP, "jump1");
		// making player attack by hitting the A key
		me.input.bindKey(me.input.KEY.A, "attack");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},

	resetPlayer: function(x, y) {
		// creates the player
		game.data.player = me.pool.pull("player", x, y, {});
		// adds the player to the map
		me.game.world.addChild(game.data.player, 5);
	}
});
