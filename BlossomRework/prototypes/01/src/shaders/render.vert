// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform float percent;
varying vec2 vTextureCoord;
varying vec3 vColor;

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aTextureCoord * .5;

	vec3 posCurrent = texture2D(texture, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;

	pos = mix(posCurrent, posNext, percent);
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    gl_PointSize = 1.0;
    vColor = vec3(1.0);
}