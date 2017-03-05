// ViewTree.js

import alfrid, { GL } from 'alfrid';

import Assets from './Assets';
import applyUniforms from './utils/applyUniforms';
import vs from 'shaders/pbr.vert';
import fs from 'shaders/pbr.frag';

class ViewTree extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.shaderCopy = new alfrid.GLShader(vs, alfrid.ShaderLibs.copyFrag);
	}


	_init() {
		this.mesh = Assets.get('tree');

		this.roughness = 1;
		this.specular = 0;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];
		
		this._textureAO = Assets.get('aoTree');

		this._uniformObj = {
			uRoughness:1,
			uSpecular:0,
			uMetallic:0,
			uBaseColor:[1, 1, 1]
		}


		gui.add(this._uniformObj, 'uRoughness', 0, 1);
		gui.add(this._uniformObj, 'uSpecular', 0, 1);
		gui.add(this._uniformObj, 'uMetallic', 0, 1);

	}


	render(textureRad, textureIrr) {
		/*
		this.shaderCopy.bind();
		this.shaderCopy.uniform("texture", "uniform1i", 0);
		this._textureAO.bind(0);
		GL.draw(this.mesh);

		if(Math.random() > .99) {
			
		}

		*/
		

		//*/
		this.shader.bind();

		applyUniforms(this._uniformObj, this.shader);	

		this.shader.uniform('uAoMap', 'uniform1i', 0);
		this.shader.uniform('uRadianceMap', 'uniform1i', 1);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 2);
		this._textureAO.bind(0);
		textureRad.bind(1);
		textureIrr.bind(2);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);
		//*/
	}


}

export default ViewTree;