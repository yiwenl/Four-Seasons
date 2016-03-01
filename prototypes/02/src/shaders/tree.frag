// tree.frag


#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform vec3 lightPosition;
uniform sampler2D texture;

const vec3 UP = vec3(0.0, 1.0, 0.0);
const float PI = 3.141592657;

float angleBetween(vec3 a, vec3 b) {
	return acos(dot(a, b));
}

float contrast(float mValue, float mScale, float mMidPoint) {
	return clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);
}

float contrast(float mValue, float mScale) {
	return contrast(mValue,  mScale, .5);
}

vec3 contrast(vec3 mValue, float mScale, float mMidPoint) {
	return vec3( contrast(mValue.r, mScale, mMidPoint), contrast(mValue.g, mScale, mMidPoint), contrast(mValue.b, mScale, mMidPoint) );
}

vec3 contrast(vec3 mValue, float mScale) {
	return contrast(mValue, mScale, .5);
}


float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}

vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


void main(void) {
	vec3 ao      = texture2D(texture, vTextureCoord).rgb;
	ao = contrast(ao, 3.0, .75);
	float a      = angleBetween(vNormal, UP);
	a            = 1.0 - smoothstep(0.0, PI * .75, a);

	float _diffuse = diffuse(vNormal, lightPosition) * .5;
	gl_FragColor = vec4(vec3(a)+ao + _diffuse, 1.0);
}