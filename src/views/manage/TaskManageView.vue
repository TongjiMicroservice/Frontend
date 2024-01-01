<script setup lang="ts">
import {ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import Task  from '@/models/Task';
import { useStore } from 'vuex';
import { Plus } from '@element-plus/icons-vue';

const store = useStore();
const pageSize=ref(8);
const currentPage=ref(1);

const currentTask=ref<Task>(new Task(-1,'','',-1,new Date,-1))
const dialogVisible=ref(false)
const currentTaskMembers=ref<{
  userId:number,
  username:string,
  avatar:string
}[]>([])

const currentProjectMembers=ref<{
  userId:number,
  username:string,
  avatar:string
  privilege:number
}[]>([])

const taskList = ref<Task[]>([]);

const finishedTaskList=computed(()=>taskList.value.filter((task)=>task.status===1))

const unfinishedTaskList=computed(()=>taskList.value.filter((task)=>task.status===0))

const showTaskList=computed(()=>{
  if(taskType.value==='all'){
    return taskList.value
  }else if(taskType.value==='finished'){
    return finishedTaskList.value
  }else{
    return unfinishedTaskList.value
  }
})

const start=computed(()=>(currentPage.value-1)*pageSize.value)

const handleTaskOpen=(task:Task)=>{
  currentTask.value=task
  dialogVisible.value=true
  getTaskMembers(task.taskId)
}

const toAddMembers=ref<{
  userId:number,
  username:string,
  avatar:string
  privilege:number
}[]>([])

const waitToAddMembers=ref<{
  userId:number,
  username:string,
  avatar:string
  privilege:number
}[]>([])

const getTaskMembers=(taskId:number)=>{
  axios({
    method:'get',
    url:'/api/task/member/get',
    params:{
      taskId:taskId
    }
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      let data=res.data.taskMember
      currentTaskMembers.value=[]
      for(let i=0;i<data.length;i++){
        axios.get('/api/user/info',{
          params:{
            userId:data[i].id
          }
        }).then((r)=>{
          if(r.status===200&&r.data.code===200){
            let user={
              userId:r.data.userid,
              username:r.data.username,
              avatar:r.data.avatar
            }
            currentTaskMembers.value.push(user)
            console.log(currentTaskMembers.value)
          }else{
            ElMessage({
              message: `获取任务成员失败，${r.data.message}`,
              type: 'error',
            });
          }
        })
      }
    }else{
      ElMessage({
        message: `获取任务成员失败，${res.data.message}`,
        type: 'error',
      });
    }
  })
}

const getTaskList = ():Promise<Boolean> => {
  return axios({
    method: 'get',
    url: '/api/task/list-by-project',
    params: {
      projectId: store.state.currentProjectId,
    },
  }).then((res) => {
    if (res.status === 200 && res.data.code === 200) {
      let data=res.data.taskData
      for(let i=0;i<res.data.taskData.length;i++){
        let task:Task=new Task(data[i].taskId,data[i].name,data[i].description,data[i].leader,data[i].deadline,data[i].status)
        taskList.value.push(task)
      }
      return true
    } else {
      ElMessage({
        message: `获取任务列表失败，${res.data.message}`,
        type: 'error',
      });
      return false
    }
  });
};

const getCurrentProjectMembers=()=>{
  axios({
    method:'get',
    url:'/api/project/member/get',
    params:{
      projectId:store.state.currentProjectId
    }
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      let data=res.data.members
      currentProjectMembers.value=[]
      for(let i=0;i<data.length;i++){
        axios.get('/api/user/info',{
          params:{
            userId:data[i].userId
          }
        }).then((r)=>{
          if(r.status===200&&r.data.code===200){
            let user={
              userId:r.data.userId,
              username:r.data.username,
              avatar:r.data.avatar,
              privilege:data[i].privilege
            }
            currentProjectMembers.value.push(user)
            console.log(currentProjectMembers.value)
          }else{
            ElMessage({
              message: `获取项目成员失败，${r.data.message}`,
              type: 'error',
            });
          }
        })
      }
    }else{
      ElMessage({
        message: `获取项目成员失败，${res.data.message}`,
        type: 'error',
      });
    }
  })
}

const addTaskMemberVisible=ref(false)

const showAddTaskMember=()=>{
  addTaskMemberVisible.value=true
  toAddMembers.value=[]
  waitToAddMembers.value=currentProjectMembers.value
  waitToAddMembers.value=waitToAddMembers.value.filter((member)=>{
    return member.userId!==store.state.currentUser.id&&currentTaskMembers.value.every((taskMember)=>{
      return taskMember.userId!==member.userId
    })
  })
  getTaskMembers(currentTask.value.taskId)

}

const addTaskMember=(id:number)=>{
  waitToAddMembers.value.forEach((member)=>{
    if(member.userId===id){
      toAddMembers.value.push(member)
    }
  })
  waitToAddMembers.value=currentProjectMembers.value.filter((member)=>{
    return member.userId!==id
  })
}

const removeTaskMember=(id:number)=>{

  toAddMembers.value.forEach((member)=>{
    if(member.userId===id){
      waitToAddMembers.value.push(member)
    }
  })

  toAddMembers.value=toAddMembers.value.filter((member)=>{
    return member.userId!==id
  })
  
}


const addAllTaskMember=()=>{
  addTaskMemberVisible.value=false
  toAddMembers.value.forEach((member)=>{
    axios({
      method:'post',
      url:'/api/task/member/add',
      params:{
        taskId:currentTask.value.taskId,
        memberId:member.userId
      }
    }).then((res)=>{
      if(res.status===200&&res.data.code===200){
        ElMessage({
          message: `添加任务成员${member.username}成功`,
          type: 'success',
        });
      }else{
        ElMessage({
          message: `添加任务成员${member.username}失败，${res.data.message}`,
          type: 'error',
        });
      }
    })
  })
}

