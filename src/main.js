
var mainloop = require('sald:mainloop.js');

sald.size = {x:1, y:1, mode:"ratio"};
sald.scene = require('test.js');

window.main = function main() {
	mainloop.start(document.getElementById("canvas"));
};
