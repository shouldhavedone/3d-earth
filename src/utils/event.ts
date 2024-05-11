import { WebGLRenderer, Raycaster, Vector2, PerspectiveCamera, Object3D, OrbitControls } from 'three'
import { GlobalConfig } from './config';

import ChangeCamera from './change/camera';


export const initEvent = (renderer: WebGLRenderer, camera: PerspectiveCamera, earthObj: Object3D, parentDom: HTMLElement, controls: OrbitControls) => {
  renderer.domElement.addEventListener('click', (event: PointerEvent) => {
    event.preventDefault();
    const raycaster = new Raycaster();
    let x = (event.clientX / parentDom.clientWidth) * 2 - 1;
    let y = -(event.clientY / parentDom.clientHeight) * 2 + 1;
    raycaster.setFromCamera(new Vector2(x, y), camera);
    const child = earthObj.children.filter((item: any) => item.type === "Group");
    const intersects = raycaster.intersectObjects(child || []);
    if (intersects.length > 0) {
      changeScene(camera, controls)
      setTimeout(() => {
        earthObj.visible = false
      }, 3000)
    }
  })
}


export const changeScene = (camera: PerspectiveCamera, controls: OrbitControls) => {

  const cameraChange = new ChangeCamera(camera, controls, 3000, [GlobalConfig.chinaCamaPositions[1]])

  const update = () => {
    camera.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z
    );
    controls.update();
  };

  controls.minDistance = 50;

  cameraChange.load()?.start()?.setUpdate(update).setComplete(() => {
    controls.maxDistance = 300;
  })
}