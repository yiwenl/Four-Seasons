// ViewTree.js

import alfrid from './libs/alfrid.js';
let GL = alfrid.GL;
var glslify = require("glslify");

class ViewTree extends alfrid.View {
	
	constructor() {
		super(glslify('../shaders/tree.vert'), glslify('../shaders/tree.frag'));
	}


	_init() {
		// this.mesh;
		this._loader = new alfrid.ObjLoader();
		this._loader.load('assets/tree.obj', (mesh)=>this._onObjLoaded(mesh), false);
	}


	_onObjLoaded(mesh) {
		this.mesh = mesh;
		const UP = vec3.fromValues(0, 1, 0);

		function angleTween(a, b) {
			return Math.acos(vec3.dot(a, b)) * 180/Math.PI;
		}	


		this._points = [];
		let v = vec3.create();
		let normals = this.mesh.normals;
		let vertices = this.mesh.vertices;
		for(let i=0; i<normals.length; i++) {
			v[0] = normals[i][0];
			v[1] = normals[i][1];
			v[2] = normals[i][2];

			if(angleTween(v, UP) < 90 && vertices[i][1] > 1) {
				this._points.push(vec3.clone(vertices[i]));	
			}
			
		}

	}


	render(texture) {
		if(!this.mesh) {
			return;
		}
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		GL.draw(this.mesh);
	}

	//	GETTER / SETTER

	get isReady() {
		return this.mesh !== undefined;
	}

	get points() {
		return this._points;
	}
}

export default ViewTree;