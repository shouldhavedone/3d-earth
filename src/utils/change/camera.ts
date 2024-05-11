import * as TWEEN from 'tween'
import { PerspectiveCamera, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


interface IChangeCameraConfig {
  ease: string,
  type: string,
}

class ChangeCamera {
  time: number;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  tween: any;
  posArr: Vector3[];
  config: IChangeCameraConfig | undefined = {
    ease: 'Quadratic',
    type: 'InOut',
  }

  constructor(
    camera: PerspectiveCamera,
    controls: OrbitControls,
    time: number = 3000,
    posArr: Vector3[],
    config?: IChangeCameraConfig,
  ) {
    this.camera = camera
    this.controls = controls
    this.time = time
    this.posArr = posArr
    this.config = config
  }

  load() {
    if (this.tween) {
      this.tween.stop()
    }
    if (this.posArr.length < 1) {
      return
    }
    if (this.posArr.length === 1) {
      this.posArr.unshift(this.camera.position)
    }
    this.tween = new TWEEN.Tween(this.posArr[0])
      .to(this.posArr[1], this.time)
      .easing(TWEEN.Easing[this.config?.ease || 'Quadratic'][this.config?.type || 'InOut'])

    return this;
  }

  start() {
    this.tween.start();
    return this;
  }

  stop() {
    this.tween.stop();
    return this;
  }

  setUpdate(update: Function) {
    this.tween.onUpdate(update);
    return this;
  }

  setComplete(complete: Function) {
    this.tween.onComplete(complete);
    return this;
  }

  get() {
    return this.tween;
  }

}


export default ChangeCamera