import { LineBasicMaterial, BufferGeometry, Float32BufferAttribute, Line, Vector3 } from 'three'
import { lglt2xyz, getD3Project } from '../utils'

/**
 * 球面
 * @param polygon 
 * @param lineMaterial 
 */
export const createCityLine = (polygon: any, lineMaterial: LineBasicMaterial) => {
  const positions = [];
  const linGeometry = new BufferGeometry();
  for (let i = 0; i < polygon.length; i++) {
    let pos = lglt2xyz(polygon[i][0], polygon[i][1]);
    positions.push(pos.x, pos.y, pos.z);
  }
  linGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(positions, 3)
  );

  return new Line(linGeometry, lineMaterial)
}

/**
 * 平面
 * @param polygon 
 * @param lineMaterial 
 */
export const createCityLinePlane = (polygon: any, lineMaterial: LineBasicMaterial) => {
  const pointsArray = new Array()
  const linGeometry = new BufferGeometry();
  polygon.forEach((row: number[]) => {
    const [x, y] = getD3Project(row)
    pointsArray.push(new Vector3(x, -y, 2.1))
  })
  linGeometry.setFromPoints(pointsArray)

  return new Line(linGeometry, lineMaterial)
}
