#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')
#pragma glslify: voronoi3d = require('glsl-voronoi-noise/3d')

uniform float uTime;

const int octaves = 5; // Detail
float onoise (vec3 v) {
  float total = 0.0;
  float frequency = 1.0 / 5.0; // Scale
  float amplitude = 1.0;
  float maxValue = 0.0;

  for (int i = 0; i < octaves; i++) {
    total += snoise3(v * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return total / maxValue;
}

void main () {
  vec3 pos = position + vec3(0.0, uTime * 3.0, 0.0);
  
  float noise = onoise(vec3(pos.xy, 0.0)) * 0.2; // Noise Texture
  float voronoi = voronoi3d(vec3(pos.xy / 5.0, 0.0)).r; // Voronoi
  float z = (noise + voronoi) * 1.0; // Multiply

  vec4 modelViewPosition = modelViewMatrix * vec4(position.xy, z, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
