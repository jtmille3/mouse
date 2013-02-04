define(function(require) {
	var Entity = require('./Entity');

	return Entity.extend({
		init: function(game, x, y, width, height) {
			this._super(game, 0, 0, game.surfaceWidth, game.surfaceHeight);

			this.grassY = this.game.surfaceHeight - 64;
			this.grassWidth = 101;
			this.grassHeight = 171;
			
			this.sprite1 = ASSET_MANAGER.getAsset('img/grass.png');
			this.sprite2 = ASSET_MANAGER.getAsset('img/clouds.png');

			var scale = this.game.box2dScale;

			// bottom wall
			this.buildWall(this.width/2/scale, this.height/scale,this.width/scale/2,13/scale);

			// top wall
			this.buildWall(this.width/2/scale, 0,this.width/scale/2,1/scale);

			// left wall
			this.buildWall(0, this.height/scale,1/scale,this.height/scale);

			// right wall
			this.buildWall(this.width/scale, this.height/scale,1/scale,this.height/scale);
		},

		buildWall: function(x, y, width, height) {
			var bodyDefinition = new b2BodyDef();
			bodyDefinition.type = b2Body.b2_staticBody;
			bodyDefinition.position.x = x;
			bodyDefinition.position.y = y;

			var fixtureDefinition = new b2FixtureDef();
			fixtureDefinition.density = 1.0;
			fixtureDefinition.friction = 0.3;
			fixtureDefinition.restitution = 0.0;
			fixtureDefinition.shape = new b2PolygonShape();
			fixtureDefinition.shape.SetAsBox(width, height);

			var body = this.game.world.CreateBody(bodyDefinition);
			body.CreateFixture(fixtureDefinition);
		},

		update: function() {
			this._super();
		},

		draw: function(ctx) {
			this._super(ctx);

			ctx.save();

			ctx.fillStyle = '#E4E4FF';
			ctx.fillRect(this.x, this.y, this.width, this.height);

			ctx.drawImage(this.sprite2, this.width - 270, 0);
			ctx.drawImage(this.sprite2, this.width - 550, 40);

			var total = this.width / this.grassWidth;
			for(var i = 0; i < total; i++) {
				ctx.drawImage(this.sprite1, 5 , 0, this.grassWidth - 10, this.grassHeight, this.grassWidth * i, this.grassY, this.grassWidth, this.grassHeight);
			}

			ctx.restore();
		}
	});
});