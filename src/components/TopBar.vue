<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute,useRouter } from 'vue-router';
import {useStore} from 'vuex'
import axios from 'axios'
import Project from '@/models/Project'
import { ElMessage } from 'element-plus';
const projectList = ref<Project[]>([])
const currentProject=ref<Project>(new Project(-1,'','',-1,-1))

const router = useRouter()
const store=useStore()
const route=useRoute()


const handleSelect = (index:string, indexPath:string) => {
  if(index.startsWith('3-')){
    console.log(index)
    let id=parseInt(index.split('-')[1])
    currentProject.value=projectList.value[id-1]
    window.localStorage.setItem(`${store.state.currentUser.id}_currentProject`,currentProject.value.id.toString())
    store.commit('setCurrentProjectId',currentProject.value.id)
    console.log(window.localStorage.getItem(`${store.state.currentUser.id}_currentProject`))
    window.location.reload()
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

const getProjectList=async ():Promise<boolean>=>{
  return axios({
    method: 'get',
    url: '/api/project/project-by-user',
    params: {
      userId: store.state.currentUser.id
    }
  }).then((r)=>{
    if(r.status===200&&r.data.code===200){
      for (let i = 0; i < r.data.projectDataList.length; i++) {
        let project=new Project(r.data.projectDataList[i].id,r.data.projectDataList[i].name,r.data.projectDataList[i].description,r.data.projectDataList[i].scale,r.data.projectDataList[i].leader)
        projectList.value.push(project)
      }
      console.log('获取到的项目列表',projectList.value)
      if(projectList.value.length>0){
        store.commit('setProjects',projectList.value)
        console.log('vuex中的项目列表',store.state.projects)
        store.commit('setHasProject',true)
        return true
      }else{
        ElMessage({
          message: '你还没有项目，快去创建一个吧',
          type: 'warning'
        })
        store.commit('setHasProject',false)
        return false
      }
    }else{
      ElMessage({
        message: `获取项目列表失败,${r.data.message}`,
        type: 'error'
      })
      return false
    }
  })
}

const getRole=async (projectId:number)=>{
  axios({
    method:'get',
    url:'/api/project/privilege',
    params:{
      userId:store.state.currentUser.id,
      projectId:projectId
    }
  }).then((r)=>{
    if(r.status===200&&r.data.code===200){
      if(r.data.privilege===1){
        store.commit('setRole','member')
      }else if(r.data.privilege===2){
        store.commit('setRole','admin')
      }else if(r.data.privilege===3){
        store.commit('setRole','leader')
      }
      ElMessage({
        message: `获取权限信息成功,你的权限是${store.state.role}`,
        type: 'success'
      })
    }else{
      ElMessage({
        message: `获取权限信息失败,${r.data.message}`,
        type: 'error'
      })
    }
  })
}
const currentProjectId=computed(()=>{
  return store.state.currentProjectId
})

watch(currentProjectId ,()=>{
  projectList.value=store.state.projects
  currentProject.value=store.state.projects.find((project:Project)=>project.id===currentProjectId.value)!
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
      <el-image src="/logo.png" fit="contain" style="height: 50px; width: 50px;"></el-image>
    </el-menu-item>
    <el-menu-item index="2">
      <h1>TeamSphere</h1>
    </el-menu-item>
    <div style="flex-grow: 6;"/>
    <el-sub-menu index="3" style="flex-grow: 0.1;">
      <template #title>{{ currentProject.name }}</template>
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