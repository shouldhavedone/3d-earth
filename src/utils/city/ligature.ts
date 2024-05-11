import { Vector3, Float32BufferAttribute, Group, Color, BufferGeometry, CubicBezierCurve3, Line, LineBasicMaterial } from 'three'

import { lglt2xyz, getCubicBezierCenterPoint } from '../utils'
import { ICityList, IflyData } from '../type';

export const createCityLigature = (cityList: ICityList, relationList: IflyData[]) => {
  const cityLineArr = new Group()
  relationList.forEach((relation: IflyData) => {
    const startCity = cityList[relation.from];
    const startPos = lglt2xyz(startCity.longitude, startCity.latitude);
    relation.to.forEach((cityName: string) => {
      let endCity = cityList[cityName];
      let endPos = lglt2xyz(endCity.longitude, endCity.latitude);
      let cityLineMesh = addCityLine(startPos, endPos);
      cityLineArr.add(cityLineMesh);
    })
  });
  return cityLineArr
}


export const addCityLine = (v0: Vector3, v3: Vector3) => {
  const { v1, v2 } = getCubicBezierCenterPoint(v0, v3)
  let curve = new CubicBezierCurve3(v0, v1, v2, v3)

  let points = curve.getSpacedPoints(50);
  let positions = [];
  let colors = [];
  let color = new Color();

  for (let j = 0; j < points.length; j++) {
    color.setHSL(.31666 + j * 0.005, 0.7, 0.5); //绿色
    colors.push(color.r, color.g, color.b);
    positions.push(points[j].x, points[j].y, points[j].z);
  }
  let geometry = new BufferGeometry().setFromPoints(points);
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  let matLine = new LineBasicMaterial({
    linewidth: 0.0016,
    vertexColors: true,
  });
  const mesh = new Line(geometry, matLine)
  return mesh

}