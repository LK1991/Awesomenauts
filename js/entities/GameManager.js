// experience manager
game.ExperienceManager = Object.extend({
	init: function(x, y, settings) {
		this.alwaysUpdate = true;
		this.gameover = false;
	},

	update: function() {
		if(game.data.win === true && !this.gameover) {
			// makes function come true
			this.gameOver(true);
		}else if(game.data.win === false && !this.gameover) {
			this.gameOver(false);
		}
		console.log(game.data.exp);

		return true;
	},

	// game over if won
	gameOver: function(win) {
		if(win) {
			game.data.exp += 10;
		}else {
			game.data.exp += 1;
		}
		this.gameover = true;
		me.save.exp = game.data.exp;
	}
});