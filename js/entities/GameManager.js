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
			game.data.gold += (game.data.exp1+1);
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

		return true;
	}
});

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

game.SpendGold = Object.extend({
	init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastBuy = new Date().getTime();
		this.paused = false;
		this.alwaysUpdate = true;
	},

	update: function() {
		return true;
	}
});