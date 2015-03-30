game.HeroDeathManager = Object.extend({
	init: function(x, y, settings) {
		this.alwaysUpdate = true;

	},

	update: function() {
		if(game.data.player.dead) {
			// removes player getting attacked by the creep
			me.game.world.removeChild(game.data.player);
			// respawns the player
			me.state.current().resetPlayer(10, 0);
		}

		return true;
	}
});
