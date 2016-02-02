// ViewSave.js

import alfrid from './libs/alfrid.js';

let glslify = require("glslify");

let random = function(min, max) { return min + Math.random() * (max - min);	}

let GL;

class ViewSave extends alfrid.View {
	constructor() {

		GL = alfrid.GL;

		super(glslify('../shaders/save.vert'), glslify('../shaders/save.frag') );

	}


	_init() {
	}


	_initMesh(vertices) {
		let positions = [];
		let coords = [];
		let indices = []; 
		let count = 0;

		let numParticles = params.numParticles;
		let totalParticles = numParticles * numParticles;
		let ux, uy;
		let range = 1.5;


		function getRandomPos() {
			let index;
			let p;
			const threshold = .15;

			do {
				index = Math.floor(Math.random() * vertices.length);
				p = vertices[index].concat();
					
			} while (p[1] < threshold);
			

			let range = 2.0;
			p[0] *= params.treeScale + random(-range, range);
			p[1] *= params.treeScale + random(-range, range);
			p[2] *= params.treeScale + random(-range, range);	

			return p;
		}

		for(let j=0; j<numParticles; j++) {
			for(let i=0; i<numParticles; i++) {
				let p = getRandomPos();
				// positions.push([random(-range, range), random(-range, range), random(-range, range)]);
				positions.push(p);

				ux = i/numParticles-1.0 - .5/numParticles;
				uy = j/numParticles-1.0 - .5/numParticles;
				coords.push([ux, uy]);
				indices.push(count);
				count ++;


				positions.push([Math.random(), Math.random(), Math.random()]);
				coords.push([ux, uy+1.0]);
				indices.push(count);
				count ++;

				positions.push(p);
				coords.push([ux+1.0, uy+1.0]);
				indices.push(count);
				count ++;

			}
		}


		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);
	}


	render(vertices) {

		this._initMesh(vertices);

		this.shader.bind();
		GL.draw(this.mesh);
		
	}

}


export default ViewSave;
