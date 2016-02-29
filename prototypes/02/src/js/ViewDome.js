// ViewDome.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewDome extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(11, 30, false, true);

		this.shader.bind();
		let grey = .938;
		this.shader.uniform("color", "uniform3fv", [grey, grey, grey]);
		this.shader.uniform("opacity", "uniform1f", 1);
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewDome;