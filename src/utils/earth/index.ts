import { Object3D, TextureLoader, SphereGeometry, MeshStandardMaterial, Mesh, Group } from 'three'

import earthImg from "@/assets/images/earth.jpg";
import earthLight from "@/assets/images/earth_1.jpg";
import { createSprite } from './sprite';
import { createMapStroke } from './stroke';
import { createEarthOutLine } from './outLine'
import { createCityPoints } from '../city/cityPoint';
import { createCityLight } from '../city/cityLight'
import { createCityLigature } from '../city/ligature'
import { ICityList, IflyData } from '../type'
import { createFlyLine } from './flyline'
import { GlobalConfig } from '../config';
import { InitFlyLine } from '../city/flyLine'

export const createEarthMesh = (cityList: ICityList, relationList: IflyData[]) => {
  const earthObj = new Object3D();
  const texture = new TextureLoader().load(earthImg);
  const lightMap = new TextureLoader().load(earthLight);
  let earthOutLine: Object3D | null = null
  let flyManager: InitFlyLine;
  let waveMeshObj: Group;

  const globeGgeometry: SphereGeometry = new SphereGeometry(GlobalConfig.earthRadius, 100, 100);
  const globeMaterial: MeshStandardMaterial = new MeshStandardMaterial({
    map: texture,
    lightMap: lightMap,
    flatShading: true,
    fog: false,
  });

  const globeMesh = new Mesh(globeGgeometry, globeMaterial);
  globeMesh.name = 'earth'
  // earthObj.rotation.set(0.5, 2.9, 0.1);
  earthObj.add(globeMesh);

  if (GlobalConfig.default.earth.sprite) {
    const sprite = createSprite();
    earthObj.add(sprite);
  }

  if (GlobalConfig.default.city.stroke) {
    const { cityStroke } = createMapStroke()
    earthObj.add(cityStroke)
  }

  if (GlobalConfig.default.earth.outLine) {
    earthOutLine = createEarthOutLine()
    earthObj.add(earthOutLine)
  }

  if (GlobalConfig.default.city.point) {
    const { waveMeshArr, pointMeshArr } = createCityPoints(cityList);
    waveMeshObj = waveMeshArr
    earthObj.add(waveMeshArr)
    earthObj.add(pointMeshArr)
  }

  if (GlobalConfig.default.city.light) {
    const { waveLightMeshArr, lightWeshArr } = createCityLight(cityList);
    earthObj.add(waveLightMeshArr)
    earthObj.add(lightWeshArr)
  }

  // 城市飞线
  if (GlobalConfig.default.city.flyLine) {
    flyManager = createFlyLine(earthObj, cityList, relationList)
  }

  // 城市连线
  if (GlobalConfig.default.city.line) {
    const cityLineArr = createCityLigature(cityList, relationList)
    console.log(cityLineArr)
    earthObj.add(cityLineArr)
  }

  return { earthObj, earthOutLine, waveMeshObj, flyManager };
}

