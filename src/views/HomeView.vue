<script setup lang="ts">
import {ref} from 'vue'
const finishedTask=ref([{
  title:'任务1',
  content:'完成任务1的内容',
  time:'2021-10-10',
  status:'已完成'
},{
  title:'任务2',
  content:'完成任务2的内容',
  time:'2021-10-10',
  status:'已完成'
},{
  title:'任务3',
  content:'完成任务3的内容',
  time:'2021-10-10',
  status:'已完成'
}])

const onDoingTask=ref([{
  title:'任务1',
  content:'完成任务1的内容',
  time:'2021-10-10',
  status:'已完成'
},{
  title:'任务2',
  content:'完成任务2的内容',
  time:'2021-10-10',
  status:'已完成'
},{
  title:'任务3',
  content:'完成任务3的内容',
  time:'2021-10-10',
  status:'已完成'
}])

const toDoTask=ref([{
  title:'任务1',
  content:'完成任务1的内容',
  time:'2021-10-10',
  status:'已完成'
},{
  title:'任务2',
  content:'完成任务2的内容',
  time:'2021-10-10',
  status:'已完成'
},{
  title:'任务3',
  content:'完成任务3的内容',
  time:'2021-10-10',
  status:'已完成'
}])

const upcomingMeeting=ref([{
  title:'会议1',
  content:'会议1的内容',
  time:'2021-10-10',
},{
  title:'会议2',
  content:'会议2的内容',
  time:'2021-10-10',
},{
  title:'会议3',
  content:'会议3的内容',
  time:'2021-10-10',
}])
</script>

<template>
  <div class="flex flex-col justify-center w-full">
    <div class="flex items-center justify-center px-3">
      <el-card class="task-status">
        <template #header>
          <h1>已完成</h1>
        </template>
        <el-scrollbar>
          <div v-for="(task,index) in finishedTask" :key="index" class="my-3">
            <el-card>
              <h1>{{ task.title }}</h1>
              <div>{{ task.content }}</div>
              <el-text>{{ task.time }}</el-text>
            </el-card>
          </div>
        </el-scrollbar>
      </el-card>
      <el-card class="task-status">
        <template #header>
          <h1>进行中</h1>
        </template>
        <el-scrollbar>
          <div v-for="(task,index) in onDoingTask" :key="index" class="my-3">
            <el-card>
              <h1>{{ task.title }}</h1>
              <div>{{ task.content }}</div>
              <el-text>{{ task.time }}</el-text>
            </el-card>
          </div>
        </el-scrollbar>
      </el-card>
      <el-card class="task-status">
        <template #header>
          <h1>未开始</h1>
        </template>
        <el-scrollbar>
          <div v-for="(task,index) in toDoTask" :key="index" class="my-3">
            <el-card>
              <h1>{{ task.title }}</h1>
              <div>{{ task.content }}</div>
              <el-text>{{ task.time }}</el-text>
            </el-card>
          </div>
        </el-scrollbar>
      </el-card>
    </div>
    <div class="flex items-center justify-start px-3 py-2 mx-8">
      <el-card v-for="(meeting,index) in upcomingMeeting" :key="index" class="mx-2">
        <h1>{{ meeting.title }}</h1>
        <h2>{{ meeting.content }}</h2>
      </el-card>
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
