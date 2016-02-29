// ViewTree.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewTree extends alfrid.View {
	
	constructor() {
		super(glslify('../shaders/pbr.vert'), glslify('../shaders/pbr.frag'));
		this.color = [117/255*.135, 105/255*.135, 109/255*.135];

		this.roughness = 1.0;
		this.specular = 0.1;
		this.metallic = 0;

		let f = gui.addFolder('tree');
		f.add(this, 'roughness', 0, 1);
		f.add(this, 'specular', 0, 1);
		f.add(this, 'metallic', 0, 1);
		f.open();
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

		let roughness4 = Math.pow(this.roughness, 4.0);
		this.shader.uniform("uBaseColor", "uniform3fv", this.color);
		this.shader.uniform("uRoughness", "uniform1f", this.roughness);
		this.shader.uniform("uRoughness4", "uniform1f", roughness4);
		this.shader.uniform("uMetallic", "uniform1f", this.metallic);
		this.shader.uniform("uSpecular", "uniform1f", this.specular);

		this.shader.uniform("uExposure", "uniform1f", params.exposure);
		this.shader.uniform("uGamma", "uniform1f", params.gamma);
		this.shader.uniform("scale", "uniform1f", params.treeScale);

		GL.draw(this.mesh);
	}

}

export default ViewTree;
