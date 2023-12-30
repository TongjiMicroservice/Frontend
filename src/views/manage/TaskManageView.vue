<script setup lang="ts">
import {ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import Task  from '@/models/Task';
import { useStore } from 'vuex';
import { Plus } from '@element-plus/icons-vue';

const store = useStore();
const pageSize=ref(10);
const currentPage=ref(1);

const currentTask=ref<Task>(new Task(-1,'','',-1,new Date,-1))
const dialogVisible=ref(false)
const currentTaskMembers=ref<{
  userId:number,
  username:string,
  avatar:string
}[]>([])

const taskList = ref<Task[]>([]);

const handleTaskOpen=(task:Task)=>{
  currentTask.value=task
  dialogVisible.value=true
  getTaskMembers(task.taskId)
}

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

onMounted(() => {
  getTaskList()
})

  // taskList.value.push(new Task(1,'任务1','任务1的描述',9,new Date,0,[new User(1,'张三','','default_avatar.png'),new User(2,'李四','','default_avatar.png')]))
  // taskList.value.push(new Task(2,'任务2','任务2的描述',9,new Date,1,[new User(1,'张三','','default_avatar.png'),new User(2,'李四','','default_avatar.png')]))
  // taskList.value.push(new Task(3,'任务3','任务3的描述',9,new Date,2,[new User(1,'张三','','default_avatar.png'),new User(2,'李四','','default_avatar.png')]))
  // taskList.value.push(new Task(4,'任务4','任务4的描述',9,new Date,3,[new User(1,'张三','','default_avatar.png'),new User(2,'李四','','default_avatar.png')]))
  // taskList.value.push(new Task(5,'任务5','任务5的描述',9,new Date,4,[new User(1,'张三','','default_avatar.png'),new User(2,'李四','','default_avatar.png')]))

</script>

<template>
    <el-space wrap class="h-3/4">
      <p v-if="taskList.length===0">项目还没有任务，请创建项目的第一个任务</p>
      <div v-else v-for="(task,index) in taskList" :key="index" class="w-1/3 p-3" @click="handleTaskOpen(task)">
        <div class="task-card">
          <div class="p-3 flex flex-col w-full">
            <h1 class="text-xl font-bold py-1">{{ task.name }}</h1>
            <p class="py-1">任务状态: {{ task.status }}</p>
            <p class="py-1">任务内容: {{ task.description }}</p>
            <p class="py-1">截止时间: {{ task.deadline }}</p>
          </div>
        </div>
      </div>
    </el-space>
    <el-dialog
      v-model="dialogVisible"
      title="任务详情"
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
        <el-avatar class="add-member" :icon="Plus" />
      </el-space>
    </el-dialog>
    <div class="flex justify-center items-center py-5" v-if="taskList.length>0">
      <el-pagination layout="prev, pager, next" :total="taskList.length" />
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
  cursor: pointer;
}

.add-member:hover{
  cursor: pointer;
}
</style>