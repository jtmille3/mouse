define(function(require) {
	return Class.extend({
		init: function(game, x, y, width, height) {
			this.game = game;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.removeFromWorld = false;
			this.events = {};
		},

		update: function() {
		},

		draw: function(ctx) {
		},

		think: function() {
		},

		destroy: function() {
			this.removeFromWorld = true;
		},

		on: function(event, callback) {
			this.events[event] = this.events[event] || [];
			this.events[event].push(callback);
			return this;
		},

		once: function(event, callback) {
			var that = this;
			var once = function() {
				that.off(event);
				var args = Array.prototype.slice.call(arguments);
				callback.apply(this, args);
			};
			this.on(event, once);
			return this;
		},

		off: function(event) {
			delete this.events[event];
			return this;
		},

		trigger: function(event) {
			if(!this.events[event]) {return this;}
			var length = this.events[event].length;
			for(var index = 0; index < length; index++) {
				var callback = this.events[event][index];
				var args = Array.prototype.slice.call(arguments);
				callback.apply(this, args.slice(1));
			}
			return this;
		}
	});
});