// SceneApp.js

var GL = bongiovi.GL, gl;
var SoundCloudLoader = require("./SoundCloudLoader");
var ViewSave = require("./ViewSave");
var ViewSaveExtra = require("./ViewSaveExtra");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");

function SceneApp() {
	gl = GL.gl;
	this.sum = 0;
	this.count = 0;
	this.easeSum = new bongiovi.EaseNumber(0, .25);
	this._initSound();
	bongiovi.Scene.call(this);
	this.camera.setPerspective(65 * Math.PI/180, GL.aspectRatio, 5, 200);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value = -.3;
	this.camera._ry.value = -.1;
	this.camera.radius.value = 100;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initSound = function() {
	var that = this;
	this.soundOffset = 0;
	this.preSoundOffset = 0;
	this.sound = Sono.load({
	    url: ['assets/audio/Oscillate.mp3'],
	    volume: 0.0,
	    loop: true,
	    onComplete: function(sound) {
	    	console.debug("Sound Loaded");
	    	that.analyser = sound.effect.analyser(256);
	    	sound.play();
	    }
	});
};

p._initTextures = function() {
	console.log('Init Textures');
	if(!gl) gl = GL.gl;

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboExtras 	= new bongiovi.FrameBuffer(num*2, num*2, o);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis      = new bongiovi.ViewAxis();
	this._vDotPlane  = new bongiovi.ViewDotPlane();
	this._vSave      = new ViewSave();
	this._vSaveExtra = new ViewSaveExtra();
	this._vCopy      = new bongiovi.ViewCopy();
	this._vRender    = new ViewRender();
	this._vSim       = new ViewSimulation();


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
	var skipCount = Math.floor(params.skipCount);
	if(this.count % skipCount === 0) {
		this.updateFbo();
		this._vRender.tick();
		this.count = 0;
	}
	var percent = this.count / skipCount;

	this.count ++;
	GL.setViewport(0, 0, GL.width, GL.height);
	this._getSoundData();
	
	this._vAxis.render();
	this._vDotPlane.render();
	// gl.disable(gl.CULL_FACE);
	this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent, this._fboExtras.getTexture(), this.camera);
	// gl.enable(gl.CULL_FACE);

	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, 512, 512);
	this._vCopy.render(this._fboExtras.getTexture());
};



p._getSoundData = function() {
	if(this.analyser) {
		this.frequencies = this.analyser.getFrequencies();
	} else {
		return;
	}

	var f = this.analyser.getFrequencies();

	var sum = 0;

	for(var i=0; i<f.length; i++) {
		var index = i * 4;
		sum += f[i];
	}

	sum /= f.length;
	var threshold = 10;
	var maxSpeed = 2.0;

	if(sum > threshold) {
		this.sum += sum * 1.5;
		this.easeSum.value = Math.min(this.sum, maxSpeed) * .1;
	} else {
		this.easeSum.value = 0;
	}

	this.sum -= this.sum * .1;
	if(this.sum < 0) this.sum = 0;
};

p.resize = function() {
	var scale = 1.0;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>