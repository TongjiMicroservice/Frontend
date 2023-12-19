<script setup lang="ts">
import {ref} from 'vue'
const username = ref('')
const password = ref('')

const login=(username:string,password:string)=>{
    console.log(username,password)
}
</script>

<template>
  <div class="container">
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
    width: 40%;
    height: 40%;
    background-color: #161b22;
    border-radius: 10px;
    padding: 20px;
    border: 1px solid #30363d;
}

.container{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>