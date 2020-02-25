import * as THREE from 'three'
import SimplexNoise from 'simplex-noise'

const simplex = new SimplexNoise()

export default function createTerrain () {
  const geo = new THREE.PlaneGeometry(50, 50, 100, 100)

  geo.vertices.forEach(vertex => {
    let noise = simplex.noise2D(vertex.x / 10, vertex.y / 10)
    noise += simplex.noise2D(vertex.x / 2, vertex.y / 2) / 5
    vertex.z = noise
  })

  geo.computeFaceNormals()
  geo.computeVertexNormals()

  const mat = new THREE.MeshBasicMaterial({ color: 0x050505 })
  const terrain = new THREE.Mesh(geo, mat)
  terrain.rotation.x = -Math.PI / 2

  return terrain
}
