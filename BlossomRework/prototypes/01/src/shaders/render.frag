precision mediump float;

varying vec3 vColor;
varying vec3 vNormal;

const float ambient_color = .35; 
const vec3 ambient = vec3(ambient_color);
const float lightWeight = 1.0 - ambient_color;


varying float vOpacity;
varying float vDepth;

uniform float zFar;
uniform float zNear;
uniform vec3 lightColor;
uniform vec3 lightDir;


float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
    gl_FragColor = vec4(vColor, vOpacity);

    float lambert = max(dot(vNormal, normalize(lightDir)), 0.0);
    float D = 1.0-getDepth(vDepth, zNear, zFar);

    gl_FragColor.rgb = ambient + lightColor/255.0 * lambert * lightWeight;
}