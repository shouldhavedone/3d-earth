import { Scene, AmbientLight, HemisphereLight, DirectionalLight } from 'three'

export const initLight = (scene: Scene) => {
  // 环境光
  const ambientLight: AmbientLight = new AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);
  // 平行光1
  const directionalLight: DirectionalLight = new DirectionalLight(0xffffff, 0.2);
  directionalLight.position.set(1, 0.1, 0).normalize();
  scene.add(directionalLight);
  // 平行光2
  const directionalLight2: DirectionalLight = new DirectionalLight(0xff2ffff, 0.2);
  directionalLight2.position.set(1, 0.1, 0.1).normalize();
  scene.add(directionalLight2);
  // 平行光3
  const directionalLight3: DirectionalLight = new DirectionalLight(0xffffff);
  directionalLight3.position.set(1, 500, -20);
  directionalLight3.castShadow = true;
  directionalLight3.shadow.camera.top = 18;
  directionalLight3.shadow.camera.bottom = -10;
  directionalLight3.shadow.camera.left = -52;
  directionalLight3.shadow.camera.right = 12;
  scene.add(directionalLight3);
  // 半球光
  const hemiLight: HemisphereLight = new HemisphereLight(0xffffff, 0x444444, 0.2);
  hemiLight.position.set(0, 1, 0);
  scene.add(hemiLight);
}