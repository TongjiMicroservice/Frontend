<script setup lang="ts">
import axios from 'axios'
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'

const username = ref('')
const password = ref('')

const router=useRouter()

const login=(username:string,password:string)=>{
  axios({
    method:'post',
    url:'/api/user/login',
    params:{
      username:username,
      password:password
    },
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      console.log('success')
      ElMessage({
        message: '登录成功',
        type: 'success'
      })
      let tokenvalue=res.data.data.tokenValue
      window.localStorage.setItem('token',tokenvalue)
      router.push('/home')
    }else{
      console.log('fail')
    }
  })
}
</script>

<template>
  <div class="content">
    <div class="box">
      <el-form>
        <el-form-item label="用户名">
          <el-input v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login(username,password)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
    
</template>

<style scoped>

.box{
    min-width: 500px;
    backdrop-filter: blur(11px) saturate(180%) brightness(105%);
    -webkit-backdrop-filter: blur(11px) saturate(180%);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(209, 213, 219, 0.3);
    padding: 15px;
}

.content{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>