// creating a player entity
game.PlayerEntity = me.Entity.extend({
	// choosing one playerBU out of all the others
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "player", 
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function() {
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);
		this.type = "PlayerEntity";
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		// Keeps track of which direction the character is going 
		this.facing = "right";
		this.now = new Date().getTime();
		this.lastHit = this.now; //	the last hit makes the tower lose health and fire up
		this.dead = false;
		this.lastAttack = new Date().getTime(); // Haven't used this
		// following the player and moving the screen 
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);


		// adding new animations
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		this.now = new Date().getTime();

		if (this.health <= 0) {
			this.dead = true;
		}

		if(me.input.isKeyPressed("right")) {
			// adds to the position of my x by the velocity defined above in 
			// setVelocity() and multiplying it by me.timer.tick.
			// me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			// Keeps track of which direction the character is going 
			this.facing = "right";
			// makes the player flip
			this.flipX(true);
		}else if(me.input.isKeyPressed("left")){
			// Keeps track of which direction the character is going 
			this.facing = "left";
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.flipX(false);
		}else {
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
			this.body.jumping = true;
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}

		if(me.input.isKeyPressed("attack")) {
			if(!this.renderable.isCurrentAnimation("attack")) {
				console.log(!this.renderable.isCurrentAnimation("attack"));
				// sets the current animation to attack and once that is over
				// goes back to the idle animation 
				this.renderable.setCurrentAnimation("attack",  "idle");
				// makes it so that the next time we start this sequence we begin
				// from the first animation, not wherever we left off when we
				// switched to another animation 
				this.renderable.setAnimationFrame();
			}
		}
		// makes it walk when you're pressing the keys to move and makes it stop walking when you don't press the keys
		else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
			if(!this.renderable.isCurrentAnimation("walk")) {
				this.renderable.setCurrentAnimation("walk");
			}
		}else if(!this.renderable.isCurrentAnimation("attack")){
			this.renderable.setCurrentAnimation("idle");
		}

		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
		console.log(this.health);
	},

	// doesn't let you collide with the EnemyBaseEntity
	collideHandler: function(response) {
		if(response.b.type==='EnemyBaseEntity') {
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;

			// this is making the character not collide from the top
			if(ydif<-40 && xdif< 70 && xdif>-35) {
				this.body.falling = false;
				this.body.vel.y = -1;
			}
			// this lets you move away from EnemyBaseEntity
			else if(xdif>-35 && this.facing==='right' && (xdif<0)) {
				this.body.vel.x = 0;
				// this.pos.x = this.pos.x -1;
			}
			// this lets you move away from EnemyBaseEntity
			else if(xdif<70 && this.facing==='left' && xdif>0){
				this.body.vel.x = 0;
				// this.pos.x = this.pos.x +1;
			}

			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer) {
				console.log("tower Hit"); // logs in when i hit the tower
				this.lastHit = this.now; //	the last hit makes the tower lose health and fire up
				response.b.loseHealth(game.data.playerAttack);
			}
		}else if(response.b.type==='EnemyCreep') {
				var xdif = this.pos.x - response.b.pos.x;
				var ydif = this.pos.y - response.b.pos.y;

				// lets creep get hit by any side
				if(xdif>0) {
					// this.pos.x = this.pos.x + 1;
					if(this.facing==="left") {
						this.body.vel.x = 0;
					}
				}else {
					// this.pos.x = this.pos.x - 1;
					if(this.facing==="right") {
						this.body.vel.x = 0;
					}
				}
				// if the player hits the creep 5, times it dies and disappear
				if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
					&& (Math.abs(ydif) <=40) && 
					(((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
					){
					this.lastHit = this.now;
					response.b.loseHealth(game.data.playerAttack);
				}
			}
		}
});

// i tried adding a creep on the player team, intermediate 
/*game.PlayerCreep = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "player", 
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function() {
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);
		this.type = "PlayerCreep";
		this.health = game.data.playerCreepHealth;
		this.facing = "right";
		this.now = new Date().getTime();
		this.lastHit = this.now;

		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		this.renderable.setCurrentAnimation("idle");

		update: function(delta) {
			this.now = new Date().getTime();

			if (this.health >= 0) {
				this.dead = true;
				this.pos.x = 10;
				this.pos.y = 0;
				this.health = game.data.playerCreepHealth;
			}

			if(me.input.isKeyPressed("right")) {
				// adds to the position of my x by the velocity defined above in 
				// setVelocity() and multiplying it by me.timer.tick.
				// me.timer.tick makes the movement look smooth
				this.body.vel.x += this.body.accel.x * me.timer.tick;
				// Keeps track of which direction the character is going 
				this.facing = "right";
				// makes the player flip
				this.flipX(true);
			}else {
				this.body.vel.x = 0;
			}

			if(me.input.isKeyPressed("attack")) {
				if(!this.renderable.isCurrentAnimation("attack")) {
					console.log(!this.renderable.isCurrentAnimation("attack"));
					// sets the current animation to attack and once that is over
					// goes back to the idle animation 
					this.renderable.setCurrentAnimation("attack",  "idle");
					// makes it so that the next time we start this sequence we begin
					// from the first animation, not wherever we left off when we
					// switched to another animation 
					this.renderable.setAnimationFrame();
				}
			}
			// makes it walk when you're pressing the keys to move and makes it stop walking when you don't press the keys
			else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
				if(!this.renderable.isCurrentAnimation("walk")) {
					this.renderable.setCurrentAnimation("walk");
				}
			}else if(!this.renderable.isCurrentAnimation("attack")){
				this.renderable.setCurrentAnimation("idle");
			}

			this._super(me.Entity, "update", [delta]);
			return true;
		}
});*/

