
<template >
  <header>

    <!-- 头部区域 -->
    <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#2E2C2D"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
    >
      <el-menu-item index="0-1">
        <img
            style="width: 80px; height: 80px"
            src="../assets/logo.jpg"
        />
      </el-menu-item>
      <el-menu-item index="0-2">
        <h1>一站式协作平台</h1>
      </el-menu-item>
      <div class="flex-grow" >

      </div>
      <el-menu-item index="1" disabled>充值</el-menu-item>
      <el-menu-item index="2"><RouterLink to="/home">主页</RouterLink></el-menu-item>
      <el-menu-item index="3"><RouterLink to="/home/help">帮助</RouterLink></el-menu-item>
      <el-menu-item index="4">
        <div style="text-align:right;">
          <el-button type="info" ><RouterLink to="/">退出</RouterLink></el-button>
        </div>
      </el-menu-item>
    </el-menu >
  </header>
  <!--    侧栏-->
  <el-row style="height:100%;">
    <el-col :span="3" class="left-menu">
      <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          default-active="3"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          style="height:100%;"
      >
        <el-menu-item index="-1">
          <RouterLink to="/home/work">
            <el-icon><ChatDotSquare /></el-icon>
            <span>工作情况</span>
          </RouterLink >
        </el-menu-item>
        <el-menu-item index="0">
          <RouterLink to="/home/chat">
          <el-icon><ChatDotSquare /></el-icon>
          <span>聊天列表</span>
          </RouterLink >
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <RouterLink to="/home/member">
              <el-icon><UserFilled /></el-icon>
              <span>我的群组</span>
            </RouterLink >
          </template>

          <el-menu-item-group title="联系人">
            <el-menu-item index="1-1">好友1</el-menu-item>
            <el-menu-item index="1-2">联系人2</el-menu-item>
            <el-menu-item index="1-3">联系人3</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="群聊">


            <el-sub-menu index="1-4">
              <template #title>群1</template>
              <el-menu-item index="1-4-1">群内陌生人？</el-menu-item>
            </el-sub-menu>
          </el-menu-item-group>

        </el-sub-menu>
        <el-menu-item index="2">
          <RouterLink to="/home/calendar">
            <el-icon><DocumentChecked /></el-icon>
            <span>日程规划</span>
          </RouterLink >
        </el-menu-item>
        <el-menu-item index="3" >
          <RouterLink to="/home/meeting">
            <el-icon><document /></el-icon>
            <span>会议管理</span>
          </RouterLink >
        </el-menu-item>

        <el-menu-item index="4" disabled>
          <RouterLink to="/home/position">
            <el-icon><Place /></el-icon>
            <span>打卡签到</span>
          </RouterLink >
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><Monitor /></el-icon>
          <span>后台管理</span>
        </el-menu-item>
      </el-menu>

    </el-col>
    <el-col :span="21">
      <RouterView />
    </el-col>
  </el-row>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'


const activeIndex2 = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
import {
  DocumentChecked,
  Document,
  Monitor,
  UserFilled,
  Location,
  Place,
  ChatDotSquare ,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
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
a{
  text-decoration: none;
  color: white;
}
.flex-grow {
  flex-grow: 1;
}
.left-menu{
  height: 100vh;
}
</style>
