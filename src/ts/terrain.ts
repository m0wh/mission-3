import * as THREE from 'three'
// import SimplexNoise from 'simplex-noise'
import vertexShader from '../glsl/plane.vert'
import fragmentShader from '../glsl/plane.frag'

// const simplex = new SimplexNoise()

export default function createTerrain (scene: THREE.Scene) {
  const geo = new THREE.PlaneGeometry(50, 50, 300, 300)

  // const mat = new THREE.MeshBasicMaterial({ color: 0x020202 })
  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      fogColor: { type: 'c', value: scene.fog.color },
      fogDensity: { type: 'c', value: 0.07 },
      uTime: { value: 0.0 },
      uTerrainColor: { value: new THREE.Color(0x020202) }
    }
  })
  mat.fog = true
  const terrain = new THREE.Mesh(geo, mat)
  terrain.rotation.x = -Math.PI / 2

  return { material: mat, mesh: terrain }
}
