import { IEarthConfig } from '../type'

export class GlobalConfig {
  static earthRadius: number = 450
  static camaPositions = [
    { x: -810, y: 2040, z: -2700 }, //远
    { x: -270, y: 680, z: -900 }, //近
  ]

  static chinaCamaPositions = [
    { x: -270, y: 680, z: -900 }, // 远
    { x: 0, y: 200, z: -10 }, // 近
  ]

  static default: IEarthConfig = {
    showStats: false,
    showGui: false,
    enterAnimation: false,
    star: {
      autoRotate: false,
      show: false,
    },
    earth: {
      autoRotate: false,
      sprite: false,
      outLine: false,
    },
    city: {
      stroke: false,
      flyLine: false,
      line: false,
      point: false,
      light: false,
    }
  }
}


