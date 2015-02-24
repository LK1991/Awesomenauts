// creating a player entity
game.PlayerEntity = me.Entity.extend({
	// choosing one player out of all the others
	init: function(x, y, settings){
		// linking the functions
		this.setSuper();
		this.setPlayerTimers();
		this.setAttributes();
		this.type = "PlayerEntity";
		this.setFlags();

		// following the player and moving the screen 
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		// linking the function
		this.addAnimation();

		this.renderable.setCurrentAnimation("idle");
	},

	// player settings separated from the the init function
	setSuper: function() {
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
	},

	// separating this hit and attacks
	setPlayerTimers: function() {
		this.now = new Date().getTime();
		this.lastHit = this.now; //	the last hit makes the tower lose health and fire up
		this.lastAttack = new Date().getTime(); // Haven't used this
	},

	// separating health and speed 
	setAttributes: function() {
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		this.attack = game.data.playerAttack;
	},

	// separating the player's death and position
	setFlags: function() {
		// Keeps track of which direction the character is going 
		this.facing = "right";
		this.dead = false;
	},

	// separating the animations 
	addAnimation: function() {
		// adding new animations
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
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
			me.audio.play("jumping_teon");
		}

		if(me.input.isKeyPressed("attack")) {
			if(!this.renderable.isCurrentAnimation("attack")) {
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

		// console.log(" Dead x " + this.body.pos.x + " y " + this.body.pos.y);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
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
					// if the creeps health is less than our attack, execute code in if statement
					if(response.b.health <= game.data.playerAttack) {
						// adds one gold for a creep kill
						game.data.gold += 1;
						console.log("Current gold " + game.data.gold);
					}

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

