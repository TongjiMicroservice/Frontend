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
        <div v-for="project in projectList" :key="project.id">
          <ProjectCard :project=project />
        </div>
        <div class="centered-container">
          <el-button type="primary" @click="addProgram">添加项目</el-button>
        </div>
      </el-scrollbar>
    </div>
    <div id="footer" style="clear:both; text-align:center;">
      版权 © Tongji software 2023
    </div>
  </div>
  
  
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import ProjectCard from "@/components/ProjectCard.vue";
  import { useStore } from 'vuex'
  import {useRouter} from 'vue-router'
  import { ref } from 'vue'
  import User from "@/models/User";
  import { ElMessage } from "element-plus";
  import axios from "axios";
  import { MD5 } from "crypto-js";
  import Project from '@/models/Project'
  const store = useStore()
  const router=useRouter()
  const projectList=ref<Project[]>([])

  const usrAvatar = ref(store.state.currentUser.avatar)
  const userId = ref(store.state.currentUser.id)
  const userName = ref(store.state.currentUser.name)
  const userEmail = ref(store.state.currentUser.email)

  const userPassword = ref('')

  const confirmPassword = ref('')
  const editMode = ref(false)
  const enterEditMode = () => {
    editMode.value = true
  }

  const addProgram = () => {
    router.push('/create_project')
    
  }

  const getUserInfor = () => {
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
            message: '用户信息获取成功',
          })
          userName.value = r.data.data.username
          userEmail.value = r.data.data.email
          usrAvatar.value = r.data.data.avatar
        } else {
          ElMessage({
            message: `用户信息获取失败,${r.data.message}`,
            type: 'error'
          })
        }
      })
      .catch((error) => {
        // 输出错误信息
        console.error('Axios Error:', error);
  });
  }

  const getProjectList= ()=>{
    axios({
      method: 'get',
      url: '/api/project/project-by-user',

    }).then((r)=>{
        if (r.status === 200 && r.data.code === 200) {
          ElMessage({
            message: '获取项目列表成功',
          })
          console.log('获取到的项目列表长度',r.data.projectDataList.length)
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
    getProjectList();
  });
  
  </script>
  
  
  <style scoped>
  .centered-container {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
}

/* 如果需要垂直居中对齐，可以添加以下样式 */
.centered-container > * {
  margin: 0 8px; /* 用于调整图标和按钮之间的间距 */
}
  </style>
  