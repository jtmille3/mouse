define(function(require) {
	return Class.extend({
		init: function() {
			this.successCount = 0;
			this.errorCount = 0;
			this.cache = {};
			this.downloadQueue = [];
			this.soundsQueue = [];
		},

		queueDownload: function(path) {
			this.downloadQueue.push(path);
		},

		queueSound: function(id, path) {
			this.soundsQueue.push({id: id, path: path});
		},

		downloadAll: function(callback) {
			if (this.downloadQueue.length === 0 && this.soundsQueue.length === 0) {
				callback();
			}

			this.downloadSounds(callback);

			for (var i = 0; i < this.downloadQueue.length; i++) {
				var path = this.downloadQueue[i];
				var img = new Image();
				var that = this;
				img.addEventListener("load", function() {
					console.log(this.src + ' is loaded');
					that.successCount += 1;
					if (that.isDone()) {
						callback();
					}
				}, false);
				img.addEventListener("error", function() {
					that.errorCount += 1;
					if (that.isDone()) {
						callback();
					}
				}, false);
				img.src = path;
				this.cache[path] = img;
			}
		},

		downloadSounds: function(callback) {
			var that = this;
			soundManager.onready(function() {
				console.log('soundManager ready');
				for (var i = 0; i < that.soundsQueue.length; i++) {
					that.downloadSound(that.soundsQueue[i].id, that.soundsQueue[i].path, callback);
				}
			});
			soundManager.ontimeout(function() {
				console.log('SM2 did not start');
			});
		},

		downloadSound: function(id, path, callback) {
			var that = this;
			this.cache[path] = soundManager.createSound({
				id: id,
				autoLoad: true,
				url: path,
				onload: function() {
					console.log(this.url + ' is loaded');
					that.successCount += 1;
					if (that.isDone()) {
						callback();
					}
				}
			});
		},

		getSound: function(path) {
			return this.cache[path];
		},

		getAsset: function(path) {
			return this.cache[path];
		},

		isDone: function() {
			return ((this.downloadQueue.length + this.soundsQueue.length) == this.successCount + this.errorCount);
		}
	});
});