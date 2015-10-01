precision mediump float;

varying vec3 vColor;
varying vec3 vNormal;

const vec3 ambient = vec3(.1);
const vec3 lightDir = vec3(1.0);
const vec3 lightColor = vec3(1.0);
const float lightWeight = .9;
varying float vOpacity;
varying float vDepth;

uniform float zFar;
uniform float zNear;


float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
    gl_FragColor = vec4(vColor, vOpacity);

    float lambert = max(dot(vNormal, normalize(lightDir)), 0.0);
    float D = 1.0-getDepth(vDepth, zNear, zFar);

    gl_FragColor.rgb = ambient + lightColor * lambert * lightWeight;
    // gl_FragColor.rgb *= D;
    gl_FragColor.rgb = vec3(D);


    // gl_FragColor.rgb = (vNormal + 1.0) * .5;
}