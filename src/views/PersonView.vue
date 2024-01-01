<template>
  <div id="container" style="margin:auto; width: 100%; height: 100%;">
    <div id="header" style="text-align: center;">
    <h1 style="margin-bottom:0;">个人信息页面</h1>
    </div>
      <!-- Profile Information Section -->
    <div id="personalInfor" style="width: 60%; float: left; height: 100%; box-sizing: border-box;">
        <!-- User Avatar Section -->
        <div id="avatar" style="text-align: center; padding: 20px;">
        <!-- Display user's avatar/image here -->
        <img :src="usrAvatar" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%;" />
      </div>


      <el-form  label-width="150px" style="margin-bottom: 20px;">
        <!-- Id -->
        <el-form-item label="Id">
          <el-input v-model="userId" :disabled="true"></el-input>
        </el-form-item>

        <!-- Name -->
        <el-form-item label="Name">
          <el-input v-model="userName" :disabled="!editMode"></el-input>
        </el-form-item>
   
        <!-- Mail -->
        <el-form-item label="Email">
          <el-input v-model="userEmail" :disabled="!editMode"></el-input>
        </el-form-item>
  
        <!-- Message -->
        <el-form-item label="Message">
          <el-input v-model="userMessage" :disabled="!editMode"></el-input>
        </el-form-item>

        <el-form-item label="password" v-if="editMode">
          <el-input v-model="userPassword" :disabled="!editMode"></el-input>
        </el-form-item>
        <el-form-item label="confirm password" v-if="editMode">
          <el-input v-model="confirmPassword" :disabled="!editMode"></el-input>
        </el-form-item>
         <!-- Set Button -->
        <el-form-item >
          <el-button  type="primary" v-if="!editMode" @click="enterEditMode">设置</el-button>
        </el-form-item>
  
         <!-- Confirm and Cancel Buttons -->
         <el-form-item  v-if="editMode">
        <el-button type="primary" plain @click="confirmEdit" >确认</el-button>
        <el-button type="danger" plain @click="cancelEdit" v-if="editMode">取消</el-button>
        </el-form-item>
      </el-form>
  
    </div>
  
    <div id="content" style="width:40%; float:right; height: 500px; box-sizing: border-box;">
      <el-scrollbar max-height="500px" >
        <div v-for="project in projects" :key="project.id">
          <Project :projectName="project.name" :projectId="project.id" />
        </div>
        <el-button :icon="plus">添加项目</el-button>
      </el-scrollbar>
    </div>
    <div id="footer" style="clear:both; text-align:center;">
      版权 © Tongji software 2023
    </div>
  </div>
  
  
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import Project from "@/components/Project.vue";
  import { useStore } from 'vuex'
  import { ref } from 'vue'
  import User from "@/models/User";
  import { ElMessage } from "element-plus";
  import axios from "axios";
  import { MD5 } from "crypto-js";
  const store = useStore()


  const usrAvatar = ref(store.state.currentUser.avatar)
  const userId = ref(store.state.currentUser.id)
  const userName = ref(store.state.currentUser.name)
  const userEmail = ref(store.state.currentUser.email)
  const userMessage = ref('')

  const userPassword = ref('')

  const confirmPassword = ref('')
  const editMode = ref(false)
  const enterEditMode = () => {
    editMode.value = true
  }

  const getUserInfor = () => {
    console.log("获取用户信息",store.state.currentUser.id,)
    //  "code": 0,
    //"message": "string",
    //"userId": 0,
    //"username": "string",
    //"email": "string",
    //"avatar": "string"
    console.log(store.state.currentUser.id)
    axios({
      method: 'get',
      url: '/api/user/info',
      params: {
        userId: store.state.currentUser.id,
      }
    })
      .then((r) => {
        
        if (r.status === 200 && r.data.code === 200) {
          ElMessage({
            message: '获取成功',
          })
          userMessage.value = r.data.data.message
          userId.value = r.data.data.userId
          userName.value = r.data.data.username
          userEmail.value = r.data.data.email
          usrAvatar.value = r.data.data.avatar
        } else {
          ElMessage({
            message: `获取失败,${r.data.message}`,
            type: 'error'
          })
        }
      })
      .catch((error) => {
        // 输出错误信息
        console.error('Axios Error:', error);
  });
  }
  const confirmEdit = () => {
    console.log("修改密码")
    if (userPassword.value !== confirmPassword.value) {
      ElMessage({
        message: '两次输入的密码不一致',
        type: 'error'
      })
      return
    }
    editMode.value = false
    store.commit('updateUser', new User(store.state.currentUser.id, userName.value, userEmail.value, store.state.currentUser.avatar))
    userPassword.value = MD5(userPassword.value).toString()

    console.log(userPassword.value)
    axios({
      method: 'patch',
      url: '/api/user/update',
      params: {
        username: userName.value,
        email: userEmail.value,
        password: userPassword.value,
        avatar: store.state.currentUser.avatar,
      }
    })
      .then((r) => {
        if (r.status === 200 && r.data.code === 200) {
          ElMessage({
            message: '修改成功',
          })
        } else {
          ElMessage({
            message: `修改失败,${r.data.message}`,
            type: 'error'
          })
        }
      })
      .catch((error) => {
        // 输出错误信息
        console.error('Axios Error:', error);
  });

  }

  const cancelEdit = () => {
    editMode.value = false
    userName.value = store.state.currentUser.name
    userEmail.value = store.state.currentUser.email
  }

  onMounted(() => {
    getUserInfor();
  });
  
  </script>
  
  
  <style scoped>
  </style>
  