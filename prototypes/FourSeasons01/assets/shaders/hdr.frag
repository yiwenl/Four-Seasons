uniform sampler2D   texture;

vec3 rgbe2rgb(vec4 rgbe) {
    return (rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0));
}

void main(void) {
    vec2 texCoord  = gl_TexCoord[0].st;
    
    vec4 texel = texture2D(texture, texCoord);
    vec3 color = rgbe2rgb(texel);
    gl_FragColor = vec4(color, 1.0);
}