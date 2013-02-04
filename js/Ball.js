define(function(require) {
	var Entity = require('./Entity');

	return Entity.extend({
		init: function(game, x, y, width, height) {
			this._super(game, 90, game.surfaceHeight - 32, 32, 32);

			this.sprite = ASSET_MANAGER.getAsset('img/ball.png');

			var bodyDefinition = new b2BodyDef();
			bodyDefinition.type = b2Body.b2_dynamicBody;
			bodyDefinition.position.x = (this.x + (this.width / 2)) / this.game.box2dScale;
			bodyDefinition.position.y = (this.y + (this.height / 2)) / this.game.box2dScale;
			bodyDefinition.userData = this;

			var fixtureDefinition = new b2FixtureDef();
			fixtureDefinition.density = 1.0;
			fixtureDefinition.friction = 0.5;
			fixtureDefinition.restitution = 0.5;
			fixtureDefinition.shape = new b2CircleShape(this.width / 2 / this.game.box2dScale); //radius

			this.body = this.game.world.CreateBody(bodyDefinition);
			this.fixture = this.body.CreateFixture(fixtureDefinition);
		},

		update: function() {
			this._super();

			this.x = this.body.GetPosition().x * this.game.box2dScale;
			this.y = this.body.GetPosition().y * this.game.box2dScale;
			this.angle = this.body.GetAngle();

			if(this.game.mouseDown) {
				this.readyToKick = true;
				this.kicked = false;
			} else if(this.game.mouseUp && this.readyToKick && !this.kicked) {
				this.kicked = true;
				this.readyToKick = false;
				var that = this;
				setTimeout(function() {  // delay next kick
					that.kicked = false;
				}, 1000);

				this.kick();
			}
		},

		draw: function(ctx) {
			this._super(ctx);

			if(this.game.mouseDown) {
				var distance = Math.sqrt(Math.pow(this.x - this.game.mouse.x, 2) + (Math.pow(this.y - this.game.mouse.y, 2)));
				var radians = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);

				ctx.save();
				ctx.strokeStyle = '#000';
				ctx.fillStyle = '#000';
				ctx.beginPath();
				ctx.moveTo(this.x,this.y);
				ctx.lineTo(this.game.mouse.x,this.game.mouse.y);
				ctx.lineWidth = Math.max(5 - Math.floor(5 * distance / 300), 1); // 4-1 range;
				ctx.stroke();
				ctx.restore();

				ctx.save();
				ctx.translate(this.game.mouse.x, this.game.mouse.y);
				ctx.rotate(radians);
				ctx.translate(0, 5);
				ctx.rotate(0.4); // ball rotation for some reason
				ctx.beginPath();
				ctx.lineTo(-5, -10);
				ctx.lineTo(10, -10);
				ctx.lineTo(0, 0);
				ctx.fill();
				ctx.stroke();
				ctx.restore();
			}

			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			ctx.translate(-this.width/2, -this.height/2);
			ctx.drawImage(this.sprite, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
			ctx.restore();
		},

		kick: function() {
			var distance = Math.sqrt(Math.pow(this.x - this.game.mouse.x, 2) + (Math.pow(this.y - this.game.mouse.y, 2)));
			var radians = Math.atan2(this.game.mouse.y - this.y, this.game.mouse.x - this.x);
			var power = 40 * distance / 256;
			this.body.ApplyImpulse(new b2Vec2(Math.cos(radians) * power, Math.sin(radians) * power), this.body.GetPosition());
			ASSET_MANAGER.getSound('audio/thud.wav').play();
		}
	});
});