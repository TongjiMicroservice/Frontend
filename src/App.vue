<script setup lang="ts">
import {RouterView } from 'vue-router'
import axios from 'axios'
import {ElMessage} from 'element-plus'
import {useRoute,useRouter} from 'vue-router'
import {useStore} from 'vuex'
import { onMounted } from 'vue'
import User from '@/models/User'

const store=useStore()
const router=useRouter()

onMounted(async ()=>{
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
    }else{
      if(res.data.code===401){
        ElMessage({
        message: '请先登录',
        type: 'warning'
      })
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
