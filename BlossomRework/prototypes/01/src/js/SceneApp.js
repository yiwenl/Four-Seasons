// SceneApp.js

var GL = bongiovi.GL, gl;
var SoundCloudLoader = require("./SoundCloudLoader");
var ViewSave = require("./ViewSave");
var ViewSaveExtra = require("./ViewSaveExtra");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewSky = require("./ViewSky");
var ViewBlur = require("./ViewBlur");
var ViewPost = require("./ViewPost");
var ViewTerrain = require("./ViewTerrain");
var ViewNoise = require("./ViewNoise");
var ViewNormal = require("./ViewNormal");
var ViewTree = require("./ViewTree");
var ViewWall = require("./ViewWall");
var ViewSplit = require("./ViewSplit");

function SceneApp() {
	gl = GL.gl;
	this.sum = 0;
	this.count = 0;
	this.hasViewCreated = false;
	this.easeSum = new bongiovi.EaseNumber(0, .25);
	bongiovi.Scene.call(this);
	this.camera.setPerspective(65 * Math.PI/180, GL.aspectRatio, 5, 200);

	window.addEventListener("resize", this.resize.bind(this));
	window.addEventListener("keydown", this._onKey.bind(this));

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value    = -.055;
	this.camera._rx.limit(-.06, -.05);
	this.camera._ry.value    = -.1;
	this.camera.radius.setTo(90);
	this.camera.radius.value = 100;
	this.camera.center[1]    = -30.0;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	if(!gl) gl                = GL.gl;
	this._textureSky          = new bongiovi.GLTexture(images.bg);
	this._textureNoise        = new bongiovi.GLTexture(images.noise);
	this._textureDetailHeight = new bongiovi.GLTexture(images.detailHeight);
	this._textureFlower       = new bongiovi.GLTexture(images.flower);
	this._textureLeaves       = new bongiovi.GLTexture(images.leaves);
	this._textureTree         = new bongiovi.GLTexture(images.tree);
	this._textureTreeNormal   = new bongiovi.GLTexture(images.treeNormal);
	
	var num                   = params.numParticles;
	var o                     = { minFilter:gl.NEAREST,magFilter:gl.NEAREST}
	var oLinear               = { minFilter:gl.LINEAR,magFilter:gl.LINEAR}
	this._fboCurrent          = new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget           = new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboExtras           = new bongiovi.FrameBuffer(num*2, num*2, o);
	
	this._fboRenderFlower     = new bongiovi.FrameBuffer(GL.width, GL.height, o);
	this._fboRenderLeaves     = new bongiovi.FrameBuffer(GL.width, GL.height, o);
	
	var noiseSize             = 512;
	this._fboNoise            = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboNormal           = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	
	var splitFboSize          = 256 * 4;
	this._fboSplit            = new bongiovi.FrameBuffer(splitFboSize, splitFboSize);
};

p._initViews = function() {
	this._vTree 	 = new ViewTree();
	this._initRestViews();
};

p._initRestViews = function() {
	if(this._vTree.mesh === undefined) {
		bongiovi.Scheduler.next(this, this._initRestViews);
		return;
	}

	this.hasViewCreated	= true;
	this._vSave      = new ViewSave(this._vTree.leavesPositions);
	this._vSaveExtra = new ViewSaveExtra();
	this._vCopy      = new bongiovi.ViewCopy();
	this._vRender    = new ViewRender();
	this._vSim       = new ViewSimulation();
	this._vSky       = new ViewSky();
	this._vTerrain   = new ViewTerrain();
	this._vPost      = new ViewPost();
	this._vNoise     = new ViewNoise(params.noise);
	this._vNormal    = new ViewNormal(params.terrainNoiseHeight/300*3.0);
	this._vWall		 = new ViewWall();
	this._vSplit	 = new ViewSplit();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();

	this._fboExtras.bind();
	GL.setViewport(0, 0, this._fboExtras.width, this._fboExtras.height);
	this._vSaveExtra.render();
	this._fboExtras.unbind();

	this._fboNoise.bind();
	GL.clear();
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);
	this._vNoise.setNoise(params.noise);
	this._vNoise.render(this._textureDetailHeight);
	this._fboNoise.unbind();

	this._fboNormal.bind();
	GL.clear();
	this._vNormal.render(this._fboNoise.getTexture());
	this._fboNormal.unbind();
};


