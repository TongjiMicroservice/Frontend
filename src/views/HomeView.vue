<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import {useStore} from 'vuex'
import Task from '@/models/Task'
import { ElMessage } from 'element-plus';
import TaskCard from '@/components/TaskCard.vue'

const store=useStore()

const pageSize=ref(3)
const currentPage=ref(1)
const start=computed(()=>(currentPage.value-1)*pageSize.value)


const taskList=ref<Task[]>([])
const loading=ref(false)

const getTaskList=()=>{
  taskList.value=[]
  loading.value=true
  axios({
    method:'get',
    url:'/api/task/list-by-member',
    params:{
      userId:store.state.currentUser.id
    }
  }).then((res)=>{
    if (res.status===200&&res.data.code===200){
      let data=res.data.taskData
      for(let i=0;i<data.length;i++){
        let task=new Task(data[i].id,data[i].name,data[i].description,data[i].leader,data[i].deadline,data[i].status,data[i].finishedTime,data[i].file,data[i].leaderName,data[i].fileName,data[i].priority)
        taskList.value.push(task)
      }
      filterTask(type.value)
      loading.value=false
    }else{
      ElMessage({
        message: `获取任务列表失败,${res.data.message}`,
        type: 'error'
      })
      loading.value=false
    }
  })
}

const filteredTaskList=ref<Task[]>([])

const filterTask=(type:string)=>{
  if(type==='all'){
    filteredTaskList.value=taskList.value
  }else if(type==='outdate'){
    filteredTaskList.value=taskList.value.filter((task)=>{
      return task.status===0&&new Date(task.deadline)<new Date()
    })
  }else if(type==='unfinished'){
    filteredTaskList.value=taskList.value.filter((task)=>{
      return task.status===0&&new Date(task.deadline)>new Date()
    })
  }else if(type==='toreview'){
    filteredTaskList.value=taskList.value.filter((task)=>{
      return task.status===1
    })
  }else if(type==='finished'){
    filteredTaskList.value=taskList.value.filter((task)=>{
      return task.status===2
    })
  }
}

const id=computed(()=>store.state.currentUser.id)

watch(id,()=>{
  getTaskList()
})

const type=ref('all')

onMounted(()=>{
  if(store.state.currentUser.id!==-1){
    getTaskList()
  }
})


</script>

<template>
  <div class="flex flex-col justify-start w-full p-10">
    <div class="flex justify-between items-center w-full">
      <p class="font-bold text-3xl">任务列表</p>
      <el-radio-group v-model="type" @change="filterTask(type)">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="outdate">已过期</el-radio-button>
        <el-radio-button label="unfinished">未完成</el-radio-button>
        <el-radio-button label="toreview">待审核</el-radio-button>
        <el-radio-button label="finished">已完成</el-radio-button>
      </el-radio-group>
    </div>
    
    <el-row v-loading="loading" class="py-4">
      <div v-if="filteredTaskList.length===0" class="w-full h-full flex justify-center items-center">
        <p class="font-bold text-3xl" >这里还没有任务</p>
      </div>
      <el-col v-else :span="8" v-for="(task,index) in filteredTaskList.slice(start,start+pageSize)" :key="index">
        <div class="p-2">
          <TaskCard @submit="getTaskList" :task="task"/>
        </div>
      </el-col>
    </el-row>
    <div class="py-3 flex justify-center items-center">
      <el-pagination hide-on-single-page layout="prev, pager, next" :total="filteredTaskList.length" background :page-size="pageSize" v-model:current-page="currentPage" />
    </div>
  </div>
  
</template>

<style scoped>
.task-status{
  margin-left: 8px;
  margin-right: 8px;
  margin-bottom: 15px;
  margin-top: 15px;
  width: 30%;
  background-color:#24273a;
}

.meeting-card{
  margin-left: 5px;
  margin-right: 5px;
}
</style>
