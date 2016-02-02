// SceneApp.js
import alfrid from './libs/alfrid.js';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSimulation from './ViewSimulation';
import ViewSkybox from './ViewSkybox';
import ViewTree from './ViewTree';


let GL;

class SceneApp extends alfrid.Scene {
	constructor() {
		GL = alfrid.GL;
		GL.enableAlphaBlending();
		super();

		this.orbitalControl._rx.value = .3;
		this._count = 0;
		this._hasSaved = false;

		this.cameraSkybox = new alfrid.CameraPerspective();
		this.camera.setPerspective(90 * Math.PI/180, GL.aspectRatio, .1, 1000);
		this.cameraSkybox.setPerspective(90 * Math.PI/180, GL.aspectRatio, .1, 1000);
		let ctrl = new alfrid.OrbitalControl(this.cameraSkybox, window, 1.1);
		ctrl.lockZoom(true);

		ctrl.center[1] = this.orbitalControl.center[1] = 3;
	}


	_initTextures() {
		console.log('Init textures');

		//	FBOS
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST
		}
		this._fboCurrent = new alfrid.FrameBuffer(numParticles*2, numParticles*2, o);
		this._fboTarget  = new alfrid.FrameBuffer(numParticles*2, numParticles*2, o);

		function getAsset(id) {
			for(var i=0; i<assets.length; i++) {
				if(id === assets[i].id) {
					return assets[i].file;
				}
			}
		}

		let irr_posx = alfrid.HDRLoader.parse(getAsset('irr_posx'))
		let irr_negx = alfrid.HDRLoader.parse(getAsset('irr_negx'))
		let irr_posy = alfrid.HDRLoader.parse(getAsset('irr_posy'))
		let irr_negy = alfrid.HDRLoader.parse(getAsset('irr_negy'))
		let irr_posz = alfrid.HDRLoader.parse(getAsset('irr_posz'))
		let irr_negz = alfrid.HDRLoader.parse(getAsset('irr_negz'))

		this._textureIrr = new alfrid.GLCubeTexture([irr_posx, irr_negx, irr_posy, irr_negy, irr_posz, irr_negz]);

		let rad_posx = alfrid.HDRLoader.parse(getAsset('rad_posx'))
		let rad_negx = alfrid.HDRLoader.parse(getAsset('rad_negx'))
		let rad_posy = alfrid.HDRLoader.parse(getAsset('rad_posy'))
		let rad_negy = alfrid.HDRLoader.parse(getAsset('rad_negy'))
		let rad_posz = alfrid.HDRLoader.parse(getAsset('rad_posz'))
		let rad_negz = alfrid.HDRLoader.parse(getAsset('rad_negz'))

		this._textureRad = new alfrid.GLCubeTexture([rad_posx, rad_negx, rad_posy, rad_negy, rad_posz, rad_negz]);

		this._textureGradient = new alfrid.GLCubeTexture([getAsset('posx'), getAsset('negx'), getAsset('posy'), getAsset('negy'), getAsset('posz'), getAsset('negz')]);
	}
	

	_initViews() {
		console.log('Init Views');
		this._bAxis      = new alfrid.BatchAxis();
		this._bDotsPlane = new alfrid.BatchDotsPlane();
		this._bCopy 	 = new alfrid.BatchCopy();

		this._vRender	 = new ViewRender();
		this._vSim		 = new ViewSimulation();
		this._vSkybox 	 = new ViewSkybox();
		this._vTree 	 = new ViewTree();

		//	SAVE INIT POSITIONS
		this._vSave = new ViewSave();
		
	}


	_generateParticles(vertices) {
		GL.setMatrices(this.cameraOrtho);

		this._fboCurrent.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render(vertices);
		this._fboCurrent.unbind();

		GL.setMatrices(this.camera);
	}


	updateFbo() {
		GL.setMatrices(this.cameraOrtho);

		this._fboTarget.bind();
		GL.clear(0, 0, 0, 0);
		this._vSim.render(this._fboCurrent.getTexture());
		this._fboTarget.unbind();
		GL.viewport(0, 0, GL.width, GL.height);
		GL.setMatrices(this.camera);

		//	PING PONG
		var tmp = this._fboTarget;
		this._fboTarget = this._fboCurrent;
		this._fboCurrent = tmp;
	}


	render() {
		if(!this._vTree.mesh) {	return;	}
		if(!this._hasSaved) {
			let vertices = [];
			if(this._vTree.mesh.length) {
				for(let i=0; i<this._vTree.mesh.length; i++) {
					let m = this._vTree.mesh[i];
					vertices = vertices.concat(m.vertices.concat());
				}
			} else {
				vertices = this._vTree.mesh.vertices.concat();
			}

			this._generateParticles(vertices);
			this._hasSaved = true;
		}
		if(document.body.classList.contains('isLoading')) {	document.body.classList.remove('isLoading');	}

		let p = 0;

		if(this._count % params.skipCount === 0) {
			this._count = 0;
			this.updateFbo();
		}
		p = this._count / params.skipCount;
		this._count ++;

		// this.orbitalControl._ry.value += -.01;
		

		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);
		this._bAxis.draw();
		this._bDotsPlane.draw();

		this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), p);
		this._vTree.render(this._textureRad, this._textureIrr);

		// GL.setMatrices(this.cameraSkybox);
		this._vSkybox.render(this._textureGradient);
	}
}


export default SceneApp;