// creating the player base entity
game.PlayerBaseEntity = me.Entity.extend({
	// choosing one player base out of all the others
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function() {
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = game.data.playerBaseHealth;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		this.type = "PlayerBase";

		// no fire animation on the bases
		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},

	update:function(delta) {
		if(this.health<=0) {
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},	

	loseHealth: function(damage) {
		this.health = this.health - damage;
	},

	onCollision: function() {

	}
});

// creating the enemy base entity
game.EnemyBaseEntity = me.Entity.extend({
	// choosing one enemy base out of all the others
	init : function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function() {
				return 	(new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = game.data.enemyBaseHealth;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "EnemyBaseEntity";

		// no fire animation on the bases
		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},

	update:function(delta) {
		if(this.health<=0) {
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);


		return true;
	},	

	onCollision: function() {
		
	},

	loseHealth: function() {
		this.health--;
	}
});

// creating the creep entity
game.EnemyCreep = me.Entity.extend({
	// choosing one creep out of all the other ones 
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "creep1",
			width: 32,
			height: 64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function() {
				return (new me.Rect(0, 0, 32, 64)).toPolygon();
			}
		}]);	
		this.health = game.data.enemyCreepHealth;
		this.alwaysUpdate = true;
		// this.attacking lets us know if the enemy is currently attacking
		this.attacking = false;
		// keeps track of when our creep last attacked anything
		this.lastAttacking = new Date().getTime();
		// keep track of the last time our creep hit anything
		this.lastHit = new Date().getTime();
		this.now = new Date().getTime();
		this.body.setVelocity(3, 20);

		this.type = "EnemyCreep";

		// making the creep allowed to talk
		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
	},

	update: function(delta) {
		// logs in health
		console.log(this.health);
		if(this.health <= 0) {
			me.game.world.removeChild(this);
		}

		this.now = new Date().getTime();

		// this adds more creeps
		this.body.vel.x -= this.body.accel.x * me.timer.tick;

		me.collision.check(this, true, this.collideHandler.bind(this), true);

		// and all of this makes them move
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);

		// Making creep jump over obstacles intermediate 
		if(me.input.isKeyPressed("jump1") && !this.jumping && !this.falling) {
			this.body.jumping = true;
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}


		return true;
	},

	collideHandler: function(response) {
		if(response.b.type==='PlayerBase') {
			this.attacking = true;
			// this.lastAttacking = this.now;
			this.body.vel.x = 0;
			// keeps moving the creep to the right to maintain it's position
			this.pos.x = this.pos.x + 1;
			// checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 100)) {
				// updates the lasthit timer
				this.lastHit = this.now;
				// makes the player base call its loseHealth function and passes at a
				// damage of 1
				response.b.loseHealth(game.data.enemyCreepHealth);
			}
			}else if (response.b.type==='PlayerEntity') {
				var xdif = this.pos.x - response.b.pos.x;

				this.attacking = true;
				// this.lastAttacking = this.now;
				
				if(xdif>0){
					// keeps moving the creep to the right to maintain it's position
					this.pos.x = this.pos.x + 1;
					this.body.vel.x = 0;
				}
				// checks that it has been at least 1 second since this creep hit something
				if((this.now-this.lastHit >= 100) && xdif>0) {
					// updates the lasthit timer
					this.lastHit = this.now;
					// makes the player call its loseHealth function and passes at a
					// damage of 1
					response.b.loseHealth(game.data.enemyCreepAttack);
				}
			}
		}
});

// the timer for the creep
game.GameManager = Object.extend({
	init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();

		this.alwaysUpdate = true;
	},

	update: function() {
		this.now = new Date().getTime();

		if(game.data.player.dead) {
			// removes player getting attacked by the creep
			me.game.world.removeChild(game.data.player);
			// respawns the player
			me.state.current().resetPlayer(10, 0);
		}

		if(Math.round(this.now/1000)%10 === 0 && (this.now - this.lastCreep >= 1000)) {
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
		}

		return true;

	}
});