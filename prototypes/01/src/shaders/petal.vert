// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aPosCoord;
attribute vec4 aRotation;
attribute vec3 aExtra;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform float percent;
uniform float petalSize;
uniform float time;

varying vec4 vColor;
varying vec3 vNormal;
varying vec2 vTextureCoord;

vec4 quat_from_axis_angle(vec3 axis, float angle) { 
	vec4 qr;
	float half_angle = (angle * 0.5);
	qr.x = axis.x * sin(half_angle);
	qr.y = axis.y * sin(half_angle);
	qr.z = axis.z * sin(half_angle);
	qr.w = cos(half_angle);
	return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) { 
	vec4 q = quat_from_axis_angle(axis, angle);
	vec3 v = position.xyz;
	return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}


void main(void) {
	vec2 uv        = aPosCoord * .5;
	vec3 currPos   = texture2D(texture, uv).rgb;
	vec3 nextPos   = texture2D(textureNext, uv).rgb;
	vec3 pos       = mix(currPos, nextPos, percent);
	vec3 finalSize = petalSize * mix(aExtra, vec3(1.0), .5);
	vec3 posOffset = aVertexPosition * finalSize;
	
	float angle    = aRotation.w + time * mix(aExtra.y, 1.0, .1);
	vec3 axis      = aRotation.xyz;
	posOffset      = rotate_vertex_position(posOffset, axis, angle);
	
	pos            += posOffset;
	gl_Position    = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	
	gl_PointSize   = 1.0;
	
	float d        = length(pos);
	float a        = smoothstep(10.0, 10.5, d);
	vColor         = vec4(1.0-a);
	
	
	vTextureCoord  = aTextureCoord;
	vNormal        = uNormalMatrix * rotate_vertex_position(aNormal, axis, angle);
	if(length(currPos) - length(nextPos) > 1.0) vColor.a = 0.0;
}