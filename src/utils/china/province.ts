import {
  Object3D,
  Group,
  LineBasicMaterial,
} from 'three'
import chinaInfoJson from "../../assets/libs/china.json";
import { createProvinceMap } from '../city/block'

import { createCityLinePlane } from '../city/line'


export const createProvinceMesh = () => {
  const provinceObj = new Object3D();
  provinceObj.name = "province";
  const provinceLine = new Object3D();
  provinceLine.name = "provinceLine";

  const lineMaterial = new LineBasicMaterial({
    color: 0xf19553,
  });

  chinaInfoJson.features.forEach((elem) => {
    const province = new Group();
    const proLine = new Group();
    province.name = elem.properties.name;
    proLine.name = elem.properties.name;
    const coordinates = elem.geometry.coordinates;
    coordinates.forEach((multiPolygon: any) => {
      multiPolygon.forEach((polygon: any) => {
        const city = createProvinceMap(polygon);
        city.rotateX(Math.PI / 2);
        city.rotateY(Math.PI);
        city.position.y = 2.1;
        const line = createCityLinePlane(polygon, lineMaterial);
        line.rotateX(Math.PI / 2);
        line.rotateY(Math.PI);
        province.add(city);
        proLine.add(line);
      });
    });
    provinceObj.add(province);
    provinceLine.add(proLine);
  })

  return { provinceObj, provinceLine };
}

