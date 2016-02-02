// ViewTree.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewTree extends alfrid.View {
	
	constructor() {
		super(glslify('../shaders/pbr.vert'), glslify('../shaders/pbr.frag'));
	}


	_init() {
		this._objLoader 	  = new alfrid.ObjLoader();
		this._objLoader.load('./assets/tree.obj', (mesh)=>this._onObjLoaded(mesh), false);
	}


	_onObjLoaded(mesh) {
		this.mesh = mesh;
	}


	render(textureRad, textureIrr) {
		if(!this.mesh) return;
		this.shader.bind();
		this.shader.uniform("uRadianceMap", "uniform1i", 0);
		this.shader.uniform("uIrradianceMap", "uniform1i", 1);
		textureRad.bind(0);
		textureIrr.bind(1);

		let roughness4 = Math.pow(params.roughness, 4.0);
		let grey = .52;
		this.shader.uniform("uBaseColor", "uniform3fv", [grey, grey, grey]);
		this.shader.uniform("uRoughness", "uniform1f", params.roughness);
		this.shader.uniform("uRoughness4", "uniform1f", roughness4);
		this.shader.uniform("uMetallic", "uniform1f", params.metallic);
		this.shader.uniform("uSpecular", "uniform1f", params.specular);

		this.shader.uniform("uExposure", "uniform1f", params.exposure);
		this.shader.uniform("uGamma", "uniform1f", params.gamma);
		this.shader.uniform("scale", "uniform1f", params.treeScale);

		GL.draw(this.mesh);
	}

}

export default ViewTree;
