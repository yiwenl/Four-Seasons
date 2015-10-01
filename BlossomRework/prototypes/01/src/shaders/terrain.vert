#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec2 uvOffset;
uniform float numTiles;
uniform float size;
uniform float height;

uniform sampler2D texture;

varying vec2 vTextureCoord;


vec3 getPosition(vec2 uv) {
	vec3 pos = vec3(0.0, 0.0, 0.0);
	pos.x = -size/2.0 + uv.x * size;
	pos.z = size/2.0 - uv.y * size;

	float h = texture2D(texture, uv).r * height-height*.5;
	pos.y += h;

	return pos;
}


float map(float value, float sx, float sy, float tx, float ty) {
	float p = (value - sx) / ( sy - sx);
	p = clamp(p, 0.0, 1.0);
	return tx + p * ( ty-tx );
}


void main(void) {
	vec2 uv       = aTextureCoord / numTiles + uvOffset;
	vec3 pos      = aVertexPosition;
	pos           = getPosition(uv);
	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	vTextureCoord = uv;
}