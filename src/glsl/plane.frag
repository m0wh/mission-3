
uniform vec3 uTerrainColor;
uniform vec3 fogColor;
uniform float fogDensity;

void main() {
  float depth = gl_FragCoord.z / gl_FragCoord.w;

  const float LOG2 = 1.442695;
  float fogFactor = exp2(- fogDensity * fogDensity * depth * depth * LOG2);
  fogFactor = 1.0 - clamp(fogFactor, 0.0, 1.0);
  
  gl_FragColor = vec4(uTerrainColor, 1.0);
  gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
}
