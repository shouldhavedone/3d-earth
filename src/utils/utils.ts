import { Vector3, Spherical, MathUtils, Ray } from 'three'
import { GlobalConfig } from './config';


/**
 * @description 经纬度转换球面坐标
 * @param longitude 
 * @param latitude 
 */
export const lglt2xyz = (longitude: number, latitude: number) => {
  const theta = (90 + longitude) * (Math.PI / 180);
  const phi = (90 - latitude) * (Math.PI / 180);
  return new Vector3().setFromSpherical(
    new Spherical(GlobalConfig.earthRadius, phi, theta)
  );
}

/**
* @description 经纬度坐标转球面坐标
* @param {经度(角度值)} longitude
* @param {维度(角度值)} latitude
* @param {半径} radius
*/
export const lon2xyz = (longitude: number, latitude: number, radius: number) => {
  const lonRad = MathUtils.degToRad(longitude);
  const latRad = MathUtils.degToRad(latitude);
  // 经纬度坐标转球面坐标计算公式
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.sin(lonRad);

  // 返回球面坐标
  return new Vector3(x, y, z);
}

/**
 * @description 计算v1,v2 的中点
 * @param v1 
 * @param v2 
 */
export const getVCenter = (v1: Vector3, v2: Vector3) => {
  const v = v1.add(v2);
  return v.divideScalar(2);
}


/**
 * @description 计算V1，V2向量固定长度的点
 * @param v1 
 * @param v2 
 * @param len 
 */
export const getLenVcetor = (v1: Vector3, v2: Vector3, len: number) => {
  const v1v2Len = v1.distanceTo(v2);
  return v1.lerp(v2, len / v1v2Len);
}

/**
 * @description 获取贝塞尔曲线中心点
 * @param v0 
 * @param v3 
 */
export const getCubicBezierCenterPoint = (v0: Vector3, v3: Vector3) => {
  // 夹角
  let angle = (v0.angleTo(v3) * 1.8) / Math.PI / 0.1; // 0 ~ Math.PI
  let aLen = angle * 40,
    hLen = angle * angle * 800;
  let p0 = new Vector3(0, 0, 0);
  // 法线向量
  let rayLine = new Ray(p0, getVCenter(v0.clone(), v3.clone()));
  let temp = new Vector3()
  // 顶点坐标
  let vtop = new Vector3()
  rayLine.at(1, temp)

  rayLine.at(hLen / temp.distanceTo(p0), vtop);
  // 控制点坐标
  let v1 = getLenVcetor(v0.clone(), vtop, aLen);
  let v2 = getLenVcetor(v3.clone(), vtop, aLen);

  return { v1, v2 }
}

/**
 * @description d3坐标转球面坐标
 * @param row 
 * @param center 
 */
export const getD3Project = (row: number[], center: [number, number] = [106.278179, 38.46637]) => {
  return d3.geoMercator().center(center).translate([0, 0])(row)
}