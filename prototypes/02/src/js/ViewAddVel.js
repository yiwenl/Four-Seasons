// ViewAddVel.js


import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewAddVel extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, glslify('../shaders/addvel.frag'));
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform("texturePos", "uniform1i", 0);
		this.shader.uniform("textureVel", "uniform1i", 1);
		this.shader.uniform("textureOrg", "uniform1i", 2);
	}


	render(texturePos, textureVel, textureOrg) {
		this.shader.bind();

		texturePos.bind(0);
		textureVel.bind(1);
		textureOrg.bind(2);

		GL.draw(this.mesh);
	}


}

export default ViewAddVel;