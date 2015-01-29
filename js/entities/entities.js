// there are many players in the image so this is only choosing one
game.PlayerEntity = me.Entity.extend({
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

		this.body.setVelocity(5, 20);
		// Keeps track of which direction the character is going 
		this.facing = "right";
		this.now = new Date().getTime();
		this.lastHit = this.now; //	the last hit makes the tower lose health and fire up
		this.lastAttack = new Date().getTime(); // Haven't used this
		// following the player and moving the screen 
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);


		// adding new animtations
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		this.now = new Date().getTime();
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
				this.pos.x = this.pos.x -1;
			}
			// this lets you move away from EnemyBaseEntity
			else if(xdif<70 && this.facing==='left' && xdif>0){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x +1;
			}

			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 300) {
				console.log("tower Hit"); // logs in when i hit the tower
				this.lastHit = this.now; //	the last hit makes the tower lose health and fire up
				response.b.loseHealth();
			}
		}
	}
});

game.PlayerBaseEntity = me.Entity.extend({
	init : function(x, y, settings) {
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
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		console.log("init");
		this.type = "PlayerBaseEntity";

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
});

game.EnemyBaseEntity = me.Entity.extend({
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
		this.health = 10;
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