import * as THREE from 'three'
import TWEEN from 'tween'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/addons/libs/stats.module.js';
import { initScene } from './scene';
import { initCamera } from './camera';
import { initRenderer } from './renderer';
import { initLight } from './light';
import { initControls } from './control';
import { initStarBg } from './starBg';
import { createEarthMesh } from './earth';
import { waveMeshAnimate } from './city/cityPoint'
import { InitFlyLine } from './flyLine';
import { IEarthConfig, IflyData, ICityList } from './type'
import { GlobalConfig } from './config'
import { outLineAnimation } from './earth/outLine'
import { initEvent } from './event';
import { createChinaMesh } from './china'


class Earth {
  stats: Stats;
  width: number;
  height: number;
  parentDom: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  orbitControl: OrbitControls;
  stars: THREE.Points;
  earthObj: THREE.Object3D;
  earthOutLine: THREE.Object3D;
  waceMeshArr: THREE.Object3D[] = [];
  cityList: ICityList;
  relationList: IflyData[];
  flyManager: InitFlyLine | null = null;

  constructor(
    containerId: string,
    cityList: ICityList,
    relationList: IflyData[],
    config?: IEarthConfig,
  ) {
    this.parentDom = document.getElementById(containerId) as HTMLElement;
    this.width = this.parentDom.offsetWidth;
    this.height = this.parentDom.offsetHeight;

    GlobalConfig.earthRadius = config?.radius ?? GlobalConfig.earthRadius;
    GlobalConfig.default = Object.assign({}, GlobalConfig.default, config || {});

    this.cityList = cityList
    this.relationList = relationList
    this.init()
  }

  /**
   * 初始化3D场景
   */
  init() {
    // 初始化渲染器
    this.renderer = initRenderer(this.width, this.height)
    // 初始化场景
    this.scene = initScene();
    // 初始化相机
    this.camera = initCamera(this.width, this.height);
    this.parentDom.appendChild(this.renderer.domElement);
    // 初始化光源
    initLight(this.scene);
    // 初始化轨道控制
    this.orbitControl = initControls(this.camera, this.renderer)

    if (GlobalConfig.default.showStats) {
      this.stats = new Stats();
      this.parentDom.appendChild(this.stats.dom);
    }
  }

  /**
   * 加载模型
   */
  load() {
    if (GlobalConfig.default.star.show) {
      this.stars = initStarBg(this.scene)
    }
    const { earthObj, earthOutLine, waveMeshObj, flyManager } = createEarthMesh(this.cityList, this.relationList)
    this.waceMeshArr = waveMeshObj
    this.earthOutLine = earthOutLine;
    this.earthObj = earthObj;
    this.flyManager = flyManager;
    this.scene.add(earthObj)
    const { chinaObj } = createChinaMesh()
    this.scene.add(chinaObj)

    if (GlobalConfig.default.enterAnimation) {
      this.enterAnimate(3000)
    }
    this.animate()

    window.onresize = () => {
      this.resize()
    }

    initEvent(this.renderer, this.camera, this.earthObj, this.parentDom, this.orbitControl)
  }

  /**
   * 入场动画
   */
  enterAnimate(time: number) {
    const tween = new TWEEN.Tween(GlobalConfig.camaPositions[0])
      .to(GlobalConfig.camaPositions[1], time)
      .easing(TWEEN.Easing.Quadratic.InOut);
    const update = () => {
      this.camera.position.set(
        GlobalConfig.camaPositions[0].x,
        GlobalConfig.camaPositions[0].y,
        GlobalConfig.camaPositions[0].z
      );
    };

    tween.onUpdate(update);
    tween.start();
  }

  /**
   * 场景渲染
   */
  animate() {
    if (GlobalConfig.default.star.show && GlobalConfig.default.star.autoRotate && this.stars) {
      this.stars.rotation.y += 0.0001
    }
    if (GlobalConfig.default.earth.autoRotate && this.earthObj) {
      this.earthObj.rotation.y += 0.001
    }
    if (this.stats && GlobalConfig.default.showStats) {
      this.stats.update()
    }
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
    this.afterAnimate();
  }

  afterAnimate() {
    TWEEN.update();
    if (this.flyManager != null) {
      this.flyManager.animation();
    }
    if (GlobalConfig.default.earth.outLine && this.earthOutLine != null) {
      outLineAnimation(this.earthOutLine)
    }
    waveMeshAnimate(this.waceMeshArr)
  }

  /**
   * 窗口变化
   */
  resize() {
    this.width = this.parentDom.offsetWidth;
    this.height = this.parentDom.offsetHeight;
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }
}


export default Earth;