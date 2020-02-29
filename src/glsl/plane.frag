
uniform vec3 uTerrainColor;
varying float z;

void main() {
  gl_FragColor = vec4(uTerrainColor, 1.0);
}
