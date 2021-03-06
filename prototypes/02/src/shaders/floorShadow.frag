// shadow.frag

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec4 vShadowCoord;
varying vec3 vVertex;

uniform vec3 color;
uniform vec3 lightPosition;
uniform vec3 fogColor;
uniform sampler2D textureDepth;
uniform float fogDistanceOffset;
uniform float blossom;
uniform sampler2D textureGlacier;
uniform sampler2D textureGradient;

#define FOG_DENSITY 0.05
const float PI = 3.141592657;
const float TwoPI = 3.141592657 * 2.0;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

vec4 textureProjOffset(sampler2D uShadowMap, vec4 sc, vec2 offset) {
	const float shadowBias     = .00005;
	vec4 scCopy = sc;
	scCopy.xy += offset;
	return texture2DProj(uShadowMap, scCopy, shadowBias);
}

vec4 pcfShadow(sampler2D uShadowMap) {
	vec4 sc                   = vShadowCoord / vShadowCoord.w;
	const float shadowMapSize = 1024.0;
	const float s             = 1.0/shadowMapSize;
	vec4 shadow              = vec4(0.0);
	shadow += textureProjOffset( uShadowMap, sc, vec2(-s,-s) );
	shadow += textureProjOffset( uShadowMap, sc, vec2(-s, 0) );
	shadow += textureProjOffset( uShadowMap, sc, vec2(-s, s) );
	shadow += textureProjOffset( uShadowMap, sc, vec2( 0,-s) );
	shadow += textureProjOffset( uShadowMap, sc, vec2( 0, 0) );
	shadow += textureProjOffset( uShadowMap, sc, vec2( 0, s) );
	shadow += textureProjOffset( uShadowMap, sc, vec2( s,-s) );
	shadow += textureProjOffset( uShadowMap, sc, vec2( s, 0) );
	shadow += textureProjOffset( uShadowMap, sc, vec2( s, s) );
	return shadow/9.0;
}


float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}


vec2 envMapEquirect(vec3 wcNormal, float flipEnvMap) {
  float phi = acos(-wcNormal.y);
  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;
  return vec2(theta / TwoPI, phi / PI);
}

vec2 envMapEquirect(vec3 wcNormal) {
    return envMapEquirect(wcNormal, -1.0);
}


void main(void) {
	vec4 pcfProject = pcfShadow(textureDepth);
	// pcfProject.rgb = smoothstep(vec3(.5), vec3(1.0), pcfProject.rgb);
	// pcfProject.rgb = contrast(pcfProject.rgb, 2.0, .5);

	vec2 envMapUV = envMapEquirect(vNormal);
	vec3 envColor0 = texture2D(textureGlacier, envMapUV).rgb;
	vec3 envColor1 = texture2D(textureGradient, envMapUV).rgb;
	vec3 envColor = mix(envColor0, envColor1, blossom);

	float _diffuse = diffuse(vNormal, lightPosition-vVertex);
	vec3 finalColor = color * mix(_diffuse, 1.0, .5) + envColor * .075;


	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fogFactorExp2(fogDistance*fogDistanceOffset, FOG_DENSITY);
	vec4 color = vec4( finalColor, 1.0) * pcfProject;


	gl_FragColor = mix(color, vec4(fogColor/255.0, 1.0), fogAmount);
	// gl_FragColor = vec4( finalColor, 1.0) * pcfProject;
}