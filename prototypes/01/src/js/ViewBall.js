// ViewBall.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewBall extends alfrid.View {

	constructor() {
		super(alfrid.ShaderLibs.generalVert, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(.5, 24);
	}


	render(position=[0,0,0],color=[1,0,0],scale=1.0, opacity=1.0) {
		this.shader.bind();
		this.shader.uniform("position", "uniform3fv", position);
		this.shader.uniform("color", "uniform3fv", color);
		this.shader.uniform("scale", "uniform3fv", [scale, scale, scale]);
		this.shader.uniform("opacity", "uniform1f", opacity);
		GL.draw(this.mesh);
	}

}


export default ViewBall;