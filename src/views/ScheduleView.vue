<script setup lang="ts">
import { ElCalendar } from "element-plus";
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
// task : 开始时间和结束时间(年月日时分)，任务名称，任务描述，任务id
//class
class Task {
  constructor(
    public taskId: number,
    public startTime: string,
    public endTime: string,
    public taskName: string,
    public taskDescription: string
  ) {}
}
//taskList，先自己初始化一些数据
const taskList = ref<Task[]>([]);
taskList.value.push(
  new Task(
    1,
    "2023-12-01 10:00",
    "2023-12-01 11:00",
    "任务1的名称",
    "任务1的描述"
  )
);
taskList.value.push(
  new Task(
    2,
    "2024-01-02 00:00",
    "2024-01-02 10:00",
    "任务2的名称",
    "任务2的描述"
  )
);
taskList.value.push(
  new Task(
    2,
    "2024-01-02 20:00",
    "2024-01-02 21:00",
    "任务3的名称",
    "任务3的描述"
  )
);
//dealMyDate函数,输入年月日，返回taskList中的任务名称
const dealMyDate = (date: any) => {
  let year = date.split("-")[0];
  let month = date.split("-")[1];
  let day = date.split("-")[2];
  //返回的是一个数组
  let result: Task[] = [];
  for (let i = 0; i < taskList.value.length; i++) {
    let task = taskList.value[i];
    let taskYear = task.startTime.split(" ")[0].split("-")[0];
    let taskMonth = task.startTime.split(" ")[0].split("-")[1];
    let taskDay = task.startTime.split(" ")[0].split("-")[2];
    if (taskYear === year && taskMonth === month && taskDay === day) {
      result.push(task);
    }
  }
  return result;
};
//展示任务详情
const showTaskDetail = (task: Task) => {
  console.log(task);
  //使用element-plus的弹窗组件
  ElMessageBox({
    title: "任务详情",
    message: task.taskDescription,
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        done();
      } else {
        done();
      }
    },
  });
};

</script>

<template>
  <el-calendar >
    <template #date-cell="{ data }" >
      
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-').slice(1).join('-') }}
        {{ data.isSelected ? '✔️' : '' }}
      </p>

        <div class="task-list-container"  style="gap: 5px;">
          <el-button
            v-for="task in dealMyDate(data.day)"
            :key="task.taskId"
            @click="showTaskDetail(task)"
            
          >
            {{ task.taskName }}
          </el-button>
        </div>

    </template>
  </el-calendar>
</template>

<style>
.is-selected {
  color: #1989fa;
}
.task-list-container {
  max-height: 30px; /* 调整为适当的高度，超过此高度将显示滚动条 */
  overflow-y: auto;
}

</style>
