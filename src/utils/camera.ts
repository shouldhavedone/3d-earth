import { PerspectiveCamera } from 'three'

export const initCamera = (width: number, height: number) => {
  const camera = new PerspectiveCamera(45, width / height, 0.1, 100000)
  camera.position.set(-270, 680, -900)
  camera.lookAt(0, 0, 0)
  return camera;
}

export const initMapCamera = (width: number, height: number) => {
  const camera = new PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 10, -100)
  camera.lookAt(0, 0, 0)
  return camera;
}