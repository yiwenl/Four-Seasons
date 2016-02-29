// ViewSave.js

import alfrid from './libs/alfrid.js';

let glslify = require("glslify");

let random = function(min, max) { return min + Math.random() * (max - min);	}

let GL = alfrid.GL;

class ViewSave extends alfrid.View {
	constructor(points) {

		super(glslify('../shaders/save.vert'), glslify('../shaders/save.frag') );
		this._points = points;
		this._save();
	}


	_save() {
		//	SAVE FOR POSITION
		//	SAVE FOR RANDOM

		let positions = [];
		let coords = [];
		let indices = []; 
		let extras = [];
		let speedLimit = [];
		let count = 0;

		let numParticles = params.numParticles;
		let totalParticles = numParticles * numParticles;
		let ux, uy;
		let speedScale = .0005 * params.skipCount;
		const range = .15;

		let random = function(min, max) { return min + Math.random() * (max - min);	}

		function getRandomVertex(points) {
			let index = Math.floor(Math.random() * points.length);
			let v = points[index];

			return [v[0]*2+random(-range, range), v[1]*2-2.5+random(-range, range), v[2]*2+random(-range, range)];
		}

		for(let j=0; j<numParticles; j++) {
			for(let i=0; i<numParticles; i++) {
				let p = getRandomVertex(this._points)
				positions.push(p);

				ux = i/numParticles*2.0-1.0+.5/numParticles;
				uy = j/numParticles*2.0-1.0+.5/numParticles;

				extras.push([Math.random(), Math.random(), Math.random()]);
				speedLimit.push([random(1, 3)*speedScale, random(5, 18)*speedScale, 0.0]);
				coords.push([ux, uy]);
				indices.push(count);
				count ++;

			}
		}


		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);

		this.meshExtra = new alfrid.Mesh(GL.POINTS);
		this.meshExtra.bufferVertex(extras);
		this.meshExtra.bufferTexCoords(coords);
		this.meshExtra.bufferIndices(indices);

		this.meshSpeed = new alfrid.Mesh(GL.POINTS);
		this.meshSpeed.bufferVertex(speedLimit);
		this.meshSpeed.bufferTexCoords(coords);
		this.meshSpeed.bufferIndices(indices);
	}


	render(state=0) {

		this.shader.bind();
		if(state == 0) {
			GL.draw(this.mesh);
		} else if(state == 1) {
			GL.draw(this.meshExtra);
		} else {
			GL.draw(this.meshSpeed);
		}
		
		
	}

}


export default ViewSave;
