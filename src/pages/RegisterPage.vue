<script setup lang="ts">
import axios from 'axios'
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import CryptoJS from 'crypto-js'
 


const username = ref('')
const password = ref('')
const email = ref('')


const login=(username:string,password:string)=>{
  password=CryptoJS.MD5(password).toString()
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
      window.location.reload()
    }else{
      ElMessage({
        message:`登录失败，${res.data.message}`,
        type: 'error'
      })
    }
  })
}

const register=(username:string,password:string,email:string)=>{
  let originPassword=password
  password=CryptoJS.MD5(password).toString()
  axios({
    method:'post',
    url:'/api/user/register',
    params:{
      username:username,
      password:password,
      email:email,
      avatar:'https://img.duoziwang.com/2018/05/201712310823469.jpg'
    },
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      console.log('success')
      ElMessage({
        message: '注册成功，即将为你自动登陆',
        type: 'success'
      })
      login(username,originPassword)
    }else{
      console.log('fail')
      ElMessage({
        message:`注册失败，${res.data.message}`,
        type: 'error'
      })
    }
  })
}
</script>

<template>
  <div class="content">
    <div class="box">
      <div class="text-3xl font-bold mb-5" style="color: #303446;">注册</div>
      <el-form>
        <el-form-item label="用户名">
          <el-input v-model="username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="email"  placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input show-password v-model="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-full" type="primary" @click="register(username,password,email)">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>

.box{
    min-width: 400px;
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