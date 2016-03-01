precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aPointCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 uNormalMatrix;

uniform sampler2D texture;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;

uniform float percent;
uniform float uvIndex;
uniform vec2 uvOffset;
uniform float numSlices;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec2 vPointCoord;
varying vec4 vShadowCoord;
varying vec4 vPosition;

const mat4 biasMatrix = mat4( 0.5, 0.0, 0.0, 0.0,
							  0.0, 0.5, 0.0, 0.0,
							  0.0, 0.0, 0.5, 0.0,
							  0.5, 0.5, 0.5, 1.0 );

void main(void) {
	float offset = 1.0;
	vec2 uv      = aTextureCoord / numSlices;
	uv           += uvOffset;
	vec3 posCurr = texture2D(texture, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;

	if(length(posNext) < length(posCurr)) {
		offset = 0.0;
	}
	vec3 pos        = mix(posCurr, posNext, percent);
	vec3 extra      = texture2D(textureExtra, uv).rgb;
	
	vec4 mvPosition = uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	mvPosition.xyz  += aVertexPosition;
	
	gl_Position     = uProjectionMatrix * mvPosition;
	vPosition       = mvPosition;
	vTextureCoord   = aTextureCoord;
	vShadowCoord    = ( biasMatrix * uShadowMatrix * uModelMatrix ) * vec4(pos, 1.0);
	
	vColor          = vec4(1.0, 0.7, 0.7, 1.0) * offset;
	vPointCoord     = aPointCoord;
	// vColor          = vec4(vec3(extra.b), 1.0);
}