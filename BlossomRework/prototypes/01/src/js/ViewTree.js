// ViewTree.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var ObjLoader = require("./ObjLoader");

function ViewTree() {
	bongiovi.View.call(this, glslify("../shaders/tree.vert"), glslify("../shaders/tree.frag"));
}

var p = ViewTree.prototype = new bongiovi.View();
p.constructor = ViewTree;


p._init = function() {
	ObjLoader.load("assets/DeadTree21.obj", this._onObjMesh.bind(this), null, false);
};


p._onObjMesh = function(mesh) {
	this.mesh = mesh;
};


p._onObjLoaded = function(e) {
	var o = this._parseObj(e.response);
	gl = GL.gl;

	this.mesh = new bongiovi.Mesh(o.positions.length, o.indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(o.positions);
	this.mesh.bufferTexCoords(o.coords);
	this.mesh.bufferIndices(o.indices);
};


p.render = function(texture, textureNormal) {
	if(!this.shader.isReady() ) return;
	if(!this.mesh) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNormal", "uniform1i", 1);
	textureNormal.bind(1);
	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	this.shader.uniform("position", "uniform3fv", [0, -4, 0]);
	this.shader.uniform("lightDir", "uniform3fv", params.lightPos);
	this.shader.uniform("lightColor", "uniform3fv", params.lightColor);
	var scale = .05;
	this.shader.uniform("scale", "uniform3fv", [scale, scale, scale]);
	
	
	GL.draw(this.mesh);
};

module.exports = ViewTree;