<template>
  <div id="container" class="container"></div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import Earth from './utils';

const cityList = {
  北京: { name: "北京", longitude: 116.3, latitude: 39.9 },
  上海: { name: "上海", longitude: 121.0, latitude: 31.0 },
  西安: { name: "西安", longitude: 108.0, latitude: 34.0 },
  成都: { name: "成都", longitude: 103.0, latitude: 31.0 },
  乌鲁木齐: { name: "乌鲁木齐", longitude: 87.0, latitude: 43.0 },
  拉萨: { name: "拉萨", longitude: 91.06, latitude: 29.36 },
  广州: { name: "广州", longitude: 113.0, latitude: 23.06 },
  哈尔滨: { name: "哈尔滨", longitude: 127.0, latitude: 45.5 },
  沈阳: { name: "沈阳", longitude: 123.43, latitude: 41.8 },
  武汉: { name: "武汉", longitude: 114.0, latitude: 30.0 },
  海口: { name: "海口", longitude: 110.0, latitude: 20.03 },
  纽约: { name: "纽约", longitude: -74.5, latitude: 40.5 },
  伦敦: { name: "伦敦", longitude: 0.1, latitude: 51.3 },
  巴黎: { name: "巴黎", longitude: 2.2, latitude: 48.5 },
  开普敦: { name: "开普敦", longitude: 18.25, latitude: -33.5 },
  悉尼: { name: "悉尼", longitude: 151.1, latitude: -33.51 },
  东京: { name: "东京", longitude: 139.69, latitude: 35.69 },
  里约热内卢: { name: "里约热内卢", longitude: -43.11, latitude: -22.54 },
};

const relationList = [
  {
    from: "北京",
    to: [
      "上海",
      "西安",
      "成都",
      "乌鲁木齐",
      "拉萨",
      "广州",
      "哈尔滨",
      // "沈阳",
      // "武汉",
      // "海口",
      // "纽约",
      // "伦敦",
      // "巴黎",
      // "开普敦",
      // "悉尼",
      // "东京",
      // "里约热内卢",
    ],
    color: `rgba(255, 255, 255, 1)`,
  },
]

onMounted(() => {
  const earth = new Earth('container', cityList, relationList, {
    showStats: false,
    enterAnimation: true,
    star: {
      show: true,
      autoRotate: true,
    },
    earth: {
      autoRotate: false,
      sprite: true,
      outLine: true,
    },
    city: {
      stroke: true,
      flyLine: true,
      line: true,
      point: true,
    }
  })
  earth.load()
})

</script>

<style>
.container {
  width: 100vw;
  height: 100vh;

  background: url("@/assets/images/xingkong.png") no-repeat;
  background-size: cover;
  background-position: center top;
}
</style>
