// floorShadow.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTextureCoord;
varying vec4 vShadowCoord;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vVertex;

const mat4 biasMatrix = mat4( 0.5, 0.0, 0.0, 0.0,
							  0.0, 0.5, 0.0, 0.0,
							  0.0, 0.0, 0.5, 0.0,
							  0.5, 0.5, 0.5, 1.0 );

void main(void) {
	vec4 mvPosition = uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
	gl_Position     = uProjectionMatrix * mvPosition;
	vPosition       = mvPosition;
	vTextureCoord   = aTextureCoord;
	vShadowCoord    = ( biasMatrix * uShadowMatrix * uModelMatrix ) * vec4(aVertexPosition, 1.0);
	
	vTextureCoord   = aTextureCoord;
	vNormal         = aNormal;
	vVertex         = aVertexPosition;
}