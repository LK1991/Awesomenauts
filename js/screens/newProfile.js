game.NewProfile = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		// adding the title screen image to the beginning
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('new-screen')), -10); // TODO

		document.getElementById("input").style.visibility = "visible";
		document.getElementById("register").style.visibility = "visible";

		me.input.unbindKey(me.input.KEY.B);
		me.input.unbindKey(me.input.KEY.Q);
		me.input.unbindKey(me.input.KEY.E);
		me.input.unbindKey(me.input.KEY.W);
		me.input.unbindKey(me.input.KEY.A);

		me.game.world.addChild(new (me.Renderable.extend({
			// setting the font, width, height, and font size
			init: function(){
				this._super(me.Renderable, 'init', [10, 10, 300, 50]);
				this.font = new me.Font("Arial", 26, "white");
			},

			// putting in the text
			draw: function(renderer){
				// text for screen
				this.font.draw(renderer.getContext(), "PICK A USERNAME AND A PASSWORD", this.pos.x, this.pos.y);
			}

		})));
	},
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		document.getElementById("input").style.visibility = "hidden";
		document.getElementById("register").style.visibility = "hidden";
	}
});
