/* nav bar*/
$(document).ready(function() {
    var sideslider = $('[data-toggle=collapse-side]');
    var sel = sideslider.attr('data-target');
    var sel2 = sideslider.attr('data-target-2');
    sideslider.click(function(event){
        $(sel).toggleClass('in');
        $(sel2).toggleClass('out');
    });
});

/**
 * JS for Hartcore
 * Alexandre Andrieux (Icosacid) @2015
 * Main functions
 */
var hc = {
    worlds: [],
    startTime: null,
    anim: null,
    summon: function() {
        for (key in arguments) {
            this.worlds.push(arguments[key]);
        }
    },
    ignite: function() {
        this.startTime = new Date().getTime();
        this.igniteWorlds();
        this.frame();
    },
    frame: function() {
        hc.paint(new Date().getTime());
        hc.anim = window.requestAnimationFrame(hc.frame);
    },
    paint: function(t) {
        for (key in hc.worlds) {
            hc.worlds[key].world.update(t - hc.startTime);
        }
    },
    igniteWorlds: function() {
        for (key in this.worlds) {
            this.worlds[key].world.ignite(this.worlds[key].args);
        }
    }
};

/**
 * JS for Hartcore hc_reactor
 * Alexandre Andrieux (Icosacid) @2015
 * World Reactor
 */
var hc_reactor = {
    name: "reactor",
    ignite: function() {
        var canvas = document.createElement('canvas');
        canvas.class = "hart";
        canvas.id = this.name;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        this.canvas = document.getElementById(canvas.id);
        this.ctx = this.canvas.getContext('2d');
        // Animation is stopping after a while
        this.step = 0;
        this.steps = 2000;

        // Variable 1
        this.var1 = 0;
        this.var1count = 0;
        this.var1var = 200;

        // Variable 2
        this.var2 = 0;

        // Particles
        this.seedsPop = 20;
        this.seeds = [];
        this.xC = this.canvas.width / 2;
        this.yC = this.canvas.height / 2;
        for (var i = 0; i < this.seedsPop; i++) {
            var datsMyAngle = i / this.seedsPop * 2 * Math.PI;
            this.seeds.push({
                rLast: 0,
                r: 0,
                theta: datsMyAngle,
                thetaLast: datsMyAngle,
                thetaSpeed: 0
            });
        }
        this.background();
    },
    background: function() {
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#0a0a0a";
        this.ctx.fill();
    },
    update: function(t) {
        if ((++this.step) < this.steps) {
            this.evolve(t);
            this.move(t);
            this.draw();
        }
    },
    evolve: function(t) {
        // Laws (increasing a variable)
        this.evolutionVar1();
        this.evolutionVar2();
        // Effects (when this variable reaches a threshold, do sth)

    },
    evolutionVar1: function() {
        this.var1count++;
        // Range from 0 to 1
        this.var1 = 0.5 + 0.5*Math.sin(this.var1count/this.var1var*2*Math.PI);
    },
    evolutionVar2: function() {
        this.var2 = Math.sin(this.step/300);
    },
    move: function(t) {
        var t = t/3000;
        for (var i = 0; i < this.seedsPop; i++) {
            var seed = this.seeds[i];
            seed.rLast = seed.r;
            seed.thetaLast = seed.theta;

            // Mirror seeds alternatively
            var way = (i % 2 == 0 ? 1 : -1);
            seed.theta = i/this.seedsPop * 2*Math.PI + Math.sin(0.5*t) * Math.cos(1*t);
            seed.r = 300 * Math.cos(t) * Math.sin(1.5 * t * seed.theta);
        }
    },
    draw: function() {
        for (var i = 0; i < this.seedsPop; i++) {
            var seed = this.seeds[i];
            var sSold = this.spaceShift(seed.rLast, seed.thetaLast);
            var sSnew = this.spaceShift(seed.r, seed.theta);
            this.ctx.save();

            // Hue
            var h = 40 - 0.12 * Math.abs(seed.r);
            var lum = '60%';

            // Backlight
            this.ctx.strokeStyle = "hsla(" + h + ", 100%, " + lum + ", 0.01)";
            this.ctx.lineWidth = 15;
            this.ctx.lineCap = "round";
            this.ctx.beginPath();
            this.ctx.moveTo(sSold.x, sSold.y);
            this.ctx.lineTo(sSnew.x, sSnew.y);
            this.ctx.stroke();
            this.ctx.restore();

            // Front stroke
            this.ctx.strokeStyle = "hsla(" + h + ", 100%, " + lum + ", 1)";
            this.ctx.lineWidth = 0.5;
            this.ctx.lineCap = "round";
            this.ctx.beginPath();
            this.ctx.moveTo(sSold.x, sSold.y);
            this.ctx.lineTo(sSnew.x, sSnew.y);
            this.ctx.stroke();
        }
    },
    spaceShift: function(r, theta) {
        var x = this.xC + r * Math.cos(theta);
        var y = this.yC - r * Math.sin(-theta);
        return {x: x, y: y};
    }
};

// Go go go!
hc.summon({
    world: hc_reactor,
    args: []
});
hc.ignite();
