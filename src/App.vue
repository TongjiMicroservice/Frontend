<script setup lang="ts">
import {RouterView } from 'vue-router'
import axios from 'axios'
import {ElMessage} from 'element-plus'
import {useRoute,useRouter} from 'vue-router'
import {useStore} from 'vuex'
import { onMounted,ref } from 'vue'
import User from '@/models/User'
import Project from '@/models/Project'

const store=useStore()
const router=useRouter()

const projectList=ref<Project[]>([])

const getProjectList=async ():Promise<boolean>=>{
  return axios({
    method: 'get',
    url: '/api/project/project-by-user',
    params: {
      userId: store.state.currentUser.id
    }
  }).then((r)=>{
    if(r.status===200&&r.data.code===200){
      projectList.value=r.data.projectDataList
      if(projectList.value.length>0){
        store.commit('setProjects',projectList.value)
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
    url:'/api/project/privilege/get',
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

onMounted(()=>{
  let currentUser=new User(-1,'anonymous','','/default_avatar.png')
  axios({
    method:'get',
    url:'/api/user'
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      currentUser.avatar=res.data.avatar
      currentUser.id=res.data.userid
      currentUser.email=res.data.email
      currentUser.name=res.data.username
      store.commit('login',currentUser)
      getProjectList().then((r)=>{
        if(r){
          let currentProjectId=window.localStorage.getItem(`${store.state.currentUser.id}_currentProject`)
          if(currentProjectId){
            console.log('从本地存储获取到当前项目',currentProjectId)
            store.commit('setCurrentProjectId',parseInt(currentProjectId))
            console.log('检查状态',store.state.currentProjectId)
          }else{
            console.log('从本地存储获取到当前项目失败，设置为第一个项目')
            store.commit('setCurrentProjectId',projectList.value[0].id)
          }
          getRole(store.state.currentProjectId)
          router.push('/home')
        }else{
          router.push('/create_project')
        }
      })
    }else{
      if(res.data.code===401){
        ElMessage({
          message: '请先登录',
          type: 'warning'
        })
        console.log('fail')
        router.push('/login')
      }
    }
  })
})


</script>

<template>
  <div class="h-screen w-screen">
    <RouterView class="w-full h-full"/>
  </div>
</template>

<style scoped>

</style>
