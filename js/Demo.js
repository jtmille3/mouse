define(function(require) {
	var GameEngine = require('./GameEngine');
	var Ball = require('./Ball');
	var Pitch = require('./Pitch');
	
	return GameEngine.extend({
		init: function(debug) {
			this._super();
			this.debug = debug || false;
			this.lives = 10;

			this.goals = 0;
			this.scored = false;
		},

		start: function() {
			var that = this;

			this.pitch = new Pitch(this);

			if(!this.debug) {
				this.addEntity(this.pitch);
			}

			this.ball = new Ball(this);
			this.addEntity(this.ball);

			this._super(this);
		},

		update: function() {
			this._super();
		},

		draw: function() {
			var that = this;
			this._super(function(game) {
				// draw hud here
			});
		}
	});
});