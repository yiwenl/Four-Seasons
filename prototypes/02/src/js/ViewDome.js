// ViewDome.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewDome extends alfrid.View {
	
	constructor() {
		super(null, glslify('../shaders/dome.frag'));
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(20, 36, false, true);

		this.shader.bind();
		let grey = .9;
		this.shader.uniform("color", "uniform3fv", [grey, grey, grey]);
		this.shader.uniform("opacity", "uniform1f", 1);
		this.shader.uniform("fogColor", "uniform3fv", params.fogColor);
	}


	render() {
		this.shader.bind();
		this.shader.uniform("fogDistanceOffset", "uniform1f", params.fogDistanceOffset);
		GL.draw(this.mesh);
	}


}

export default ViewDome;