<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import {useStore} from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import Project from '@/models/Project'
const projectList = ref<Project[]>([])
const currentProject=ref<Project>(new Project(-1,'','',-1,-1))

const router = useRouter()
const store=useStore()


const handleSelect = (index:string, indexPath:string) => {
  if(index.startsWith('3-')){
    console.log(index)
    let id=parseInt(index.split('-')[1])
    currentProject.value=projectList.value[id-1]
    window.localStorage.setItem(`${store.state.currentUser.id}_currentProject`,currentProject.value.id.toString())
    store.commit('setCurrentProjectId',currentProject.value.id)
    console.log(window.localStorage.getItem(`${store.state.currentUser.id}_currentProject`))
  }
  switch(index){
    case '1':
      console.log('logo')
      break
    case '2':
      console.log('TeamSphere')
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



watch (()=>store.state.projects,()=>{
  console.log('vuex中的项目列表',store.state.projects)
  projectList.value=store.state.projects
})
</script>

<template>
  <el-menu
    mode="horizontal"
    default-active="2"
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
      <el-menu-item v-for="(project,index) in projectList" :key="index"  :index="`3-${index+1}`">{{ project.name }}</el-menu-item>
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