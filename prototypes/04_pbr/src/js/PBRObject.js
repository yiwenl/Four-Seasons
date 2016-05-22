// PBRObject.js

class PBRObject {
	constructor(mMesh) {
		this._mesh = mMesh;

		this.baseColor = [1, 1, 1];
		this.roughness = 0.9;
		this.specular = 0.0;
		this.metallic = 0.0;

		this.position = [0, 0, 0];
		this.scale = [1, 1, 1];
		this.rotation = [0, 0, 0];

		this.bumpScale = 1.0;
		this.bumpSize = 0.0;

		this.colorMap;
		this.bumpMap;
		this.aoMap;

		this._init();
	}

	_init() {

	}


	get mesh() {
		return this._mesh;
	}
}


export default PBRObject;
