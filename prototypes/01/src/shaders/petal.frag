// petal.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texturePetal;
varying vec4 vColor;
varying vec3 vNormal;

const vec3 LIGHT = vec3(1.0);

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}

void main(void) {
	if(vColor.a <= 0.0) discard;
	vec4 color = texture2D(texturePetal, vTextureCoord);
	if(color.a <= 0.001) discard;
	
    
    float _diffuse = diffuse(vNormal, LIGHT);
    gl_FragColor = color;
    gl_FragColor.rgb *= mix(_diffuse, 1.0, .5);
}