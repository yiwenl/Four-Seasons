// ViewTree.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var ObjLoader = require("./ObjLoader");


function ViewTree() {
	this.scale = .05;
	this.y = -4;
	bongiovi.View.call(this, glslify("../shaders/tree.vert"), glslify("../shaders/tree.frag"));
}

var p = ViewTree.prototype = new bongiovi.View();
p.constructor = ViewTree;


p._init = function() {
	ObjLoader.load("assets/DeadTree21.obj", this._onObjMesh.bind(this), null, false);
};


p._onObjMesh = function(mesh, o) {
	this.mesh = mesh;

	var positions = o.positions;
	var threshold = 15;
	this.leavesPositions = [];
	var scaleOffset = 9.5;

	for(var i=0; i<positions.length; i++) {
		var p = positions[i];
		var y = p[1] * this.scale;
		if(y > threshold) {
			this.leavesPositions.push([p[0] * this.scale * scaleOffset, p[1] * this.scale * scaleOffset - 2.5*scaleOffset, p[2] * this.scale * scaleOffset]);
			// this.leavesPositions.push(p);
		}
	}
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
	this.shader.uniform("position", "uniform3fv", [0, this.y, 0]);
	this.shader.uniform("lightDir", "uniform3fv", params.lightPos);
	this.shader.uniform("lightColor", "uniform3fv", params.lightColor);
	
	this.shader.uniform("scale", "uniform3fv", [this.scale, this.scale, this.scale]);
	
	
	GL.draw(this.mesh);
};

module.exports = ViewTree;