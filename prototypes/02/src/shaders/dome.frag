// dome.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform vec3 color;
uniform vec3 fogColor;
uniform float opacity;
uniform float fogDistanceOffset;

#define FOG_DENSITY 0.05

float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

void main(void) {
    float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fogFactorExp2(fogDistance*fogDistanceOffset, FOG_DENSITY);

	vec3 finalColor = color;
	float t = abs(vTextureCoord.y - .5) / .5;
	t = mix(t, 1.0, .8);
	finalColor *= t;

	finalColor = mix(finalColor, fogColor/255.0, fogAmount);
	gl_FragColor = vec4(finalColor, opacity); 
}