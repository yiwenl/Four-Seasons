// ViewWall.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewWall() {
	this.width = 150.0;
	bongiovi.View.call(this, bongiovi.ShaderLibs.get("generalVert"), bongiovi.ShaderLibs.get('simpleColorFrag'));
}

var p = ViewWall.prototype = new bongiovi.View();
p.constructor = ViewWall;

p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createCube(this.width, 200.0, this.width);
};

p.render = function(position, color, opacity) {
	color = color || [1, 0, 0];
	position = position || [ 0, 0, 0];
	opacity = opacity==undefined ? 1.0 : opacity;
	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);
	this.shader.uniform("position", "uniform3fv", position);
	this.shader.uniform("scale", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("color", "uniform3fv", color);
	this.shader.uniform("opacity", "uniform1f", opacity);
	GL.draw(this.mesh);
};

module.exports = ViewWall;