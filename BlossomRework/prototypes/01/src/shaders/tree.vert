// tree.vert

#define SHADER_NAME VERTEX_TREE

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 position;
uniform vec3 scale;

varying vec2 vTextureCoord;
varying vec3 vNormal;


void main(void) {
	vec3 pos 		= aVertexPosition * scale + position;
	gl_Position   	= uPMatrix * uMVMatrix * vec4(pos, 1.0);
	vTextureCoord 	= aTextureCoord;
	vNormal		  	= aNormal;
}