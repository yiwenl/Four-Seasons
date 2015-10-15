// ViewWall.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewWall() {
	this.width = 150.0;
	// bongiovi.View.call(this, null, glslify("../shaders/simpleColorFrag"));
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, bongiovi.ShaderLibs.get("generalVert"), bongiovi.ShaderLibs.get('simpleColorFrag'));
}

var p = ViewWall.prototype = new bongiovi.View();
p.constructor = ViewWall;


bongiovi.MeshUtils.createCube = function(w,h,d) {
	h = h || w;
	d = d || w;

	if(!gl) gl = GL.gl;
	var x = w/2;
	var y = h/2;
	var z = d/2;


	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;


	// BACK
	positions.push([-x,  y, -z]);
	positions.push([ x,  y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([-x, -y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// RIGHT
	positions.push([ x,  y, -z]);
	positions.push([ x,  y,  z]);
	positions.push([ x, -y,  z]);
	positions.push([ x, -y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// FRONT
	positions.push([ x,  y,  z]);
	positions.push([-x,  y,  z]);
	positions.push([-x, -y,  z]);
	positions.push([ x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	// LEFT
	positions.push([-x,  y,  z]);
	positions.push([-x,  y, -z]);
	positions.push([-x, -y, -z]);
	positions.push([-x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// TOP
	positions.push([-x,  y,  z]);
	positions.push([ x,  y,  z]);
	positions.push([ x,  y, -z]);
	positions.push([-x,  y, -z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;

	// BOTTOM
	positions.push([-x, -y, -z]);
	positions.push([ x, -y, -z]);
	positions.push([ x, -y,  z]);
	positions.push([-x, -y,  z]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count*4 + 0);
	indices.push(count*4 + 1);
	indices.push(count*4 + 2);
	indices.push(count*4 + 0);
	indices.push(count*4 + 2);
	indices.push(count*4 + 3);

	count ++;


	var mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);

	return mesh;
}


console.log(bongiovi.MeshUtils);


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