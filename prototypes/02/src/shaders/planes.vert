precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aPointCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D texture;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;

uniform float percent;
uniform float uvIndex;
uniform vec2 uvOffset;
uniform float numSlices;
uniform float blossom;

varying vec4 vColor;
varying vec2 vPointCoord;

void main(void) {
	float offset = 1.0;
	vec2 uv      = aTextureCoord / numSlices;
	uv           += uvOffset;
	vec3 posCurr = texture2D(texture, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;


	float l = length(posCurr);
	if(length(posNext) < l && l > 8.0) {
		offset = 0.0;
	}
	vec3 pos        = mix(posCurr, posNext, percent);
	vec3 extra      = texture2D(textureExtra, uv).rgb;
	
	vec4 mvPosition = uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	float blossomOffset = blossom * 2.0 - extra.y;
	blossomOffset = smoothstep(0.0, 1.0, blossomOffset);


	mvPosition.xyz  += aVertexPosition * blossomOffset;
	
	gl_Position     = uProjectionMatrix * mvPosition;
	
	vColor          = vec4(1.0, 0.7, 0.7, 1.0) * offset;
	vPointCoord     = aPointCoord;
	// vColor          = vec4(vec3(extra.b), 1.0);
}