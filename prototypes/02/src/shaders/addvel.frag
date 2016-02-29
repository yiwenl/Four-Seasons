// addvel.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texturePos;
uniform sampler2D textureVel;
uniform sampler2D textureOrg;

void main(void) {
	vec3 pos = texture2D(texturePos, vTextureCoord).rgb;
	vec3 posOrg = texture2D(textureOrg, vTextureCoord).rgb;
	vec3 vel = texture2D(textureVel, vTextureCoord).rgb;

	pos += vel;

	if(length(pos) > 15.0) {
		pos = posOrg;
	}

    gl_FragColor = vec4(pos, 1.0);
}