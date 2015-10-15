// tree.frag

precision highp float;

uniform sampler2D texture;
uniform sampler2D textureNormal;
varying vec2 vTextureCoord;
varying vec3 vNormal;


uniform vec3 lightColor;
uniform vec3 lightDir;

const float ambient_color = .5; 
const vec3 ambient = vec3(ambient_color);
const float lightWeight = 1.0 - ambient_color;

void main(void) {
	vec2 uv                = vTextureCoord;
	vec4 color             = texture2D(texture, uv);
	vec3 colorNormal       = texture2D(texture, uv).rgb;
	
	const float bumpOffset = .2;
	vec3 N                 = vNormal + (colorNormal-.5) * bumpOffset;
	N                      = normalize(N);
	
	float lambert          = max(0.0, dot(N, normalize(lightDir)));
	
	color.rgb              *= ambient + lightColor/255.0 * lambert * lightWeight;
	gl_FragColor           = color;
}