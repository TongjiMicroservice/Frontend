
<template>
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
          src="./assets/logo.jpg"
      />
    </el-menu-item>
    <el-menu-item index="0-2">
      <h1>一站式协作平台</h1>
    </el-menu-item>
    <div class="flex-grow" >

      </div>
      <el-menu-item index="1" disabled>充值</el-menu-item>
    <el-menu-item index="2"><RouterLink to="/">主页</RouterLink></el-menu-item>
    <el-menu-item index="3"><RouterLink to="/help">帮助</RouterLink></el-menu-item>
    <el-menu-item index="4">
    <div style="text-align:right;">
      <el-button type="info" >退出</el-button>
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
          <el-menu-item index="0">
            <el-icon><ChatDotSquare /></el-icon>
            <span>聊天列表</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <RouterLink to="/about">
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
            <RouterLink to="/calendar">
            <el-icon><DocumentChecked /></el-icon>
            <span>日程规划</span>
              </RouterLink >
          </el-menu-item>
          <el-menu-item index="3">
            <RouterLink to="/meeting">
            <el-icon><document /></el-icon>
            <span>会议管理</span>
          </RouterLink>
          </el-menu-item>
          <el-menu-item index="4">
            <RouterLink to="/position">
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
    <el-col :span="1">
    </el-col>
    <el-col :span="18">
      <RouterView />
    </el-col>
  </el-row>

  </template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { RouterLink, RouterView } from 'vue-router'

  const selected_item = ref('1')
  const activeIndex = ref('1')
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
.router-link-active {
  text-decoration: none;
  color: rgb(248, 209, 53);
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
