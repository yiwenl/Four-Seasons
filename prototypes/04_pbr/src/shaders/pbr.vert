// reflection.vert

#define SHADER_NAME REFLECTION_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;

uniform vec3 uPosition;
uniform vec3 uScale;
uniform vec3 uRotation;

varying vec2 vTextureCoord;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsPosition;
varying vec3 vEyePosition;
varying vec3 vWsNormal;


vec2 rotate(vec2 value, float angle) {
	float c = cos(angle);
	float s = sin(angle);
	mat2 m = mat2(c, -s, s, c);
	return m * value;
}


vec3 rotate(vec3 value, vec3 rotation) {
	vec3 newValue = value;
	newValue.yz				= rotate(newValue.yz, rotation.x);
	newValue.xz				= rotate(newValue.xz, rotation.y);
	newValue.xy				= rotate(newValue.xy, rotation.z);

	return newValue;
}


void main(void) {
	vec3 position 			= aVertexPosition;
	position 		        = rotate(position, uRotation);
	position 		        *= uScale;
	position 				+= uPosition;
	vec4 worldSpacePosition	= uModelMatrix * vec4(position, 1.0);
    vec4 viewSpacePosition	= uViewMatrix * worldSpacePosition;

	vec3 Normal 			= rotate(aNormal, uRotation);
    vNormal					= uNormalMatrix * Normal;
    vPosition				= viewSpacePosition.xyz;
	vWsPosition				= worldSpacePosition.xyz;
	
	vec4 eyeDirViewSpace	= viewSpacePosition - vec4( 0, 0, 0, 1 );
	vEyePosition			= -vec3( uModelViewMatrixInverse * eyeDirViewSpace.xyz );
	vWsNormal				= normalize( uModelViewMatrixInverse * vNormal );
	
    gl_Position				= uProjectionMatrix * viewSpacePosition;

	vTextureCoord			= aTextureCoord;
}
