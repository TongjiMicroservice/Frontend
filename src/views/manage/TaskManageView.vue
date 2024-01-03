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

const currentTask=ref<Task>(new Task(-1,'','',-1,new Date,-1,new Date(),'','','',1))
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

const filteredTaskList=ref<Task[]>([])


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
  currentTaskMembers.value=[]
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
              userId:r.data.userId,
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
  loading.value=true
  taskList.value=[]
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
        let task:Task=new Task(data[i].id,data[i].name,data[i].description,data[i].leader,data[i].deadline,data[i].status,data[i].finishTime,data[i].file,data[i].leaderName,data[i].fileName,data[i].priority)
        taskList.value.push(task)
      }
      filterTask(taskType.value)
      loading.value=false
      return true
    } else {
      ElMessage({
        message: `获取任务列表失败，${res.data.message}`,
        type: 'error',
      });
      loading.value=false
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
    return member.userId!==store.state.currentUser.id
  })


  waitToAddMembers.value=waitToAddMembers.value.filter((member)=>{
    return !currentTaskMembers.value.some((m) => m.userId === member.userId)
  })

}

const addTaskMember=(id:number)=>{
  waitToAddMembers.value.forEach((member)=>{
    if(member.userId===id){
      toAddMembers.value.push(member)
    }
  })
  waitToAddMembers.value=waitToAddMembers.value.filter((member)=>{
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

const deleteTask=(taskId:number)=>{
  axios({
    method:'delete',
    url:'/api/task/delete',
    params:{
      taskId:taskId
    }
  }).then((r)=>{
    if(r.status===200&&r.data.code===200){
      ElMessage({
        message: `删除任务成功`,
        type: 'success',
      });
      getTaskList()
    }else{
      ElMessage({
        message: `删除任务失败，${r.data.message}`,
        type: 'error',
      });
    }
  })
}


const addAllTaskMember=()=>{
  addTaskMemberVisible.value=false
  const promises = toAddMembers.value.map((member) => {
    return axios({
      method: 'post',
      url: '/api/task/member/add',
      params: {
        taskId: currentTask.value.taskId,
        memberId: member.userId
      }
    }).then((res) => {
      if (res.status === 200 && res.data.code === 200) {
        ElMessage({
          message: `添加任务成员${member.username}成功`,
          type: 'success',
        });
      } else {
        ElMessage({
          message: `添加任务成员${member.username}失败，${res.data.message}`,
          type: 'error',
        });
      }
    })
  });

  Promise.all(promises).then(() => {
    getTaskMembers(currentTask.value.taskId)
  });
}


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
      priority:currentTask.value.priority
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

const windowWidth=ref(window.innerWidth)
const windowHeight=ref(window.innerHeight)

const getScreenSize=()=>{
  windowWidth.value=window.innerWidth
  windowHeight.value=window.innerHeight

  // pageSize.value=(Math.floor((windowHeight.value-200)/70))
}

const loading=ref(false)


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
      return task.status===1&&new Date(task.deadline)>new Date()
    })
  }else if(type==='finished'){
    filteredTaskList.value=taskList.value.filter((task)=>{
      return task.status===2
    })
  }
}

onMounted(() => {
  getTaskList()

  getCurrentProjectMembers()

  window.addEventListener('resize',getScreenSize)

  getScreenSize()


})
</script>

<template>
  <div class="h-full w-full">
    <div class="w-full p-2 pt-10 flex justify-between">
      <el-radio-group
        v-model="taskType"
        class="pl-1"
        @change="filterTask(taskType)"
      >
        <el-radio label="all">全部</el-radio>
        <el-radio label="unfinished">未完成</el-radio>
        <el-radio label="toreview">待审批</el-radio>
        <el-radio label="finished">已完成</el-radio>
        <el-radio label="outdate">已过期</el-radio>
      </el-radio-group>
      <el-button class="mr-20" type="primary" @click="createTaskVisible=true">创建任务</el-button>
    </div>
    <div class="w-full py-4 overflow-auto">
      <el-table v-loading="loading" stripe :data="filteredTaskList.slice(start,start+pageSize)" class="w-full">
        <el-table-column  fixed prop="name" label="名称"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.status===0&&new Date(scope.row.deadline)<new Date()" type="warning">已过期</el-tag>
            <el-tag v-else-if="scope.row.status===0&&new Date(scope.row.deadline)>new Date()" type="danger">未完成</el-tag>
            <el-tag v-else-if="scope.row.status===1&&new Date(scope.row.deadline)>new Date()" type="primary">待审批</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column  label="截止时间">
          <template #default="scope">
            {{ new Date(scope.row.deadline).toDateString() }}
          </template>
        </el-table-column>
        <el-table-column  prop="leaderName" label="负责人"></el-table-column>
        <el-table-column  v-if="taskType==='toreview'||taskType==='finished'" prop="score" label="评分"></el-table-column>
        <el-table-column  v-if="taskType==='toreview'||taskType==='finished'" prop="finishedTime" label="提交时间"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link size="small" @click="handleTaskOpen(scope.row)">
              查看详情
            </el-button>
            <el-button link size="small" type="danger" @click="deleteTask(scope.row.taskId)">
              删除任务
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
          <el-form-item label="任务优先级">
            <el-select v-model="currentTask.priority">
              <el-option label="普通" value="1"></el-option>
              <el-option label="紧急" value="2"></el-option>
              <el-option label="非常紧急" value="3"></el-option>
            </el-select>
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
        <p class="py-1">负责人: {{ currentTask.leaderName }}</p>
        <p class="py-1">任务提交:{{ currentTask.finishedTime }}</p>
        <p class="py-1">任务文件:{{ currentTask.file }}</p>
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
    <div class="py-3 flex justify-center items-center">
      <el-pagination layout="prev, pager, next" :total="filteredTaskList.length" background :page-size="pageSize" v-model:current-page="currentPage" />
    </div>
  </div>
</template>

<style scoped>
.task-card {
  width: 300px;
  min-height: 150px;
  max-height: 300px;
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