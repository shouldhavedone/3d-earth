import { WebGLRenderer, PCFShadowMap } from 'three'

export const initRenderer = (width: number, height: number) => {
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer
}