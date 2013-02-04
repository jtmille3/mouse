var debug = window.location.search.indexOf('debug') != -1;

define(function(require) {
  var AssetManager = require('./AssetManager');
  var Demo = require('./Demo');

  var canvas = document.getElementById('surface');
  var ctx = canvas.getContext('2d');
  var game = new Demo(debug);
  
  // make global just because
  ASSET_MANAGER = new AssetManager();

  ASSET_MANAGER.queueDownload('img/ball.png');
  ASSET_MANAGER.queueDownload('img/grass.png');
  ASSET_MANAGER.queueDownload('img/clouds.png');

  ASSET_MANAGER.queueSound('thud', 'audio/thud.wav');
  
  ASSET_MANAGER.downloadAll(function() {
      game.initialize(ctx);
      game.start();
  });
});