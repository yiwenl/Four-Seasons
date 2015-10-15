// split.frag

precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D textureFlower;
uniform sampler2D textureLeaves;
uniform sampler2D textureSplit;

void main(void) {
	vec4 colorFlower = texture2D(textureFlower, vTextureCoord);
	vec4 colorLeaves = texture2D(textureLeaves, vTextureCoord);
	vec4 colorSplit = texture2D(textureSplit, vTextureCoord);

	gl_FragColor = mix(colorFlower, colorLeaves, colorSplit.r);
	// gl_FragColor = vec4(vec3(colorSplit.r), 1.0);
}