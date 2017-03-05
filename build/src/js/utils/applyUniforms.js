// applyUniforms.js

const getUniformType = function(mValue) {
	if(!mValue.length) {
		return 'float';
	} else if(mValue.length == 2) {
		return 'vec2';
	} else if(mValue.length == 3) {
		return 'vec3';
	} else if(mValue.length == 4) {
		return 'vec4';
	}
}

const applyUniforms = function(mUniformObj, mShader, mBind=true) {
	if(mBind) { mShader.bind(); }

	for( let uniformName in mUniformObj ) {
		const uniformType = getUniformType(mUniformObj[uniformName]);
		mShader.uniform(uniformName, uniformType, mUniformObj[uniformName]);
	}
}


export default applyUniforms;