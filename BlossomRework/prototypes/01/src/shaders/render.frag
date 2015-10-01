precision mediump float;

varying vec3 vColor;
varying vec3 vNormal;

const float ambient_color = .65; 
const vec3 ambient = vec3(ambient_color);
const float lightWeight = .5;


varying float vOpacity;
varying float vDepth;
varying vec2 vTextureCoord;
varying vec2 vUVOffset;

uniform float zFar;
uniform float zNear;
uniform vec3 lightColor;
uniform vec3 lightDir;
uniform sampler2D textureFlower;


float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
    gl_FragColor = texture2D(textureFlower, vTextureCoord * .5 + vUVOffset);
    gl_FragColor.a *= vOpacity;
    if(gl_FragColor.a < .1) discard;

    float lambert = max(dot(vNormal, normalize(lightDir)), 0.0);
    float D = 1.0-getDepth(vDepth, zNear, zFar);

    gl_FragColor.rgb *= ambient + lightColor/255.0 * lambert * lightWeight;
}