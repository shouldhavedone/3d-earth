import {
  TextureLoader,
  Vector3,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  Texture,
  Group,
} from 'three'

import biaozhu from '../../assets/images/biaozhu.png'
import bzguangquan from '../../assets/images/bzguangquan.png'
import { lglt2xyz } from '../utils';
import { ICityList } from '../type';
import { GlobalConfig } from '../config';


export const createCityPoints = (cityList: ICityList) => {
  const waveMeshArr: Group = new Group()
  waveMeshArr.name = 'cityPointWaveGroup'
  const pointMeshArr: Group = new Group()
  pointMeshArr.name = 'cityPointGroup'
  let texture = new TextureLoader().load(biaozhu);
  let texture2 = new TextureLoader().load(bzguangquan);
  for (const cityName in cityList) {
    let city = cityList[cityName];
    let lon = city.longitude;
    let lat = city.latitude;
    let position = lglt2xyz(lon, lat);
    let waveMesh = createWaveMesh(position, texture2)
    let pointMesh = createPointMesh(position, texture)
    waveMeshArr.add(waveMesh)
    pointMeshArr.add(pointMesh)
  }
  return { waveMeshArr, pointMeshArr }
}

/**
 * @description 创建标记点-波纹
 * @param position 
 * @param texture 
 */
export const createWaveMesh = (position: Vector3, texture: Texture) => {
  const planeGeometry = new PlaneGeometry(1, 1);
  const material: MeshBasicMaterial = new MeshBasicMaterial({
    color: '#6edade',
    map: texture,
    transparent: true,
    opacity: 1.0,
    depthWrite: false,
  })

  let mesh: Mesh = new Mesh(planeGeometry, material);
  let size = GlobalConfig.earthRadius * 0.045;
  mesh.size = size;
  mesh.scale.set(size, size, size);
  mesh._s = Math.random() * 1.0 + 1.0;
  mesh.position.set(position.x, position.y, position.z);
  mesh.privateType = "cityPointWave";
  mesh.layerType = "city";
  let coordVec3 = new Vector3(position.x, position.y, position.z).normalize();
  let meshNormal = new Vector3(0, 0, 1);
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return mesh
}

/**
 * @description 创建标记点
 * @param position 
 * @param texture 
 */
export const createPointMesh = (position: Vector3, texture: Texture) => {
  const planeGeometry: PlaneGeometry = new PlaneGeometry(1, 1);
  const material: MeshBasicMaterial = new MeshBasicMaterial({
    color: '#6edade',
    map: texture,
    transparent: true,
    opacity: 1.0,
    depthWrite: false,
  })
  let mesh: Mesh = new Mesh(planeGeometry, material);
  let size: number = GlobalConfig.earthRadius * 0.035;
  mesh.scale.set(size, size, size);

  mesh.position.set(position.x, position.y, position.z);
  mesh.privateType = "cityPoint";
  mesh.layerType = "city";
  let coordVec3 = new Vector3(position.x, position.y, position.z).normalize();
  let meshNormal = new Vector3(0, 0, 1);
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
  // mesh.userData.quaternion = mesh.quaternion;
  return mesh;
}

/**
 * @description 波纹动画
 * @param waveMeshArr 
 */
export const waveMeshAnimate = (waveMeshArr: any) => {
  if (!waveMeshArr || !waveMeshArr?.children?.length) return false;
  waveMeshArr.children.forEach((mesh: Mesh) => {
    mesh._s += 0.005;
    mesh.scale.set(
      mesh.size * mesh._s,
      mesh.size * mesh._s,
      mesh.size * mesh._s
    );
    if (mesh._s <= 1.3) {
      mesh.material.opacity = (mesh._s - 1) * 2;
    } else if (mesh._s > 1.3 && mesh._s <= 1.6) {
      mesh.material.opacity = 1 - (mesh._s - 1.3) * 2;
    } else {
      mesh._s = 1.0;
    }
  });
}