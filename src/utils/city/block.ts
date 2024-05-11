import {
  Shape,
  ExtrudeGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three'
import { getD3Project } from '../utils'

export const createProvinceMap = (polygon: any) => {
  // const posArr = polygon.map((coordinate: any) => {
  //   const [lon, lat] = coordinate;
  //   const { x: sphereX, y: sphereY } = lon2xyz(lon, lat, GlobalConfig.earthRadius);
  //   return new Vector2(sphereX, sphereY);
  // });
  const shape = new Shape()
  polygon.forEach((row: number[], i: number) => {
    const [x, y] = getD3Project(row)
    if (i === 0) {
      shape.moveTo(x, -y)
    }
    shape.lineTo(x, -y)
  })

  const geometry = new ExtrudeGeometry(shape, {
    depth: -2,
    bevelEnabled: false
  })

  const material = new MeshBasicMaterial({
    color: '#ff0000',
    transparent: true,
    opacity: 1
  })
  return new Mesh(geometry, material)
}
