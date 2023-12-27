<script setup lang="ts">
import {ref} from 'vue'
import { useRouter } from 'vue-router';
const projectList = ref(['项目1','项目2','项目3'])

const router = useRouter()

const handleSelect = (index:string, indexPath:string) => {
  switch(index){
    case '1':
      console.log('logo')
      break
    case '2':
      console.log('TeamSphere')
      break
    case '3-1':
      console.log('项目1')
      break
    case '3-2':
      console.log('项目2')
      break
    case '3-3':
      console.log('项目3')
      break
    case '4':
      console.log('帮助')
      break
    case '5':
      console.log('登录')
      router.push('/login')
      break
  }
}
</script>

<template>
  <el-menu
    mode="horizontal"
    default-active="1"
    class="top-bar"
    @select="handleSelect"
    >
    <el-menu-item index="1">
      <el-image src="/logo.jpg" fit="contain" style="height: 50px; width: 50px;"></el-image>
    </el-menu-item>
    <el-menu-item index="2">
      <h1>TeamSphere</h1>
    </el-menu-item>
    <div style="flex-grow: 6;"/>
    <el-sub-menu index="3" style="flex-grow: 0.1;">
      <template #title>项目列表</template>
      <el-menu-item v-for="(project,index) in projectList" :key="index"  :index="`3-${index+1}`">{{ project }}</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="5">
      <span>登录</span>
    </el-menu-item>
    <el-menu-item index="4">
      帮助
    </el-menu-item>

  </el-menu>
</template>

<style scoped>
.top-bar{
  background: rgb(52,40,252);
  background: linear-gradient(184deg, rgba(52,40,252,1) 27%, rgba(78,68,247,1) 100%);
  border:0px;
}
</style>