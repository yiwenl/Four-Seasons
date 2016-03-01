// ViewDome.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewDome extends alfrid.View {
	
	constructor() {
		super(glslify('../shaders/dome.vert'), glslify('../shaders/dome.frag'));
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(20, 36, false, true);

		this.shader.bind();
		let grey = .9;
		this.shader.uniform("color", "uniform3fv", [grey, grey, grey]);
		this.shader.uniform("opacity", "uniform1f", 1);
		this.shader.uniform("fogColor", "uniform3fv", params.fogColor);
	}


	render(lightPosition, textureGlacier, textureGradient) {
		this.shader.bind();
		this.shader.uniform("fogDistanceOffset", "uniform1f", params.fogDistanceOffset);
		this.shader.uniform("lightPosition", "uniform3fv", lightPosition);

		this.shader.uniform("textureGlacier", "uniform1i", 0);
		textureGlacier.bind(0);

		this.shader.uniform("textureGradient", "uniform1i", 1);
		textureGradient.bind(1);

		this.shader.uniform("blossom", "uniform1f", params.blossom);
		GL.draw(this.mesh);
	}


}

export default ViewDome;