// ViewSimulation.js

import alfrid from './libs/alfrid.js';

var glslify = require("glslify");

let GL = alfrid.GL;

class ViewSimulation extends alfrid.View {
	
	constructor() {
		
		super(alfrid.ShaderLibs.bigTriangleVert, glslify('../shaders/sim.frag'));
		this.time = Math.random() * 0xFF;
		
	}

	_init() {
		console.log('init');

		this.mesh = alfrid.Geom.bigTriangle();
	}


	render(texture) {
		this.time += .01;
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		this.shader.uniform("time", "uniform1f", this.time);
		this.shader.uniform("skipCount", "uniform1f", params.skipCount);
		this.shader.uniform("posOffset", "uniform1f", params.particles.posOffset);
		this.shader.uniform("decreaseRate", "uniform1f", params.particles.decreaseRate);
		this.shader.uniform("timeOffset", "uniform1f", params.particles.timeOffset);

		GL.draw(this.mesh);
	}
}


export default ViewSimulation;
