// the timer for the creep
game.GameTimerManager = Object.extend({
	init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();
		this.paused = false;
		this.alwaysUpdate = true;
	},

	update: function() {
		this.now = new Date().getTime();
		// linking to the functions
		this.goldTimerCheck();
		this.creepTimerCheck();

		return true;
	},

	// refactoring gold timer
	goldTimerCheck: function() {
		// and another creep that respawns
		if(Math.round(this.now/1000)%20 === 0 && (this.now - this.lastCreep >= 1000)) {
			game.data.gold += 1;
			console.log("Current gold: " + game.data.gold);
		}
	},
	// refactoring creep timer
	creepTimerCheck: function() {
		// a creep that respawns
		if(Math.round(this.now/1000)%10 === 0 && (this.now - this.lastCreep >= 1000)) {
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
		}
	}
});

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
	}
});