p.updateFbo = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture(), this._fboExtras.getTexture());
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};


p.render = function() {
	if(!this.hasViewCreated) return;
	if(params.cameraAutoRotate) this.camera._ry.value += .01;
	var skipCount = Math.floor(params.skipCount);
	if(this.count % skipCount === 0) {
		this.updateFbo();
		this._vRender.tick();
		this.count = 0;
	}
	var percent = this.count / skipCount;

	this.count ++;
	GL.setViewport(0, 0, GL.width, GL.height);
	
	var numTiles = 2;
	var size = 300;

	this._fboRenderFlower.bind();
	GL.clear(0, 0, 0, 0);
	this._vSky.render(this._textureSky, this.camera);
	this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent, this._fboExtras.getTexture(), this.camera, this._textureFlower, this._textureLeaves, 0);
	this._vTree.render(this._textureTree, this._textureTreeNormal);
	for(var j=0; j<numTiles; j++) {
		for(var i=0; i<numTiles; i++) {
			var uvOffset = [i/numTiles, j/numTiles];
			this._vTerrain.render(this._fboNoise.getTexture(), numTiles, size, uvOffset, this._fboNormal.getTexture(), this._textureNoise, this.camera);
		}
	}
	this._fboRenderFlower.unbind();

	this._fboRenderLeaves.bind();
	GL.clear(0, 0, 0, 0);
	this._vSky.render(this._textureSky, this.camera);
	this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent, this._fboExtras.getTexture(), this.camera, this._textureFlower, this._textureLeaves, 1);
	this._vTree.render(this._textureTree, this._textureTreeNormal);
	for(var j=0; j<numTiles; j++) {
		for(var i=0; i<numTiles; i++) {
			var uvOffset = [i/numTiles, j/numTiles];
			this._vTerrain.render(this._fboNoise.getTexture(), numTiles, size, uvOffset, this._fboNormal.getTexture(), this._textureNoise, this.camera);
		}
	}
	this._fboRenderLeaves.unbind();
	
	

	this._fboSplit.bind(); 
	GL.setViewport(0, 0, this._fboSplit.width, this._fboSplit.height);
	GL.clear();
	gl.disable(gl.CULL_FACE);
	var w = this._vWall.width/2;
	this._vWall.render([-w-.01, 0, 0], [1, 1, 1], 1);
	this._vWall.render([ w, 0, 0], [0, 0, 0], 1);
	gl.enable(gl.CULL_FACE);

	this._fboSplit.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	// this._vCopy.render(this._fboRenderFlower.getTexture());
	// this._vCopy.render(this._fboRenderLeaves.getTexture());

	this._vSplit.render(this._fboRenderFlower.getTexture(), this._fboRenderLeaves.getTexture(), this._fboSplit.getTexture());

};

p._onKey = function(e) {
	// console.log(e.keyCode);
	if(e.keyCode == 32) {
		console.log(params.textureMix.targetValue);
		params.textureMix.value = (params.textureMix.targetValue == 0) ? 1 : 0;
	}
	
};


p.resize = function() {
	var scale = 1.0;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);

	var o                     = { minFilter:gl.NEAREST,magFilter:gl.NEAREST}
	var oLinear               = { minFilter:gl.LINEAR,magFilter:gl.LINEAR}
	this._fboRenderFlower     = new bongiovi.FrameBuffer(GL.width, GL.height, oLinear);
	this._fboRenderLeaves     = new bongiovi.FrameBuffer(GL.width, GL.height, oLinear);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>