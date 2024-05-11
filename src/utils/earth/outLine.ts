import { Object3D, Vector3, CatmullRomCurve3, BufferGeometry, BufferAttribute, ShaderMaterial, Points, AdditiveBlending } from 'three'
import chinaOutLineJson from "../../assets/libs/china-outline.json";
import { lglt2xyz } from '../utils'

export const createEarthOutLine = () => {
  const map = new Object3D();
  chinaOutLineJson.features.forEach((elem) => {
    const province = new Object3D();
    const coordinates = elem.geometry.coordinates;
    coordinates.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        if (polygon.length > 200) {
          let v3ps = [];
          for (let i = 0; i < polygon.length; i++) {
            let pos = lglt2xyz(polygon[i][0], polygon[i][1]);
            v3ps.push(pos);
          }
          let curve = new CatmullRomCurve3(v3ps, false);
          let color = new Vector3(
            0.5999758518718452,
            0.7798940272761521,
            0.6181903838257632
          );
          let flyLine = initFlyLine(
            curve,
            {
              speed: 0.5,
              color: color,
              number: 3, //同时跑动的流光数量
              length: 0.2, //流光线条长度
              size: 3, //粗细
            },
            5000,
          );
          province.add(flyLine);
        }
      });
    });
    map.add(province);
  });
  return map;
}

export const initFlyLine = (curve: CatmullRomCurve3, matSetting: any, pointsNumber: number) => {
  const points = curve.getPoints(pointsNumber);
  const geometry = new BufferGeometry().setFromPoints(points);
  const length = points.length;
  let percents = new Float32Array(length);
  for (let i = 0; i < points.length; i += 1) {
    percents[i] = i / length;
  }
  geometry.setAttribute("percent", new BufferAttribute(percents, 1));
  const lineMaterial = initLineMaterial(matSetting);
  const flyLine = new Points(geometry, lineMaterial);
  return flyLine;
}

export const initLineMaterial = (setting: any) => {
  const number = setting ? Number(setting.number) || 1.0 : 1.0;
  const speed = setting ? Number(setting.speed) || 1.0 : 1.0;
  const length = setting ? Number(setting.length) || 0.5 : 0.5;
  const size = setting ? Number(setting.size) || 3.0 : 3.0;
  const color = setting
    ? setting.color || new Vector3(0, 1, 1)
    : new Vector3(0, 1, 1);
  const lineMaterial = new ShaderMaterial({
    uniforms: {
      time: { type: "f", value: 0.0 },
      number: { type: "f", value: number },
      speed: { type: "f", value: speed },
      length: { type: "f", value: length },
      size: { type: "f", value: size },
      color: { type: "v3", value: color },
    },
    vertexShader: `
      varying vec2 vUv;
      attribute float percent;
      uniform float time;
      uniform float number;
      uniform float speed;
      uniform float length;
      varying float opacity;
      uniform float size;
      void main()
      {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          float l = clamp(1.0-length,0.0,1.0);
          gl_PointSize = clamp(fract(percent*number + l - time*number*speed)-l ,0.0,1.) * size * (1./length);
          opacity = gl_PointSize/size;
          gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif
      varying float opacity;
      uniform vec3 color;
      void main(){
          if(opacity <=0.2){
              discard;
          }
          gl_FragColor = vec4(color,1.0);
      }
    `,
    transparent: true,
    blending: AdditiveBlending,
  });
  return lineMaterial;
}

export const outLineAnimation = (outLineMap: Object3D) => {
  outLineMap?.children.forEach((province: Object3D) => {
    province.children.forEach((flyLine: Points) => {
      flyLine.material.uniforms.time.value += 0.007;
    })
  })
}
