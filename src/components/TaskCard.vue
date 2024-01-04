<script setup lang="ts">
import Task from '@/models/Task';
import {onMounted,ref} from 'vue'
import axios from 'axios'
import {ElMessage} from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { genFileId } from 'element-plus'
import { useStore } from 'vuex';
const upload = ref<UploadInstance>()
const store=useStore()

const props=defineProps({
  task:{
    type:Task,
    required:true
  }
})

const emit = defineEmits(['submit'])

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const currentTaskMembers=ref<{
    userId:number,
    username:string,
    avatar:string
    }[]
>([])

const submitDialogVisible=ref(false)

const submitUpload = () => {
  upload.value!.submit()
}

const handleDialogOpen=()=>{
  if(props.task.status===2){
    ElMessage({
      message: '任务已完成，无需提交',
      type: 'warning'
    })
    return
  }else if(props.task.status===1){
    ElMessage({
      message: '任务已提交，无需重复提交',
      type: 'warning'
    })
    return
  }else if(props.task.status===0&&new Date(props.task.deadline)<new Date()){
    ElMessage({
      message: '任务已过期，无法提交',
      type: 'warning'
    })
    return
  }
  submitDialogVisible.value=true
}

const handleDialogClose=()=>{
  submitDialogVisible.value=false
}

const getTaskMembers=(taskId:number)=>{
  currentTaskMembers.value=[]
  axios({
    method:'get',
    url:'/api/task/members',
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

const handleUploadSuccess = (response: any, file: any, fileList: any) => {
  ElMessage({
    message: '文件上传成功',
    type: 'success'
  })
  console.log(response)
  if(response.code===200){
    let fileData=response.fileData
    submitTask(fileData)
  }
};

const submitTask=(fileData:any)=>{
  axios({
    method:'put',
    url:'/api/task/file',
    params:{
      taskId:props.task.taskId,
      fileURL:fileData.url
    }
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      ElMessage({
        message: '任务提交成功',
        type: 'success'
      })
      emit('submit')
    }else{
      ElMessage({
        message: `任务提交失败，${res.data.message}`,
        type: 'error',
      });
    }
  })
}

const handleUploadError = (err: Error, file: any, fileList: any) => {
  ElMessage({
    message: '文件上传失败',
    type: 'error'
  })
}

onMounted(()=>{
  getTaskMembers(props.task.taskId)
})
</script>

<template>
  <div class="flex flex-col w-full h-full p-2 card" @click="handleDialogOpen">
    <p class="font-bold text-2xl p-2">{{ props.task.name }}</p>
    <p class="font-bold text-xl p-2">任务内容：{{ props.task.description }}</p>
    <p class="font-bold text-xl p-2">截止日期：{{ new Date(props.task.deadline).toDateString() }}</p>
    <el-popover
      placement="top"
      title="负责人"
      trigger="hover"
      :content="props.task.leaderName"
    >
        <template #reference>
          <p class="font-bold text-xl p-2">负责人：
            <el-avatar>
                {{ props.task.leaderName.toUpperCase()[0] }}
            </el-avatar>
          </p>
        </template>
    </el-popover>
    <div class="flex flex-wrap">
      <p class="font-bold text-xl p-2">任务成员:</p>
      <div v-for="(member,index) in currentTaskMembers" class="p-1" :key="index">
        <el-popover
            placement="top"
            title="任务成员"
            trigger="hover"
            :content="currentTaskMembers[index].username"
        >
            <template #reference>
                <el-avatar>
                {{ member.username.toUpperCase()[0] }}
                </el-avatar>
            </template>
        </el-popover>
      </div>
      
    </div>
    <div class="flex p-2 w-full">
        <div class="pr-3 font-bold">优先级：</div>
        <el-tag type="success" class="p-1" v-if="task.priority===1||task.priority===0">普通</el-tag>
        <el-tag type="warning" class="p-1" v-if="task.priority===2">紧急</el-tag>
        <el-tag type="danger" class="p-1" v-if="task.priority===3">非常紧急</el-tag>
    </div>
    <div class="flex p-2 w-full">
        <div class="pr-3 font-bold">状态：</div>
        <el-tag type="warning" class="p-1" v-if="task.status===0&&new Date(task.deadline)<new Date()">已过期</el-tag>
        <el-tag type="danger" class="p-1" v-if="task.status===0&&new Date(task.deadline)>new Date()">未完成</el-tag>
        <el-tag type="primary" class="p-1" v-if="task.status===1">待审批</el-tag>
        <el-tag type="success" class="p-1" v-if="task.status===2">已完成</el-tag>
    </div>
  </div>
  <el-dialog
    v-model="submitDialogVisible"
    title="任务提交"
    draggable
  >
        <el-upload
            ref="upload"
            class="upload-demo"
            :action="`http://luxingzhi.cn:8090/api/file?userId=${store.state.currentUser.id}&projectId=${store.state.currentProjectId}`"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            multiple
        >
            <template #trigger>
            <el-button link type="primary">选择证明材料</el-button>
            </template>
            <el-button class="ml-3" type="success" @click="submitUpload">
                提交文件
            </el-button>
            <template #tip>
            <div class="el-upload__tip text-red">
                最多一个文件，新的文件将会覆盖前一个文件
            </div>
            </template>
        </el-upload>
  </el-dialog>
</template>

<style scoped>
.card{
  border: 2px;
  border-color: azure;
  border-radius: 8px;
  background-color: #24273a;
  transition: transform 0.2s ease-in-out;
}

.card:hover{
    border: 2px;
    border-color: azure;
    border-radius: 8px;
    background-color: #24273a;
    box-shadow: 0 0 10px #24273a;
    cursor: pointer;
    transform: scale(1.02);
}
</style>
