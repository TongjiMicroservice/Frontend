<template>
    <div class="flex flex-col w-full mx-5">
      <el-input placeholder="请输入搜索内容" v-model="searchQuery" class="my-5">
        <template #append>
          <el-button icon="Search" type="text"></el-button>
        </template>
      </el-input>
      <el-row :gutter="20">
        <el-col :span="8" v-for="(project, index) in projects" :key="index">
          <el-card :body-style="{ padding: '20px' }">
            <h4>{{ project.name }}</h4>
            <p class="my-1">{{ project.description }}</p>
            <el-button color="#626ae6" :dark="isDark"  plain>详情</el-button>
            <el-button color="#626aef" :dark="isDark" >加入</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Project from '@/models/Project'
import axios from 'axios';
import { ElMessage } from 'element-plus'

const searchQuery = ref('')
const isDark = ref(false);

const projects=ref<Project[]>([])

const getAllProjects=()=>{
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
