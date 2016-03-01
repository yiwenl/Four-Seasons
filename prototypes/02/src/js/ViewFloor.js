// ViewFloor.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewFloor extends alfrid.View {
	
	constructor() {
		// super(null, alfrid.ShaderLibs.simpleColorFrag);
		super(glslify('../shaders/floorShadow.vert'), glslify('../shaders/floorShadow.frag'));
	}


	_init() {
		const offset = .16;

		let positions = [];
		let coords    = [];
		let indices   = []; 
		let normals   = [];
		let count     = 0;
		let numSeg    = 50;
		let size      = 40;


		function leng(x, y) {
			return Math.sqrt(x*x + y*y);
		}

		function getPos(i, j, y = 0) {
			let x = (i/numSeg-.5) * size;
			let z = (j/numSeg-.5) * size;
			let p = leng(x, z) / size;
			if(p > 1) p = 1;
			p = 1.0 - p;
			// p = Math.cos(p * Math.PI * 2.0);

			let n = Perlin.noise(x*offset, 0, z*offset) * p;

			return [x, y+n*2.20, z];
		}


		function getNormal(i, j) {
			let p0 = vec3.clone(getPos(i, j));
			let p1 = vec3.clone(getPos(i+1, j));
			let p2 = vec3.clone(getPos(i, j+1));

			let v0 = vec3.create();
			let v1 = vec3.create();
			vec3.sub(v0, p1, p0);
			vec3.sub(v1, p2, p0);

			let n = vec3.create();
			vec3.cross(n, v1, v0);
			vec3.normalize(n, n);

			return n;
		}


		let y = -3;

		for(let j=0; j<numSeg; j++) {
			for(let i=0; i<numSeg; i++) {
				positions.push( getPos(i, j+1, y));
				positions.push( getPos(i+1, j+1, y));
				positions.push( getPos(i+1, j, y));
				positions.push( getPos(i, j, y));

				normals.push( getNormal(i, j+1, y));
				normals.push( getNormal(i+1, j+1, y));
				normals.push( getNormal(i+1, j, y));
				normals.push( getNormal(i, j, y));

				coords.push([i/numSeg, (j+1)/numSeg]);
				coords.push([(i+1)/numSeg, (j+1)/numSeg]);
				coords.push([(i+1)/numSeg, j/numSeg]);
				coords.push([i/numSeg, j/numSeg]);

				indices.push(count * 4 + 0);
				indices.push(count * 4 + 1);
				indices.push(count * 4 + 2);
				indices.push(count * 4 + 0);
				indices.push(count * 4 + 2);
				indices.push(count * 4 + 3);

				count ++;
			}
		}

		this.mesh = new alfrid.Mesh(GL.TRIANGLES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);
		this.mesh.bufferNormal(normals);

		this.shader.bind();
		let grey = .928;
		this.shader.uniform("color", "uniform3fv", [grey, grey, grey+.01]);
		this.shader.uniform("fogColor", "uniform3fv", params.fogColor);
		this.shader.uniform("opacity", "uniform1f", 1);
	}


	render(shadowMatrix, lightPosition, textureDepth) {
		this.shader.bind();
		this.shader.uniform("fogDistanceOffset", "uniform1f", params.fogDistanceOffset);
		this.shader.uniform("lightPosition", "uniform3fv", lightPosition);
		this.shader.uniform("uShadowMatrix", "uniformMatrix4fv", shadowMatrix);
		this.shader.uniform("textureDepth", "uniform1i", 0);
		textureDepth.bind(0);	
		GL.draw(this.mesh);
	}


}

export default ViewFloor;