import {
  Object3D,
  Group,
  LineBasicMaterial,
} from 'three'
import chinaInfoJson from "../../assets/libs/china.json";
import { createCityLine } from '../city/line'

export const createMapStroke = () => {
  const cityStroke = new Object3D();
  cityStroke.name = "cityStroke";

  const lineMaterial = new LineBasicMaterial({
    color: 0xf19553,
  });

  chinaInfoJson.features.forEach((elem: any) => {
    const provinceLine = new Group();
    provinceLine.name = elem.properties.name;
    const coordinates = elem.geometry.coordinates;
    coordinates.forEach((multiPolygon: any) => {
      multiPolygon.forEach((polygon: any) => {
        const line = createCityLine(polygon, lineMaterial);
        provinceLine.add(line);
      });
    });
    cityStroke.add(provinceLine);
  })

  return { cityStroke }
}

