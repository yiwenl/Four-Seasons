// SceneApp.js

import alfrid , { Scene, GL } from 'alfrid';
import PBREnvironment from './PBREnvironment';
import PBRObject from './PBRObject';
const RAD = Math.PI/180;

window.getAsset = function(id) {
	for(var i=0; i<assets.length; i++) {
		if(id === assets[i].id) {
			return assets[i].file;
		}
	}
}


class SceneApp extends alfrid.Scene {
	constructor() {
		super();

		GL.enableAlphaBlending();
		this.camera.setPerspective(70 * RAD, GL.aspectRatio, .1, 50);
		let v = vec3.fromValues(-3, .37, -2);
		this.orbitalControl.radius.setTo(5);
		this.orbitalControl.radius.value = 4.02;

		this.orbitalControl.center[1] = 1.35;
		this.orbitalControl.positionOffset[1] = 0.25;
		this.orbitalControl.rx.value = .1;
		this.orbitalControl.rx.limit(.1, .15);
		this.orbitalControl.lockZoom(true);

		const meshTree = alfrid.ObjLoader.parse(getAsset('obj_tree'));
		const meshTerrain = alfrid.ObjLoader.parse(getAsset('obj_terrain'));
		const grey = 0.25;

		this._pbrEnv = new PBREnvironment(this._textureRad, this._textureIrr, 5, 2.2);
		this._pTree = new PBRObject(meshTree, {aoMap:new alfrid.GLTexture(getAsset('aoTree'))});
		this._pTerrain = new PBRObject(meshTerrain, {
			aoMap: new alfrid.GLTexture(getAsset('aoTerrain')),
			bumpMap: this._textureNoise,
			metallic: .1,
			roughness:0.94,
			bumpScale: 10.0,
			bumpSize: 0.5,
			baseColor: [grey, grey, grey],
			scale: [2, 1, 2],
		});

		let fTerrain = gui.addFolder('Terrain');
		fTerrain.add(this._pTerrain, 'roughness', 0, .9);
		fTerrain.add(this._pTerrain, 'specular', 0, 1);
		fTerrain.add(this._pTerrain, 'metallic', 0, 1);
		fTerrain.open();

		this._pbrEnv.addChild(this._pTree);
		this._pbrEnv.addChild(this._pTerrain);
	}

	_initTextures() {
		console.log('init textures');

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

		this._textureNoise = new alfrid.GLTexture(getAsset('noise'));
	}


	_initViews() {
		console.log('init views');
		
		this._bCopy = new alfrid.BatchCopy();
		this._bBall = new alfrid.BatchBall();
		this._bSkybox = new alfrid.BatchSkybox();
	}


	render() {
		params.globalTime += 0.01;
		GL.clear(0, 0, 0, 0);

		this._bSkybox.draw(this._textureRad);
		this._pbrEnv.render();
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;