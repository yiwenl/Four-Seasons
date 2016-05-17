// ViewSplit.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSplit() {
	bongiovi.View.call(this, null, glslify("../shaders/split.frag"));
}

var p = ViewSplit.prototype = new bongiovi.View();
p.constructor = ViewSplit;


p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(textureFlower, textureLeaves, textureSplit) {
	this.shader.bind();
	this.shader.uniform("textureFlower", "uniform1i", 0);
	textureFlower.bind(0);
	this.shader.uniform("textureLeaves", "uniform1i", 1);
	textureLeaves.bind(1);
	this.shader.uniform("textureSplit", "uniform1i", 2);
	textureSplit.bind(2);
	GL.draw(this.mesh);
};

module.exports = ViewSplit;