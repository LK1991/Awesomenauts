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