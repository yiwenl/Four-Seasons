// dome.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
uniform vec3 color;
uniform vec3 fogColor;
uniform vec3 lightPosition;
uniform float opacity;
uniform float fogDistanceOffset;
uniform float blossom;
uniform sampler2D textureGlacier;
uniform sampler2D textureGradient;

#define FOG_DENSITY 0.05

float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}


float angleBetween(vec3 a, vec3 b) {
	vec3 na = normalize(a);
	vec3 nb = normalize(b);

	return acos(dot(na, nb));
}

void main(void) {
    float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fogFactorExp2(fogDistance*fogDistanceOffset, FOG_DENSITY);

	vec3 color0 = texture2D(textureGlacier, vTextureCoord).rgb;
	vec3 color1 = texture2D(textureGradient, vTextureCoord).rgb;

	// vec3 finalColor = color;
	vec3 finalColor = mix(color0, color1, blossom);
	float t = abs(vTextureCoord.y - .5) / .5;
	t = mix(t, 1.0, .8);
	finalColor *= t;

	float angle = angleBetween(vPosition, lightPosition);
	float light = 1.0-smoothstep(0.0, 1.25, angle);
	light = pow(light, 30.0);

	finalColor.rgb += light * (.5-blossom*.2);


	finalColor = mix(finalColor, fogColor/255.0, fogAmount);
	gl_FragColor = vec4(finalColor, opacity); 
}