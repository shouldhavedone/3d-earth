# 前言
最近这几天简单的研究了一下`threejs`，在看了看大佬们写的3D地球，想着只研究不写点案例就有点手痒的原则，就简单的写了一个3D地球
部分代码借鉴了大佬的开源项目代码
用的技术栈 vue3 + typescript + vite

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a96f593045704251b4f7ebb62925b4e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=3794562&e=png&b=09122e)

# 一、环境搭建
首先就是 搭建场景、渲染器、相机、灯光等。这些是开发threejs项目的基础必备模块，这里就不多说了，能看到这个文章的肯定都是知道的。我将这些初始化操作都分开了，有兴趣的可以看看`源码`

```typescript
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
```

# 二、创建星空背景
* 为了让3D地球展示起来没有这么光秃秃，加一个星空的效果会更加的好看
* 由于星空效果会有很多的点，这里使用`BufferGeometry`来减少数据开销，大小、位置这些就随机在一定范围内生成了
* 使用了一张白色光点的图片作为贴图，配合点材质`PointsMaterial`来作为星空的材质
```typescript
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
```
* 再创建好点之后，通过`scale`进行放大处理，就可以达到星空的效果

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7508cc6ac4b24df98f67ef47319b97b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=118314&e=png&b=242424)
* 做出来差不多就这样，再简单的加一个背景图，星空效果就做好了

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/421fd87a65f047da833f0106ca1aade7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=3781075&e=png&b=09112d)

# 三、创建地球
* 地球其实就是一个 球体 + 贴图
* 贴图我是百度图库随便找的一个，看起来还可以

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3d74483b75f45d5b910b3942fa338fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=871&h=432&s=850246&e=png&b=1a2b5b)

```typescript
  const earthObj = new Object3D();
  const texture = new TextureLoader().load(earthImg);
  const lightMap = new TextureLoader().load(earthLight);
  let earthOutLine: Object3D | null = null
  let flyManager: InitFlyLine;
  let waveMeshObj: Group;

  const globeGgeometry: SphereGeometry = new SphereGeometry(GlobalConfig.earthRadius, 100, 100);
  const globeMaterial: MeshStandardMaterial = new MeshStandardMaterial({
    map: texture,
    lightMap: lightMap,
    flatShading: true,
    fog: false,
  });

  const globeMesh = new Mesh(globeGgeometry, globeMaterial);
  globeMesh.name = 'earth'
  // earthObj.rotation.set(0.5, 2.9, 0.1);
  earthObj.add(globeMesh);
```
* 代码很简单，就不多说了，创建好了添加到场景里面去就行了

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec9081622b6f44fbaecf74c50b184649~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=3796193&e=png&b=080f29)

# 四、创建中国描边和流光动效
## 中国描边

* 这里是根据geojson的数据来生成地图的，简单的将各个省份这些进行了画线
* 要数据的话可以直接去 [https://datav.aliyun.com/portal/school/atlas/area_selector...](https://datav.aliyun.com/portal/school/atlas/area_selector#&lat=33.50475906922609&lng=104.2822265625&zoom=4) 自行下载
* 通过循环遍历geojson中的省份数据，将对应的经纬度转换为球面上的坐标xyz，根据这些坐标使用Line生成轮廓线条

```typescript
export const createMapStroke = () => {
  const cityStroke = new Object3D();
  cityStroke.name = "cityStroke";

  const lineMaterial = new LineBasicMaterial({
    color: 0xf19553,
  });

  chinaInfoJson.features.forEach((elem: any) => {
    const provinceLine = new Group();
    provinceLine.name = elem.properties.name;
    const coordinates = elem.geometry.coordinates;
    coordinates.forEach((multiPolygon: any) => {
      multiPolygon.forEach((polygon: any) => {
        const line = createCityLine(polygon, lineMaterial);
        provinceLine.add(line);
      });
    });
    cityStroke.add(provinceLine);
  })

  return { cityStroke }
}

/**
 * 球面画线
 * @param polygon 
 * @param lineMaterial 
 */
export const createCityLine = (polygon: any, lineMaterial: LineBasicMaterial) => {
  const positions = [];
  const linGeometry = new BufferGeometry();
  for (let i = 0; i < polygon.length; i++) {
    let pos = lglt2xyz(polygon[i][0], polygon[i][1]);
    positions.push(pos.x, pos.y, pos.z);
  }
  linGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(positions, 3)
  );

  return new Line(linGeometry, lineMaterial)
}

/**
 * @description 经纬度转换球面坐标
 * @param longitude 
 * @param latitude 
 */
export const lglt2xyz = (longitude: number, latitude: number) => {
  const theta = (90 + longitude) * (Math.PI / 180);
  const phi = (90 - latitude) * (Math.PI / 180);
  return new Vector3().setFromSpherical(
    new Spherical(GlobalConfig.earthRadius, phi, theta)
  );
}
```

* 搞出来效果就是下面这样

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/360009b81c9f4f2981f7762cbfe1b164~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=3810459&e=png&b=070c26)

