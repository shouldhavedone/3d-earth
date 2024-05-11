import { TextureLoader, Sprite, SpriteMaterial } from 'three'
import { GlobalConfig } from '../config'
import earthAperture from "@/assets/images/earth_aperture.jpg";

export const createSprite = () => {
  const texture = new TextureLoader().load(earthAperture)
  const spriteMaterial = new SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  const sprite = new Sprite(spriteMaterial);
  sprite.scale.set(GlobalConfig.earthRadius * 3, GlobalConfig.earthRadius * 3, 1);
  return sprite;
}