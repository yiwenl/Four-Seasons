// PBREnvironment.js

import alfrid, { GL, GLTexture } from 'alfrid';
const vs = require('../shaders/pbr.vert');
const fs = require('../shaders/pbr.frag');

class PBREnvironment {
	constructor(mTextureRad, mTextureIrr, mExposure=1, mGamma=2.2) {
		this._textureRad = mTextureRad;
		this._textureIrr = mTextureIrr;
		this.exporsure = mExposure;
		this.gamma = mGamma;
		this.envMapOffset = 0.5;
		this.saturationBeforeEnvMap = 0.0;

		this._init();
	}

	_init() {
		this._children = [];
		this.shader = new alfrid.GLShader(vs, fs);
		this.shader.bind();
		this.shader.uniform("uColorMap", "uniform1i", 0);
		this.shader.uniform("uAoMap", "uniform1i", 1);
		this.shader.uniform("uBumpMap", "uniform1i", 2);
		this.shader.uniform("uEnvMap", "uniform1i", 3);
		this.shader.uniform("uRadianceMap", "uniform1i", 4);
		this.shader.uniform("uIrradianceMap", "uniform1i", 5);

		this._textureEnvmap = new alfrid.GLTexture(getAsset('envmap'));

		this._textureEnvmap.bind(3);
		this._textureRad.bind(4);
		this._textureIrr.bind(5);

		gui.add(this, 'envMapOffset', 0, 1);
		gui.add(this, 'saturationBeforeEnvMap', 0, 1);
	}


	addChild(child) {
		this._children.push(child);
	}


	render() {
		this.shader.bind();
		this._children.map( (child, i)=> {
			if(child.colorMap) {
				child.colorMap.bind(0);
			} else {
				GLTexture.whiteTexture().bind(0);
			}

			if(child.aoMap) {
				child.aoMap.bind(1);
			} else {
				GLTexture.whiteTexture().bind(1);
			}

			if(child.bumpMap) {
				child.bumpMap.bind(2);
			} else {
				GLTexture.greyTexture().bind(2);
			}

			this.shader.uniform("uRoughness", "float", child.roughness);
			this.shader.uniform("uSpecular", "float", child.specular);
			this.shader.uniform("uMetallic", "float", child.metallic);
			this.shader.uniform("uBaseColor", "vec3", child.baseColor);

			this.shader.uniform("uPosition", "vec3", child.position);
			this.shader.uniform("uScale", "vec3", child.scale);
			this.shader.uniform("uRotation", "vec3", child.rotation);

			this.shader.uniform("uBumpSize", "float", child.bumpSize);
			this.shader.uniform("uBumpScale", "float", child.bumpScale);

			this.shader.uniform("uExposure", "float", this.exporsure);
			this.shader.uniform("uGamma", "float", this.gamma);
			this.shader.uniform("uEnvOffset", "float", this.envMapOffset);
			this.shader.uniform("uSaturation", "float", this.saturationBeforeEnvMap);

			GL.draw(child.mesh);
		});

	}

}

export default PBREnvironment;
