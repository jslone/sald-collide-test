
var collide = require('sald:collide.js');

var mode = 0;

var ray2;
var ctx = sald.ctx;
var time = 0;

function draw() {
	ctx = sald.ctx;
	var mouse = sald.mouse;

	ctx.setTransform(1,0, 0,1, 0,0);
	ctx.fillStyle = '#a5b';
	ctx.fillRect(0,0, ctx.width, ctx.height);

	if (!mouse) return;

	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(mouse.x - 10, mouse.y);
	ctx.lineTo(mouse.x + 10, mouse.y);
	ctx.moveTo(mouse.x, mouse.y - 10);
	ctx.lineTo(mouse.x, mouse.y + 10);
	ctx.stroke();

	function arrowLines(a, b) {
		var along = {
			x:b.x - a.x,
			y:b.y - a.y
		};
		var len = Math.sqrt(along.x * along.x + along.y * along.y);
		if (len > 0) {
			along.x /= len;
			along.y /= len;
		}
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);

		var perp = {x:-along.y, y:along.x};
		var s = 8.0;
		ctx.moveTo(
			b.x - s * along.x - 0.5 * s * perp.x,
			b.y - s * along.y - 0.5 * s * perp.y);
		ctx.lineTo( b.x, b.y);
		ctx.lineTo(
			b.x - s * along.x + 0.5 * s * perp.x,
			b.y - s * along.y + 0.5 * s * perp.y);
	}

	function rectLines(min, max) {
		ctx.moveTo(min.x, min.y);
		ctx.lineTo(max.x, min.y);
		ctx.lineTo(max.x, max.y);
		ctx.lineTo(min.x, max.y);
		ctx.closePath();
	}

	function convexLines(c) {
		ctx.moveTo(c[0].x, c[0].y);
		for (var i = 1; i < c.length; ++i) {
			ctx.lineTo(c[i].x, c[i].y);
		}
		ctx.closePath();
	}

	//Geometry to test against:

	var circle2 = { x:ctx.factor * 0.24, y: ctx.factor * 0.271, r:ctx.factor * 0.09 };
	// ray2 = {
	// 	start:{x:ctx.factor * 0.4, y:ctx.factor * 0.5},
	// 	end:{x:ctx.factor * 0.7, y:ctx.factor * 0.1} };
	var rect2 = {
		min:{x:ctx.factor * 0.1, y:ctx.factor * 0.62},
		max:{x:ctx.factor * 0.301, y:ctx.factor * 0.81}
	};
	var convex2 = [
		{x:-0.1, y:-0.1},
		{x: 0.12, y:-0.07},
		{x: 0.22, y:0.0},
		{x: 0.0, y:0.2},
		{x:-0.1, y:0.12}
	];
	convex2.forEach(function(c){
		c.x = (c.x + 0.7) * ctx.factor;
		c.y = (c.y + 0.7) * ctx.factor;
	});

	if (mode === 0) {
		var circle = {
			x:mouse.x,
			y:mouse.y,
			r:ctx.factor * 0.1
		};
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.r, 0, 2.0 * Math.PI);
		ctx.strokeStyle = '#000';
		ctx.stroke();

		// - - - - - - - - - -

		ctx.beginPath();
		ctx.arc(circle2.x, circle2.y, circle2.r, 0, 2.0 * Math.PI);
		if (collide.circleCircle(circle, circle2)) {
			ctx.strokeStyle = '#fff';
		} else {
			ctx.strokeStyle = '#555';
		}
		ctx.stroke();

		// - - - - - - - - - -

		ctx.beginPath();
		arrowLines(ray2.start, ray2.end);
		var col = collide.rayCircle(ray2, circle);
		if (col) {
			ctx.strokeStyle = '#fff';
			ctx.stroke();

			//show the intersection point:
			ctx.beginPath();
			var at = {
				x:col.t * (ray2.end.x - ray2.start.x) + ray2.start.x,
				y:col.t * (ray2.end.y - ray2.start.y) + ray2.start.y
			};
			ctx.moveTo(at.x - 4.0, at.y - 4.0);
			ctx.lineTo(at.x + 4.0, at.y + 4.0);
			ctx.moveTo(at.x - 4.0, at.y + 4.0);
			ctx.lineTo(at.x + 4.0, at.y - 4.0);
			ctx.strokeStyle = '#f00';
			ctx.stroke();
		} else {
			ctx.strokeStyle = '#555';
			ctx.stroke();
		}

		// - - - - - - - - - -
	} else if (mode === 1) {
		var rect = {
			min:{x: mouse.x - ctx.factor * 0.1, y: mouse.y - ctx.factor * 0.08},
			max:{x: mouse.x + ctx.factor * 0.1, y: mouse.y + ctx.factor * 0.08}
		};

		ctx.beginPath();
		rectLines(rect.min, rect.max);
		ctx.strokeStyle = '#000';
		ctx.stroke();

		// - - - - - - - - - -

		ctx.beginPath();
		rectLines(rect2.min, rect2.max);
		if (collide.rectangleRectangle(rect, rect2)) {
			ctx.strokeStyle = '#fff';
		} else {
			ctx.strokeStyle = '#555';
		}
		ctx.stroke();

		// - - - - - - - - - -

		ctx.beginPath();
		arrowLines(ray2.start, ray2.end);
		var col = collide.rayRectangle(ray2, rect);
		if (col) {
			ctx.strokeStyle = '#fff';
			ctx.stroke();

			//show the intersection point:
			ctx.beginPath();
			var at = {
				x:col.t * (ray2.end.x - ray2.start.x) + ray2.start.x,
				y:col.t * (ray2.end.y - ray2.start.y) + ray2.start.y
			};
			ctx.moveTo(at.x - 4.0, at.y - 4.0);
			ctx.lineTo(at.x + 4.0, at.y + 4.0);
			ctx.moveTo(at.x - 4.0, at.y + 4.0);
			ctx.lineTo(at.x + 4.0, at.y - 4.0);
			ctx.strokeStyle = '#f00';
			ctx.stroke();
		} else {
			ctx.strokeStyle = '#555';
			ctx.stroke();
		}
	} else if (mode === 2) {

		var convex = [
			{x:-0.08, y:-0.07},
			{x: 0.07, y:-0.06},
			{x: 0.09, y: 0.08},
			{x:-0.07, y: 0.09},
		];
		convex.forEach(function(c){
			c.x = (c.x * ctx.factor + mouse.x);
			c.y = (c.y * ctx.factor + mouse.y);
		});

		ctx.beginPath();
		convexLines(convex);
		ctx.strokeStyle = '#000';
		ctx.stroke();

		// - - - - - - - - - -

		ctx.beginPath();
		convexLines(convex2);
		if (collide.convexConvex(convex, convex2)) {
			ctx.strokeStyle = '#fff';
		} else {
			ctx.strokeStyle = '#555';
		}
		ctx.stroke();

		// - - - - - - - - - -

		ctx.beginPath();
		arrowLines(ray2.start, ray2.end);
		var col = collide.rayConvex(ray2, convex);
		if (col) {
			ctx.strokeStyle = '#fff';
			ctx.stroke();

			//show the intersection point:
			ctx.beginPath();
			var at = {
				x:col.t * (ray2.end.x - ray2.start.x) + ray2.start.x,
				y:col.t * (ray2.end.y - ray2.start.y) + ray2.start.y
			};
			ctx.moveTo(at.x - 4.0, at.y - 4.0);
			ctx.lineTo(at.x + 4.0, at.y + 4.0);
			ctx.moveTo(at.x - 4.0, at.y + 4.0);
			ctx.lineTo(at.x + 4.0, at.y - 4.0);
			ctx.strokeStyle = '#f00';
			ctx.stroke();
		} else {
			ctx.strokeStyle = '#555';
			ctx.stroke();
		}

	}
}

function rotateRay(){
	if (ctx != null){
		ray2 = {
		start:{x:ctx.factor * 0.5, y:ctx.factor * 0.5},
		end:{x:(ctx.factor * 0.5) + (140*Math.cos(time)), y:(ctx.factor * 0.5) + (140*Math.sin(time))} };
	}
}

function update(elapsed) {
	time += elapsed;
	rotateRay();
}

function key(code, down) {
	if (down && code == 32) { //space bar
		mode = (mode + 1) % 3;
	}
}

module.exports = {
	draw:draw,
	update:update,
	key:key,
};
