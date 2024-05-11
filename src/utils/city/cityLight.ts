import { TextureLoader, Texture, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide, Group, Vector3 } from 'three'
import biaozhu from '../../assets/images/biaozhu.png'
import guangzhu from '../../assets/images/guangzhu.png'
import { lglt2xyz } from '../utils'
import { ICityList } from '../type'
import { GlobalConfig } from '../config'


export const createCityLight = (cityList: ICityList) => {
  const waveLightMeshArr: Group = new Group()
  waveLightMeshArr.name = 'cityLightWaveGroup'
  const lightWeshArr: Group = new Group()
  lightWeshArr.name = 'cityLightGroup'
  const texture = new TextureLoader().load(biaozhu)
  const texture2 = new TextureLoader().load(guangzhu)
  for (const cityName in cityList) {
    const city = cityList[cityName]
    let position = lglt2xyz(city.longitude, city.latitude)
    let waveMesh = createLightWaveMesh(texture)
    let lightMesh = createLightMesh(texture2, position)
    waveLightMeshArr.add(waveMesh)
    lightWeshArr.add(lightMesh)
  }

  return { waveLightMeshArr, lightWeshArr }
}


export const createLightWaveMesh = (texture: Texture) => {
  let geometry = new PlaneGeometry(1, 1);
  let material = new MeshBasicMaterial({
    color: '#22ffcc',
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  let mesh = new Mesh(geometry, material);
  let size = GlobalConfig.earthRadius * 0.035;
  mesh.scale.set(size, size, size);
  mesh.privateType = "cityLightWave";
  mesh.layerType = "city";
  return mesh;
}

export const createLightMesh = (texture: Texture, position: Vector3) => {
  let height = GlobalConfig.earthRadius * 0.1;
  let geometry = new PlaneGeometry(GlobalConfig.earthRadius * 0.05, height);
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, 0, height / 2);
  let material = new MeshBasicMaterial({
    map: texture,
    color: '#0dfdf8',
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
  });
  let mesh = new Mesh(geometry, material);
  mesh.privateType = "cityLight";
  mesh.layerType = "city";
  let group = new Group();
  group.add(mesh, mesh.clone().rotateZ(Math.PI / 2));
  group.position.set(position.x, position.y, position.z);
  let coordVec3 = new Vector3(position.x, position.y, position.z).normalize();
  let meshNormal = new Vector3(0, 0, 1);
  group.quaternion.setFromUnitVectors(meshNormal, coordVec3);
  return group;
}