// tree.frag

precision highp float;
varying vec3 vNormal;

void main(void) {
	gl_FragColor = vec4(vNormal*.5 + .5, 1.0);
}