## 流光动效
* 在上面的地址里面去下载中国外边框的geojson数据
* 这里是参考了另一位大佬的代码，具体就不过多描述了
* 主要实现方式类似于上面中国描边的方式，但是是生成Points，并且通过`Shader`来生成流光效果，并通过动画进行跑动

```typescript
export const createEarthOutLine = () => {
  const map = new Object3D();
  chinaOutLineJson.features.forEach((elem) => {
    const province = new Object3D();
    const coordinates = elem.geometry.coordinates;
    coordinates.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        if (polygon.length > 200) {
          let v3ps = [];
          for (let i = 0; i < polygon.length; i++) {
            let pos = lglt2xyz(polygon[i][0], polygon[i][1]);
            v3ps.push(pos);
          }
          let curve = new CatmullRomCurve3(v3ps, false);
          let color = new Vector3(
            0.5999758518718452,
            0.7798940272761521,
            0.6181903838257632
          );
          let flyLine = initFlyLine(
            curve,
            {
              speed: 0.5,
              color: color,
              number: 3, //同时跑动的流光数量
              length: 0.2, //流光线条长度
              size: 3, //粗细
            },
            5000,
          );
          province.add(flyLine);
        }
      });
    });
    map.add(province);
  });

  return map;
}

export const initFlyLine = (curve: CatmullRomCurve3, matSetting: any, pointsNumber: number) => {
  const points = curve.getPoints(pointsNumber);
  const geometry = new BufferGeometry().setFromPoints(points);
  const length = points.length;
  let percents = new Float32Array(length);
  for (let i = 0; i < points.length; i += 1) {
    percents[i] = i / length;
  }
  geometry.setAttribute("percent", new BufferAttribute(percents, 1));
  const lineMaterial = initLineMaterial(matSetting);
  const flyLine = new Points(geometry, lineMaterial);
  return flyLine;
}

```

* 核心的关键就是`Shader`
```typescript
const lineMaterial = new ShaderMaterial({
    uniforms: {
      time: { type: "f", value: 0.0 },
      number: { type: "f", value: number },
      speed: { type: "f", value: speed },
      length: { type: "f", value: length },
      size: { type: "f", value: size },
      color: { type: "v3", value: color },
    },
    vertexShader: `
      varying vec2 vUv;
      attribute float percent;
      uniform float time;
      uniform float number;
      uniform float speed;
      uniform float length;
      varying float opacity;
      uniform float size;
      void main()
      {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          float l = clamp(1.0-length,0.0,1.0);
          gl_PointSize = clamp(fract(percent*number + l - time*number*speed)-l ,0.0,1.) * size * (1./length);
          opacity = gl_PointSize/size;
          gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif
      varying float opacity;
      uniform vec3 color;
      void main(){
          if(opacity <=0.2){
              discard;
          }
          gl_FragColor = vec4(color,1.0);
      }
    `,
    transparent: true,
    blending: AdditiveBlending,
  });

```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f34172d8c5714c879a9c0b68796c9230~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=3864416&e=png&b=070c26)

