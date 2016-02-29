// ViewPetals.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewPetals extends alfrid.View {
	
	constructor() {
		super(glslify('../shaders/petal.vert'), glslify('../shaders/petal.frag'));
		this.time = 0;
	}


	_init() {
		let positions    = [];
		let coords       = [];
		let posCoords    = [];
		let quat    	 = [];
		let indices      = []; 
		let extra		 = [];
		let normals 	 = [];
		let count        = 0;
		let numParticles = params.numParticles;
		let ux, uy;

		function getRandomRotation() {
			let v = vec3.fromValues(random(-1, 1), random(-1, 1), random(-1, 1));
			vec3.normalize(v, v);
			return v;
		}

		for(let j=0; j<numParticles; j++) {
			for(let i=0; i<numParticles; i++) {

				let axis = getRandomRotation();
				let q    = [axis[0], axis[1], axis[2], Math.random() * Math.PI * 2.0];
				let rand = [Math.random(), Math.random(), Math.random()];
				
				ux       = i/numParticles - .5/numParticles;
				uy       = j/numParticles - .5/numParticles;


				positions.push([-1, -1, 0]);
				positions.push([ 1, -1, 0]);
				positions.push([ 1,  1, 0]);
				positions.push([-1,  1, 0]);

				coords.push([0, 0]);
				coords.push([1, 0]);
				coords.push([1, 1]);
				coords.push([0, 1]);

				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);

				posCoords.push([ux, uy]);
				posCoords.push([ux, uy]);
				posCoords.push([ux, uy]);
				posCoords.push([ux, uy]);

				quat.push(q);
				quat.push(q);
				quat.push(q);
				quat.push(q);

				extra.push(rand);
				extra.push(rand);
				extra.push(rand);
				extra.push(rand);

				indices.push(count*4 + 0);
				indices.push(count*4 + 1);
				indices.push(count*4 + 2);
				indices.push(count*4 + 0);
				indices.push(count*4 + 2);
				indices.push(count*4 + 3);

				count ++;

				positions.push([-1, -1, 0]);
				positions.push([ 1, -1, 0]);
				positions.push([ 1,  1, 0]);
				positions.push([-1,  1, 0]);

				coords.push([0, 0]);
				coords.push([1, 0]);
				coords.push([1, 1]);
				coords.push([0, 1]);

				normals.push([0, 0, -1]);
				normals.push([0, 0, -1]);
				normals.push([0, 0, -1]);
				normals.push([0, 0, -1]);

				posCoords.push([ux, uy]);
				posCoords.push([ux, uy]);
				posCoords.push([ux, uy]);
				posCoords.push([ux, uy]);

				quat.push(q);
				quat.push(q);
				quat.push(q);
				quat.push(q);

				extra.push(rand);
				extra.push(rand);
				extra.push(rand);
				extra.push(rand);

				indices.push(count*4 + 3);
				indices.push(count*4 + 2);
				indices.push(count*4 + 0);
				indices.push(count*4 + 2);
				indices.push(count*4 + 1);
				indices.push(count*4 + 0);

				count ++;
			}
		}

		this.mesh = new alfrid.Mesh(GL.Triangles);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferNormal(normals);
		this.mesh.bufferData(posCoords, 'aPosCoord', 2);
		this.mesh.bufferData(quat, 'aRotation', 4);
		this.mesh.bufferData(extra, 'aExtra', 3);
		this.mesh.bufferIndices(indices);
	}


	render(texture, textureNext, percent, texturePetal) {
		this.time += .04;
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		this.shader.uniform("textureNext", "uniform1i", 1);
		textureNext.bind(1);
		this.shader.uniform("texturePetal", "uniform1i", 2);
		texturePetal.bind(2);
		this.shader.uniform("percent", "uniform1f", percent);

		this.shader.uniform("petalSize", "uniform1f", .05);
		this.shader.uniform("time", "uniform1f", this.time);

		GL.draw(this.mesh);
	}


}

export default ViewPetals;