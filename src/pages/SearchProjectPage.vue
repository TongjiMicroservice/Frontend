<template>
  <div class="flex justify-center">
    <div class="flex flex-col mx-5 items-center w-3/4 mt-5">
      <el-input placeholder="请输入搜索内容" v-model="searchQuery" class="my-5 w-3/4">
        <template #append>
          <el-button icon="Search" type="text" @click="handleSearch"></el-button>
        </template>
      </el-input>
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div class="flex flex-row flex-wrap w-full">
            <div v-for="index in 6" :key="index" class="w-1/2 p-2">
              <el-card>
                <el-skeleton-item variant="h4"></el-skeleton-item>
                <el-skeleton-item variant="text"></el-skeleton-item>
                <el-skeleton-item variant="text"></el-skeleton-item>
                <el-skeleton-item variant="text"></el-skeleton-item>
              </el-card>
            </div>
          </div>
        </template>
        <template #default>
          <div class="flex flex-row flex-wrap w-full">
            <div v-for="(project, index) in projects.slice(start,start+pageSize)" :key="index" class="w-1/2 p-2">
              <el-card :body-style="{ padding: '20px' }" class="w-full">
                <h4>{{ project.name }}</h4>
                <p class="my-1">项目简介:{{ project.description }}</p>
                <p class="my-1">项目规模:{{ project.scale }}人</p>
                <!-- <el-button color="#626ae6"  plain>详情</el-button> -->
                <el-button color="#626aef" @click="applyProject(project)" >加入</el-button>
              </el-card>
            </div>
          </div>
        </template>
      </el-skeleton>
      
      <el-pagination
        layout="prev, pager, next"
        background
        :total="projects.length"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        class="my-5"></el-pagination>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Project from '@/models/Project'
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus'



const searchQuery = ref('')


const projects=ref<Project[]>([])
const pageSize=ref(6)
const currentPage=ref(1)
const start=computed(()=>(currentPage.value-1)*pageSize.value)
const loading=ref(false)
const currentProject=ref<Project>(new Project(-1,'','',0,-1))

const handleSearch=()=>{
  projects.value=projects.value.filter((project)=>{
    return project.name.includes(searchQuery.value)
  })
}

const applyProject=(project:Project)=>{
  currentProject.value=project
  ElMessageBox.confirm(
        `确定要加入项目${project.name}吗？`,
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
  ).then(() => {
    axios({
          method:'post',
          url:'/api/project/request',
          params:{
            projectId:project.id
          }
        }).then((r)=>{
          if(r.status===200&&r.data.code===200){
            ElMessage({
              message: `已发送加入项目${project.name}申请`,
              type: 'success'
            })
          }else{
            ElMessage({
              message: `发送加入项目${project.name}申请失败,${r.data.message}`,
              type: 'error'
            })
          }
        })
  }).catch(() => {
  })
}

const handleCurrentChange=(val:number)=>{
  currentPage.value=val
}

const getAllProjects=()=>{
  loading.value=true
  axios({
    method:'get',
    url:'/api/project/all',
  }).then((r)=>{
    if(r.status===200&&r.data.code===200){
      projects.value=r.data.projectDataList
    }else{
      ElMessage({
        message: `获取项目列表失败,${r.data.message}`,
        type: 'error'
      })
    }
  })
  loading.value=false
}
onMounted(()=>{
  getAllProjects()
})

</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  line-height: 60px;
}
.el-dialog__header {
  background-color: #f0f2f5;
  color: #606266;
}

.el-dialog__body {
  font-size: 16px;
}

</style>
