import {
  TextureLoader,
  Texture,
  BufferGeometry,
  ShaderMaterial,
  Points,
  Float32BufferAttribute,
  Vector3,
  Color,
} from "three";
import { IAddFly } from '../type'


export class InitFlyLine {
  flyId: number;
  flyArr: Points[];
  baicSpeed: number;
  texture: Texture | number;
  flyShader: {
    vertexshader: string,
    fragmentshader: string
  };

  constructor({
    texture
  }: {
    texture: Texture
  }) {
    this.flyId = 0;
    this.flyArr = [];
    this.baicSpeed = 1;
    this.texture = 0.0;
    if (texture && !texture.isTexture) {
      this.texture = new TextureLoader().load(texture)
    } else {
      this.texture = texture;
    }
    this.flyShader = {
      vertexshader: ` 
        uniform float size; 
        uniform float time; 
        uniform float u_len; 
        attribute float u_index;
        varying float u_opacitys;
        void main() { 
            if( u_index < time + u_len && u_index > time){
                float u_scale = 1.0 - (time + u_len - u_index) /u_len;
                u_opacitys = u_scale;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * u_scale * 300.0 / (-mvPosition.z);
            } 
        }
        `,
      fragmentshader: ` 
        uniform sampler2D u_map;
        uniform float u_opacity;
        uniform vec3 color;
        uniform float isTexture;
        varying float u_opacitys;
        void main() {
            vec4 u_color = vec4(color,u_opacity * u_opacitys);
            if( isTexture != 0.0 ){
                gl_FragColor = u_color * texture2D(u_map, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
            }else{
                gl_FragColor = u_color;
            }
        }`
    }
  }

  addFly({
    color = "rgba(255,255,255,1)",
    curve = [],
    width = 1,
    length = 10,
    speed = 1,
    repeat = 1,
    texture = null,
    callback
  }: IAddFly) {
    let colorArr = this.getColorArr(color);
    let geometry: BufferGeometry = new BufferGeometry();
    let material: ShaderMaterial = new ShaderMaterial({
      uniforms: {
        color: { value: colorArr[0], type: "v3" },
        size: { value: width, type: "f" },
        u_map: { value: texture ? texture : this.texture, type: "t2" },
        u_len: { value: length, type: "f" },
        u_opacity: { value: colorArr[1], type: "f" },
        time: { value: -length, type: "f" },
        isTexture: { value: 1.0, type: "f" }
      },
      transparent: false,
      depthTest: true,
      vertexShader: this.flyShader.vertexshader,
      fragmentShader: this.flyShader.fragmentshader
    });
    const [position, u_index]: [Array<number>, Array<number>] = [[], []];
    curve.forEach((elem: Vector3, index: number) => {
      position.push(elem.x, elem.y, elem.z);
      u_index.push(index);
    })
    geometry.setAttribute("position", new Float32BufferAttribute(position, 3));
    geometry.setAttribute("u_index", new Float32BufferAttribute(u_index, 1));
    let mesh = new Points(geometry, material);
    mesh.name = "fly";
    mesh._flyId = this.flyId;
    mesh._speed = speed;
    mesh._repeat = repeat;
    mesh._been = 0;
    mesh._total = curve.length;
    mesh._callback = callback;
    this.flyId++;
    this.flyArr.push(mesh);
    return mesh
  }

  tranformPath(arr: Vector3[], dpi: number = 1) {
    const vecs = [];
    for (let i = 1; i < arr.length; i++) {
      let src = arr[i - 1];
      let dst = arr[i];
      let s = new Vector3(src.x, src.y, src.z);
      let d = new Vector3(dst.x, dst.y, dst.z);
      let length: number = s.distanceTo(d) * dpi;
      for (let i = 0; i <= length; i++) {
        vecs.push(s.clone().lerp(d, i / length))
      }
    }
    return vecs;
  }

  remove(mesh: Points) {
    mesh.material.dispose();
    mesh.geometry.dispose();
    this.flyArr = this.flyArr.filter(elem => elem._flyId != mesh._flyId);
    mesh.parent.remove(mesh);
    mesh = null;
  }

  animation(delta: number = 0.015) {
    if (delta > 0.2) return;
    this.flyArr.forEach(elem => {
      if (!elem.parent) return;
      if (elem._been > elem._repeat) {
        elem.visible = false;
        if (typeof elem._callback === 'function') {
          elem._callback(elem);
        }
        this.remove(elem)
      } else {
        let uniforms = elem.material.uniforms;
        if (uniforms.time.value < elem._total) {
          uniforms.time.value += delta * (this.baicSpeed / delta) * elem._speed;
        } else {
          elem._been += 1;
          uniforms.time.value = -uniforms.u_len.value;
        }
      }
    })
  }

  color(c: any = "rgba(255,255,255,1)") {
    return new Color(c);
  }

  getColorArr(str: any) {
    if (Array.isArray(str)) return str;
    let _arr = [];
    str = (str + '').toLowerCase().replace(/\s/g, "");
    if (/^((?:rgba)?)\(\s*([^\)]*)/.test(str)) {
      let arr = str.replace(/rgba\(|\)/gi, '').split(',');
      let hex = [
        pad2(Math.round(arr[0] * 1 || 0).toString(16)),
        pad2(Math.round(arr[1] * 1 || 0).toString(16)),
        pad2(Math.round(arr[2] * 1 || 0).toString(16))
      ];
      _arr[0] = this.color('#' + hex.join(""));
      _arr[1] = Math.max(0, Math.min(1, (arr[3] * 1 || 0)));
    } else if ('transparent' === str) {
      _arr[0] = this.color();
      _arr[1] = 0;
    } else {
      _arr[0] = this.color(str);
      _arr[1] = 1;
    }

    function pad2(c: string) {
      return c.length == 1 ? '0' + c : '' + c;
    }
    return _arr;
  }
}