const view=ref('task_overview')

const taskType=ref('all')

const createTaskVisible=ref(false)

const createTask=()=>{
  axios({
    method:'post',
    url:'/api/task/create',
    params:{
      projectId:store.state.currentProjectId,
      name:currentTask.value.name,
      description:currentTask.value.description,
      deadline:currentTask.value.deadline,
      leader:store.state.currentUser.id,
      priority:1
    }
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      ElMessage({
        message: `创建任务成功`,
        type: 'success',
      });
      createTaskVisible.value=false
      getTaskList()
    }else{
      ElMessage({
        message: `创建任务失败，${res.data.message}`,
        type: 'error',
      });
    }
  })
}


onMounted(() => {
  getTaskList()

  getCurrentProjectMembers()
})
</script>

<template>
  <div class="h-full w-full">
    <div class="w-full h-1/6 pt-10">
      <el-radio-group v-model="view">
        <el-radio-button label="task_overview">任务概览</el-radio-button>
        <el-radio-button label="task_review">任务审批</el-radio-button>
      </el-radio-group>
    </div>
    <div class="w-full p-2 flex justify-between" v-if="view==='task_overview'">
      <el-radio-group
        v-model="taskType"
        class="pl-1"
      >
        <el-radio label="all">全部</el-radio>
        <el-radio label="unfinished">未完成</el-radio>
        <el-radio label="finished">已完成</el-radio>
      </el-radio-group>
      <el-button class="mr-20" type="primary" @click="createTaskVisible=true">创建任务</el-button>
    </div>
    <el-space wrap class="h-1/3" v-if="view==='task_overview'">
      <p v-if="taskList.length===0">项目还没有任务，请<span class="create-task" @click="createTaskVisible=true">创建</span>项目的第一个任务</p>
      <div v-else v-for="(task,index) in showTaskList.slice(start,start+pageSize)" :key="index" class="w-1/3 p-3" @click="handleTaskOpen(task)">
        <div class="task-card">
          <div class="p-3 flex flex-col w-full">
            <h1 class="text-xl font-bold py-1">{{ task.name }}</h1>
            <p class="py-1">任务状态: <span v-if="task.status===0" >未完成</span><span v-if="task.status===1" >已完成</span></p>
            <p class="py-1">任务内容: {{ task.description }}</p>
            <p class="py-1">截止时间: {{ task.deadline }}</p>
          </div>
        </div>
      </div>
    </el-space>
    <el-dialog
      v-model="createTaskVisible"
      title="创建任务"
      draggable
    >
      <div class="p-3 flex flex-col w-full">
        <el-form label-width="80px">
          <el-form-item label="任务名称">
            <el-input v-model="currentTask.name" placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item label="任务内容">
            <el-input v-model="currentTask.description" placeholder="请输入任务内容"></el-input>
          </el-form-item>
          <el-form-item label="截止时间">
            <el-date-picker
              v-model="currentTask.deadline"
              type="datetime"
              placeholder="选择日期"
              value-format="YYYY-MM-DDTHH:mm"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="flex items-center justify-end" >
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="createTask">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible"
      title="任务详情"
      draggable
    >
      <div class="p-3 flex flex-col w-full">
        <h1 class="text-xl font-bold py-1">{{ currentTask.name }}</h1>
        <p class="py-1">任务状态: {{ currentTask.status }}</p>
        <p class="py-1">任务内容: {{ currentTask.description }}</p>
        <p class="py-1">截止时间: {{ currentTask.deadline }}</p>
      </div>
      <h1 class="text-xl font-bold p-3">任务成员</h1>
      <el-space class="p-3">
        <el-avatar
          v-for="(member,index) in currentTaskMembers"
          :key="index"
          class="member-avatar"
          >{{ member.username }}</el-avatar>
        <el-avatar class="add-member" :icon="Plus" @click="showAddTaskMember" />
      </el-space>
    </el-dialog>
    <el-dialog
      v-model="addTaskMemberVisible"
      title="添加任务成员"
      draggable
    >
      <div class="flex flex-col items-start justify-center w-full">
        <p class="font-bold text-2xl p-2">待添加成员</p>
        <el-space class="p-2 w-full" wrap>
          <el-avatar class="member-avatar" v-for="(member,index) in toAddMembers" :key="index" @click="removeTaskMember(member.userId)">{{member.username}}</el-avatar>
        </el-space>
        <p class="font-bold text-2xl p-2">项目成员</p>
        <el-space class="p-2 w-full" wrap >
          <el-avatar class="member-avatar" v-for="(member,index) in waitToAddMembers" :key="index" @click="addTaskMember(member.userId)">{{member.username}}</el-avatar>
        </el-space> 
      </div>
      <template #footer>
        <span class="flex items-center justify-end" >
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addAllTaskMember">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="h-1/3" v-if="view==='task_overview'">
      <el-col :span="10"/>
      <el-pagination layout="prev, pager, next" :total="showTaskList.length" background :page-size="pageSize" v-model:current-page="currentPage" />
    </el-row>
  </div>
</template>

<style scoped>
.task-card {
  width: 100%;
  height: 100%;
  background-color: #24273a;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.task-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
  cursor: pointer;
}

.member-avatar{
  position: relative;
  cursor: pointer;
}

.create-task{
  color: greenyellow;
  cursor: pointer;
  text-decoration: underline;
}


.add-member:hover{
  cursor: pointer;
}
</style>