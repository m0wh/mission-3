import * as THREE from 'three'
import vertexShader from '../glsl/plane.vert'
import fragmentShader from '../glsl/plane.frag'

export default function createTerrain (scene: THREE.Scene) {
  const plane = new THREE.PlaneGeometry(10, 10, 50, 50)
  const geo = new THREE.WireframeGeometry(plane)

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0.0 },
      uTerrainColor: { value: new THREE.Color(0x020202) }
    }
  })
  const terrain = new THREE.LineSegments(geo, mat)
  terrain.rotation.x = -Math.PI / 2
  terrain.position.set(5, 0, 5)

  return { material: mat, mesh: terrain }
}
