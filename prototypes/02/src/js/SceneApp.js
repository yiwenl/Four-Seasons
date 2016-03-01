// SceneApp.js
import alfrid from './libs/alfrid.js';
import ViewSave from './ViewSave';
import ViewSimulation from './ViewSimulation';
import ViewAddVel from './ViewAddVel';
import ViewPlanes from './ViewPlanes';
import ViewFloor from './ViewFloor';
import ViewDome from './ViewDome';
import ViewPost from './ViewPost';
import ViewTree from './ViewTree';
import ViewBall from './ViewBall';

let clusterfck = require("clusterfck");

let GL = alfrid.GL;;

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		// this.orbitalControl._rx.value = 0.0;
		// this.orbitalControl._rx.limit(0, .36);
		// this.orbitalControl.radius.setTo(10);
		// this.orbitalControl.radius.value = 8;
		// this.orbitalControl.radius.limit(1, 11);
		this.orbitalControl.center[1] = 3;
		this.orbitalControl.positionOffset[1] = -.5;

		this._count = 0;
		this._hasSaved = false;

		// this._lightPosition = [12.5, 25, -12.5];
		this._lightPosition = [-10.5, 30, 0.5];
		this.shadowMatrix  = mat4.create();
		this.cameraLight   = new alfrid.CameraPerspective();
		let fov            = Math.PI * .65;
		let near           = 1;
		let far            = 100;
		this.camera.setPerspective(fov, GL.aspectRatio, near, far);
		this.cameraLight.setPerspective(fov, GL.aspectRatio, near, far);
		this.cameraLight.lookAt(this._lightPosition, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
		mat4.multiply(this.shadowMatrix, this.cameraLight.projection, this.cameraLight.viewMatrix);
	}


	_initTextures() {
		console.log('Init textures');
		function getAsset(id) {
			for(var i=0; i<assets.length; i++) {
				if(id === assets[i].id) {
					return assets[i].file;
				}
			}
		}

		this._textureAO = new alfrid.GLTexture(getAsset('aomap'));

		//	FBOS
		const numParticles = params.numParticles;
		const o = {	minFilter:GL.NEAREST, magFilter:GL.NEAREST };
		const oLinear = {	minFilter:GL.LINEAR, magFilter:GL.LINEAR };

		this._fboCurrentPos  = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboTargetPos   = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboOriginalPos = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboCurrentVel  = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboTargetVel   = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboExtra       = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboRender      = new alfrid.FrameBuffer(GL.width, GL.height);
		this._fboShadowMap   = new alfrid.FrameBuffer(1024, 1024, oLinear);
	}
	

	_initViews() {
		console.log('Init Views');
		this._bCopy   = new alfrid.BatchCopy();
		
		this._vSim    = new ViewSimulation();
		this._vAddVel = new ViewAddVel();
		this._vFloor  = new ViewFloor();
		// this._vDome   = new ViewDome();
		this._vPlanes = new ViewPlanes();
		this._vPost   = new ViewPost();
		this._vTree   = new ViewTree();
		this._vBall   = new ViewBall();

	}


	_savePositions() {
		GL.setMatrices(this.cameraOrtho);
		this._vSave = new ViewSave(this._vTree.points);

		this._fboCurrentPos.bind();
		this._vSave.render(0);
		this._fboCurrentPos.unbind();

		this._fboExtra.bind();
		this._vSave.render(1);
		this._fboExtra.unbind();

		this._fboTargetPos.bind();
		this._bCopy.draw(this._fboCurrentPos.getTexture());
		this._fboTargetPos.unbind();

		this._fboOriginalPos.bind();
		this._bCopy.draw(this._fboCurrentPos.getTexture());
		this._fboOriginalPos.unbind();

		GL.setMatrices(this.camera);
		this._hasSaved = true;
	}


	updateFbo() {
		//	Update Velocity : bind target Velocity, render simulation with current velocity / current position
		this._fboTargetVel.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(this._fboCurrentVel.getTexture(), this._fboCurrentPos.getTexture(), this._fboExtra.getTexture());
		this._fboTargetVel.unbind();


		//	Update position : bind target Position, render addVel with current position / target velocity;
		this._fboTargetPos.bind();
		GL.clear(0, 0, 0, 1);
		this._vAddVel.render(this._fboCurrentPos.getTexture(), this._fboTargetVel.getTexture(), this._fboOriginalPos.getTexture());
		this._fboTargetPos.unbind();

		//	SWAPPING : PING PONG
		let tmpVel          = this._fboCurrentVel;
		this._fboCurrentVel = this._fboTargetVel;
		this._fboTargetVel  = tmpVel;

		let tmpPos          = this._fboCurrentPos;
		this._fboCurrentPos = this._fboTargetPos;
		this._fboTargetPos  = tmpPos;

	}


	render() {
		let grey = .9;
		GL.clear(grey, grey, grey, 1.0);
		if(this._vTree.isReady && !this._hasSaved) {	this._savePositions(); }
		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		let p = this._count/params.skipCount;

		// this.orbitalControl._ry.value += -.01;
		let num = params.numSlices * params.numSlices;


		//	SHADOW MAP
		this._fboShadowMap.bind();
		GL.clear(1, 1, 1, 1);
		GL.setMatrices(this.cameraLight);
		for (let i=0; i<num; i++) {
			this._vPlanes.render(this._fboTargetPos.getTexture(), this._fboCurrentPos.getTexture(), this._fboExtra.getTexture(), p, i);
		}
		this._vTree.render(this._textureAO);
		this._fboShadowMap.unbind();


		GL.setMatrices(this.camera);
		
		for (let i=0; i<num; i++) {
			this._vPlanes.render(this._fboTargetPos.getTexture(), this._fboCurrentPos.getTexture(), this._fboExtra.getTexture(), p, i, this.shadowMatrix, this._lightPosition, this._fboShadowMap.getDepthTexture());
			// this._vPlanes.render(this._fboTargetPos.getTexture(), this._fboCurrentPos.getTexture(), this._fboExtra.getTexture(), p, i);
		}
		
		this._vFloor.render(this.shadowMatrix, this._lightPosition, this._fboShadowMap.getDepthTexture());
		this._vTree.render(this._textureAO);
		this._vBall.render(this._lightPosition, 1, [1, .75, 0.5], 1);


		GL.disable(GL.DEPTH_TEST);
		let size = 200;
		GL.viewport(0, 0, size, size);
		this._bCopy.draw(this._fboShadowMap.getDepthTexture());
		GL.enable(GL.DEPTH_TEST);
	}


	resize() {
		console.log('Resizing');
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);

		this._fboRender = new alfrid.FrameBuffer(GL.width, GL.height);
	}

}


export default SceneApp;