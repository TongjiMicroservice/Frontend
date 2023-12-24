<script setup lang="ts">
import {ref} from 'vue'
const username = ref('')
const password = ref('')

const login=(username:string,password:string)=>{
    console.log(username,password)
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
          <el-button type="primary" @click="login">登录</el-button>
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