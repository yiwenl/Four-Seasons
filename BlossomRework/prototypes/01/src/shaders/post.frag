precision mediump float;


varying vec2 vTextureCoord;
uniform sampler2D texture;	
uniform sampler2D textureBlur;	
uniform sampler2D textureDepth;	

uniform float focus;
uniform float depthContrast;

uniform float zFar;
uniform float zNear;

float contrast(float value, float scale) {
	return (value - .5) * scale + .5;
}

float map(float value, float sx, float sy, float tx, float ty) {
	float p = (value - sx) / ( sy - sx);
	// p = clamp(p, 0.0, 1.0);
	return p * (ty- tx) + tx;
}

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}


void main(void) {
    // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 color = texture2D(texture, vTextureCoord);
    vec4 blur = texture2D(textureBlur, vTextureCoord);
    vec4 depth = texture2D(textureDepth, vTextureCoord);

    // float d = getDepth(depth.r, zNear, zFar);
    float d = depth.r;

    if(depth.r < focus) {
    	d = map(depth.r, 0.0, focus, 0.0, 1.0);
    } else {
    	d = map(depth.r, focus, 1.0, 1.0, 0.0);
    }

    // d = contrast(d, depthContrast);

    // gl_FragColor = mix(blur, color, d);
    // gl_FragColor = mix(blur, color, 1.0-depth.r);
    gl_FragColor = vec4(vec3(d), 1.0);
}