define(function(require) {
    var requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    var Timer = require('./Timer');

    return Class.extend({
        init: function() {
            this.entities = [];
            this.ctx = null;
            this.click = null;
            this.mouse = null;
            this.timer = new Timer();
            this.surfaceWidth = null;
            this.surfaceHeight = null;

            this.world = new b2World(new b2Vec2(0, 10), true);
            this.box2dScale = 30;
        },

        initialize: function(ctx) {
            console.log('game initialized');
            this.ctx = ctx;
            this.surfaceWidth = this.ctx.canvas.width;
            this.surfaceHeight = this.ctx.canvas.height;
            this.startInput();
        },

        start: function() {
            if(this.debug) {
                var debugDraw = new b2DebugDraw();
                debugDraw.SetSprite(document.getElementById("surface").getContext("2d"));
                debugDraw.SetDrawScale(this.box2dScale);
                debugDraw.SetFillAlpha(0.3);
                debugDraw.SetLineThickness(1.0);
                debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                this.world.SetDebugDraw(debugDraw);
            }

            console.log("starting game");
            var that = this;
            (function gameLoop() {
                that.loop();
                requestAnimFrame(gameLoop, that.ctx.canvas);
            })();
        },

        startInput: function() {
            var getXandY = function(e) {
                var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left;
                var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
                return {x: x, y: y};
            };

            var that = this;

            this.ctx.canvas.addEventListener("click", function(e) {
                that.click = getXandY(e);
                e.stopPropagation();
                e.preventDefault();
            }, false);

            this.ctx.canvas.addEventListener("mousedown", function(e) {
                that.mouseDown = true;
                that.mouseUp = false;
                that.mouse = getXandY(e);
            }, false);

            this.ctx.canvas.addEventListener("mousemove", function(e) {
                that.mouse = getXandY(e);
            }, false);

            this.ctx.canvas.addEventListener("mouseup", function(e) {
                that.mouseUp = true;
                that.mouseDown = false;
                that.mouse = getXandY(e);
            }, false);
        },

        addEntity: function(entity) {
            this.entities.push(entity);
        },

        draw: function(callback) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

            if(this.debug) {
                this.world.DrawDebugData();
            }

            this.ctx.save();

            for (var i = 0; i < this.entities.length; i++) {
                this.entities[i].draw(this.ctx);
            }

            if (callback) {
                callback(this);
            }

            this.ctx.restore();
        },

        update: function() {
            this.world.Step(
                1 / 60,   //frame-rate
                10,       //velocity iterations
                10        //position iterations
            );
            
            var entitiesCount = this.entities.length;

            for (var i = 0; i < entitiesCount; i++) {
                var entity = this.entities[i];

                if (!entity.removeFromWorld) {
                    entity.update();
                }
            }

            for (var i = 0; i < entitiesCount; i++) {
                var entity = this.entities[i];

                if (!entity.removeFromWorld) {
                    entity.think();
                }
            }

            this.world.ClearForces();

            for (var i = this.entities.length-1; i >= 0; --i) {
                if (this.entities[i].removeFromWorld) {
                    var temp = this.entities[i];
                    this.entities.splice(i, 1);
                    if(temp.body) {
                        this.world.DestroyBody(temp.body);
                    } else if(temp.bodies) {
                        for(var j = 0; j < temp.bodies.length; j++) {
                            var body = temp.bodies[j];
                            this.world.DestroyBody(body);
                        }
                    }
                }
            }
        },

        loop: function() {
            this.clockTick = this.timer.tick();
            this.update();
            this.draw();
            this.click = null;
        }

    });
});