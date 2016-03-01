// ViewPlanes.js


import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
let glslify = require("glslify");

class ViewPlanes extends alfrid.View {
	
	constructor() {
		super(glslify('../shaders/planes.vert'), glslify('../shaders/planes.frag'));
		this.shader.id = 'planes';
		// this.shaderShadow = new alfrid.GLShader( glslify('../shaders/particlesShadow.vert'), glslify('../shaders/particlesShadow.frag') );
		this.shaderShadow = new alfrid.GLShader( glslify('../shaders/particlesShadow.vert'), glslify('../shaders/particlesShadow.frag') );
		// this.shaderShadow = new alfrid.GLShader( glslify('../shaders/planes.vert'), glslify('../shaders/planes.frag') );
		this.shaderShadow.id = 'shadowParticles';
	}


	_init() {

		let num          = params.numParticles / params.numSlices;
		let numParticles = params.numParticles;
		let positions    = [];
		let coords       = [];
		let pointCoords  = [];
		let indices      = [];
		let count        = 0;
		let size         = 0.03;

		for(let j=0; j<num; j++) {
			for(let i=0; i<num; i++) {
				positions.push([-size,  size, 0]);
				positions.push([ size,  size, 0]);
				positions.push([ size, -size, 0]);
				positions.push([-size, -size, 0]);

				coords.push([i/num, j/num]);
				coords.push([i/num, j/num]);
				coords.push([i/num, j/num]);
				coords.push([i/num, j/num]);

				pointCoords.push([0, 0]);
				pointCoords.push([1, 0]);
				pointCoords.push([1, 1]);
				pointCoords.push([0, 1]);

				indices.push(count*4 + 3);
				indices.push(count*4 + 2);
				indices.push(count*4 + 0);
				indices.push(count*4 + 2);
				indices.push(count*4 + 1);
				indices.push(count*4 + 0);

				count ++;
			}
		}

		this.mesh = new alfrid.Mesh(GL.TRIANGLES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);
		this.mesh.bufferData(pointCoords, 'aPointCoord', 2);
	}


	render(texture, textureNext, textureExtra, percent, index, shadowMatrix, lightPosition, textureDepth) {
		let shader = shadowMatrix ? this.shaderShadow : this.shader;
		let x = (index % params.numSlices) / params.numSlices
		let y = Math.floor(index / params.numSlices) / params.numSlices;

		shader.bind();
		shader.uniform("texture", "uniform1i", 0);
		shader.uniform("textureNext", "uniform1i", 1);
		shader.uniform("textureExtra", "uniform1i", 2);
		shader.uniform("color", "uniform3fv", [1, .8, .8]);
		shader.uniform("numSlices", "uniform1f", params.numSlices);
		texture.bind(0);
		textureNext.bind(1);
		textureExtra.bind(2);
		shader.uniform("percent", "uniform1f", percent);
		shader.uniform("uvIndex", "uniform1f", index);
		shader.uniform("uvOffset", "uniform2fv", [x, y]);


		if(shadowMatrix) {
			shader.uniform("lightPosition", "uniform3fv", lightPosition);
			shader.uniform("uShadowMatrix", "uniformMatrix4fv", shadowMatrix);
			shader.uniform("textureDepth", "uniform1i", 3);
			textureDepth.bind(3);	
		}
		GL.draw(this.mesh);
	}




}

export default ViewPlanes;