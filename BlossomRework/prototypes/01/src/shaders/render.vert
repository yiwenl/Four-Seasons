// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec2 aUVOffset;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;
uniform float percent;
uniform float time;
uniform float maxRadius;


varying vec2 vTextureCoord;
varying vec3 vColor;
varying vec3 vNormal;
varying float vOpacity;
varying float vDepth;

const vec3 AXIS_X = vec3(1.0, 0.0, 0.0);
const vec3 AXIS_Y = vec3(0.0, 1.0, 0.0);
const vec3 AXIS_Z = vec3(0.0, 0.0, 1.0);

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}



vec4 quat_from_axis_angle(vec3 axis, float angle) { 
	vec4 qr;
	float half_angle = (angle * 0.5);
	qr.x = axis.x * sin(half_angle);
	qr.y = axis.y * sin(half_angle);
	qr.z = axis.z * sin(half_angle);
	qr.w = cos(half_angle);
	return qr;
}

vec3 rotate_vertex_position(vec3 pos, vec3 axis, float angle) { 
	vec4 q = quat_from_axis_angle(axis, angle);
	vec3 v = pos.xyz;
	return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aUVOffset * .5;
	vec2 uvExtra = uv + vec2(.0, .5);
	vec3 rotation = normalize(texture2D(textureExtra, uv).rgb);
	vec3 extras = texture2D(textureExtra, uvExtra).rgb;
	pos *= extras.z * 3.0 + 2.0;


	// mat4 rotX = rotationMatrix(AXIS_X, rotation.r + time * mix(extras.r, 1.0, .5));
	// mat4 rotY = rotationMatrix(AXIS_Y, rotation.g + time * mix(extras.g, 1.0, .5));
	// mat4 rotZ = rotationMatrix(AXIS_Z, rotation.b + time * mix(extras.g, 1.0, .5));

	// vec4 temp = rotX * rotY * rotZ * vec4(pos, 1.0);
	float theta = time * mix(extras.g, 1.0, .5);
	vec4 temp = vec4(1.0);
	temp.rgb = rotate_vertex_position(pos, rotation, theta );

	vec3 posCurrent = texture2D(texture, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	if(length(posNext) - length(posCurrent) < -(maxRadius*.5)) posNext = normalize(posCurrent) * maxRadius;
	else vOpacity = 1.0;

	temp.xyz += mix(posCurrent, posNext, percent);
	temp.xyz *= .1;


	vec4 V = uPMatrix * (uMVMatrix * temp);;
    gl_Position = V;
    vDepth = V.z / V.w;
    vTextureCoord = aTextureCoord;

    gl_PointSize = 1.0;
    vColor = vec3(1.0);


    // vNormal = (rotX * rotY * rotZ * (vec4(aNormal, 1.0))).rgb;
    vNormal = rotate_vertex_position(aNormal, rotation, theta );
}