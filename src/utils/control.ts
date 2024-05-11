import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PerspectiveCamera, WebGLRenderer } from 'three'

export const initControls = (camera: PerspectiveCamera, renderer: WebGLRenderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  // 惯性,阻尼
  controls.enableDamping = true;
  // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
  controls.dampingFactor = 0.05;
  // 是否可以缩放
  controls.enableZoom = true;
  // 自动旋转
  controls.autoRotate = false;
  // 旋转速度
  controls.autoRotateSpeed = 2;
  // // 设置相机距离原点的最远距离
  controls.minDistance = 800;
  // 设置相机距离原点的最远距离
  // controls.maxDistance = 30;
  controls.maxDistance = 3000;
  // 是否开启右键拖拽
  controls.enablePan = true;
  // 鼠标拖动
  controls.enableRotate = true

  controls.update();
  
  return controls
}