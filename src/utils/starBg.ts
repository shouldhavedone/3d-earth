import {
  Scene,
  TextureLoader,
  Points,
  AdditiveBlending,
  PointsMaterial,
  DynamicDrawUsage,
  BufferGeometry,
  Vector3,
  Color,
  Float32BufferAttribute
} from 'three'
import gradient from "@/assets/images/gradient.png";

export const initStarBg = (scene: Scene) => {
  const texture = new TextureLoader().load(gradient);
  const positions = [];
  const colors = [];
  const sizes = []
  const geometry = new BufferGeometry();
  for (let i = 0; i < 10000; i++) {
    let vertex = new Vector3();
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    positions.push(vertex.x, vertex.y, vertex.z);
    let color = new Color();
    color.setHSL(
      Math.random() * 0.2 + 0.5,
      0.55,
      Math.random() * 0.25 + 0.55
    );
    colors.push(color.r, color.g, color.b);
    sizes.push(Math.random() * 10)
  }

  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1).setUsage(DynamicDrawUsage));

  const shaderMaterial = new PointsMaterial({
    map: texture,
    size: 10,
    transparent: true,
    opacity: 1,
    vertexColors: true,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  });

  const stars = new Points(geometry, shaderMaterial);
  stars.name = 'star'
  stars.scale.set(2400, 2400, 2400);
  scene.add(stars);
  return stars
}