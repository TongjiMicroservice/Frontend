
<!--<template>-->
<!--  <div class="box">-->
<!--    <div ref="vantaRef" style="width: 100%; height: 1000px">-->
<!--      <br>-->
<!--      <h1> &nbsp; Welcome to TeamSphere！  </h1>-->
<!--    </div>-->
<!--  </div>-->

<!--</template>-->
<template>
  <div class="box">
    <div ref="vantaRef" style="width: 100%; height: 1000px">
      <br>
      <h1> &nbsp; Welcome to TeamSphere！  </h1>
      <div class="card-container">
        <div class="card blue-card">
          加入已有项目
        </div>
        <div class="card green-card">
          我要创建项目
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import GLOBE from "vanta/src/vanta.globe";

export default {
  data() {
    return {};
  },
  mounted() {
    this.vantaEffect = GLOBE({
      el: this.$refs.vantaRef,
      THREE: THREE,
    });
    VANTA.GLOBE({
      el: this.$refs.vantaRef,
      /*以下为样式配置*/
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x91aae3,
      backgroundColor: 0xf4f1f9,
    });
  },
  beforeDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  },
};
</script>

<style lang="less" scoped>
.box {
  position: relative;
  .banner {
    z-index: 999;
    position: absolute;
    top: 30%;
    left: 10%;
    color: #fff;
  }
}
h1 {
  font-size: 66px;
}
p {
  margin-top: 60px;
  font-size: 18px;
}
//.card-container {
//  display: flex;
//  justify-content: center;
//  gap: 20px;
//  position: absolute;
//  top: 50%;
//  left: 50%;
//  transform: translate(-50%, -50%);
//}
.card-container {
  display: flex;
  justify-content: flex-end; /* 水平方向靠右 */
  align-items: flex-start; /* 垂直方向靠上 */
  gap: 30px; /* 设置卡片之间的间距为 30px */
  position: absolute;
  top: 240px; /* 距离顶部 10px */
  left: 30px; /* 距离右边 10px */
  transform: none; /* 移除 transform */
}

.card {
  width: 400px;
  height: 200px;
  border-radius: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 26px;
  font-weight: bold;
  opacity: 0.5;
}

.blue-card {
  background-color: #000066; /* 深蓝色 */
}

.green-card {
  background-color: #007f80; /* 深绿色 */
}
</style>