# 五、创建标记点和波纹
* 标记点和波纹都是通过创建平面缓冲几何体`PlaneGeometry`外加贴图来实现
* 标记点的点位都是通过转换经纬度为球面坐标得到的
```typescript
export const createCityPoints = (cityList: ICityList) => {
  const waveMeshArr: Group = new Group()
  waveMeshArr.name = 'cityPointWaveGroup'
  const pointMeshArr: Group = new Group()
  pointMeshArr.name = 'cityPointGroup'
  let texture = new TextureLoader().load(biaozhu);
  let texture2 = new TextureLoader().load(bzguangquan);
  for (const cityName in cityList) {
    let city = cityList[cityName];
    let lon = city.longitude;
    let lat = city.latitude;
    let position = lglt2xyz(lon, lat);
    let waveMesh = createWaveMesh(position, texture2)
    let pointMesh = createPointMesh(position, texture)
    waveMeshArr.add(waveMesh)
    pointMeshArr.add(pointMesh)
  }
  return { waveMeshArr, pointMeshArr }
}

/**
 * @description 创建标记点
 * @param position 
 * @param texture 
 */
export const createPointMesh = (position: Vector3, texture: Texture) => {
  const planeGeometry: PlaneGeometry = new PlaneGeometry(1, 1);
  const material: MeshBasicMaterial = new MeshBasicMaterial({
    color: '#6edade',
    map: texture,
    transparent: true,
    opacity: 1.0,
    depthWrite: false,
  })
  let mesh: Mesh = new Mesh(planeGeometry, material);
  let size: number = GlobalConfig.earthRadius * 0.035;
  mesh.scale.set(size, size, size);

  mesh.position.set(position.x, position.y, position.z);
  mesh.privateType = "cityPoint";
  mesh.layerType = "city";
  let coordVec3 = new Vector3(position.x, position.y, position.z).normalize();
  let meshNormal = new Vector3(0, 0, 1);
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
  // mesh.userData.quaternion = mesh.quaternion;
  return mesh;
}

```
* 波纹的动画是通过修改波纹mesh的scale以及材质透明度来达到的
```typescript

/**
 * @description 波纹动画
 * @param waveMeshArr 
 */
export const waveMeshAnimate = (waveMeshArr: any) => {
  if (!waveMeshArr || !waveMeshArr?.children?.length) return false;
  waveMeshArr.children.forEach((mesh: Mesh) => {
    mesh._s += 0.005;
    mesh.scale.set(
      mesh.size * mesh._s,
      mesh.size * mesh._s,
      mesh.size * mesh._s
    );
    if (mesh._s <= 1.3) {
      mesh.material.opacity = (mesh._s - 1) * 2;
    } else if (mesh._s > 1.3 && mesh._s <= 1.6) {
      mesh.material.opacity = 1 - (mesh._s - 1.3) * 2;
    } else {
      mesh._s = 1.0;
    }
  });
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b518ff7640774a9c99f5c1b7fa72b44b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=3975755&e=png&b=070c25)

# 六、标记点连线与飞线
* 已经知道一条飞线的首尾两点的经纬度，首先将经纬度转为坐标，再通过这两个点计算得到中间点，创建一条`三维三次贝塞尔曲线`
* 这里我将曲线分成了50段，并存下来这50段对应的点位
* Line的颜色我写的一个渐变色，感觉好看一点点
* 最后创建一个线`Line`，写得很简单
```typescript
export const addCityLine = (v0: Vector3, v3: Vector3) => {
  const { v1, v2 } = getCubicBezierCenterPoint(v0, v3)
  let curve = new CubicBezierCurve3(v0, v1, v2, v3)

  let points = curve.getSpacedPoints(50);
  let positions = [];
  let colors = [];
  let color = new Color();

  for (let j = 0; j < points.length; j++) {
    color.setHSL(.31666 + j * 0.005, 0.7, 0.5); //绿色
    colors.push(color.r, color.g, color.b);
    positions.push(points[j].x, points[j].y, points[j].z);
  }
  let geometry = new BufferGeometry().setFromPoints(points);
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  let matLine = new LineBasicMaterial({
    linewidth: 0.0016,
    vertexColors: true,
  });
  const mesh = new Line(geometry, matLine)
  return mesh
}
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2a74e744fec40a8b336ca9e42b87f83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=3814399&e=png&b=080e28)

* 飞线的话，也是同样使用的`三维三次贝塞尔曲线`，主要是确保飞线会和标记点连线重叠上，并且根据首位点的距离分成了对应的段数
* 关于具体飞线的实现，是参考了别的大佬的代码，这就不过多阐述了

```typescript
export const addFlyLine = (
  earthObj: Object3D,
  flyManager: InitFlyLine,
  fromCity: ICity,
  toCity: ICity,
  color: string,
) => {
  const curvePoints = new Array();
  let fromXyz = lglt2xyz(fromCity.longitude, fromCity.latitude);
  let toXyz = lglt2xyz(toCity.longitude, toCity.latitude);

  curvePoints.push(new Vector3(fromXyz.x, fromXyz.y, fromXyz.z));

  let distanceDivRadius =
    Math.sqrt(
      (fromXyz.x - toXyz.x) * (fromXyz.x - toXyz.x) +
      (fromXyz.y - toXyz.y) * (fromXyz.y - toXyz.y) +
      (fromXyz.z - toXyz.z) * (fromXyz.z - toXyz.z)
    ) / GlobalConfig.earthRadius
  let partCount = 3 + Math.ceil(distanceDivRadius * 3);

  const { v1, v2 } = getCubicBezierCenterPoint(fromXyz, toXyz)

  let curve = new CubicBezierCurve3(fromXyz, v1, v2, toXyz);

  let pointCount = Math.ceil(500 * partCount);

  let allPoints = curve.getPoints(pointCount);

  let flyMesh = flyManager.addFly({
    curve: allPoints,
    color: color,
    width: 4,
    length: Math.ceil((allPoints.length * 3) / 15),
    speed: partCount + 20,
    repeat: Infinity,
  });

  earthObj.add(flyMesh)
}

```
* 飞线的效果是通过`Shader`来实现的
```typescript
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
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d091adaf06a4e59a0ffd1fdcb8f885f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=957&s=3806104&e=png&b=080f2a)


# 总结
* 上面这些是我现在最开始研究了一两天的threejs写的一个简单的案例，并参考了数位大佬的代码，后面自己将会按照我的一点小想法再写点其它的什么东西。
* 以前在公司做过结合UE4云渲染 + 前端实现的一个 地球 > 中国 > 省份 > 城市 > 园区 > 机房 > 机柜 再到等等等，反正看着挺好看的，看看自己有空通过这个threejs能不能实现一个差不多的效果

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/febb24a66e2e4d00808fc148924c01fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=640&h=359&s=425705&e=png&b=051429)

[源码地址](https://gitee.com/shouldhavedone/3d-earth)，看看就行


