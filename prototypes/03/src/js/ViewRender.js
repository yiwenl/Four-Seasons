// ViewRender.js

import alfrid from 'alfrid';
const vsRender = require("../shaders/render.vert");
const fsRender = require("../shaders/render.frag");
let GL = alfrid.GL;

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vsRender, fsRender);
		
		// gui.add(this, 'mid', 0.9, 1);
		// gui.add(this, 'range', 0.01, 0.1);
	}


	_init() {
		let positions    = [];
		let coords       = [];
		let indices      = []; 
		let count        = 0;
		let numParticles = params.numParticles;
		let ux, uy;

		for(let j=0; j<numParticles; j++) {
			for(let i=0; i<numParticles; i++) {
				ux = i/numParticles;
				uy = j/numParticles;
				positions.push([ux, uy, 0]);
				indices.push(count);
				count ++;

			}
		}

		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndices(indices);

		this.mid = .93;
		this.range = 0.05;

		this.shader.bind();
		this.shader.uniform("textureCurr", "uniform1i", 0);
		this.shader.uniform("textureNext", "uniform1i", 1);
		this.shader.uniform("textureExtra", "uniform1i", 2);
		this.shader.uniform("textureLife", "uniform1i", 3);

		this.shader.uniform("mid", "float", this.mid);
		this.shader.uniform("range", "float", this.range);
	}


	render(textureCurr, textureNext, p, textureExtra, textureLife) {
		this.shader.bind();
		textureCurr.bind(0);
		textureNext.bind(1);
		textureExtra.bind(2);
		textureLife.bind(3);

		this.shader.uniform("percent", "float", p);
		this.shader.uniform("time", "float", params.time);
		
		GL.draw(this.mesh);
	}


}

export default ViewRender;