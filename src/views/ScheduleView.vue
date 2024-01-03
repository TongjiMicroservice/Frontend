<script setup lang="ts">
import { ElCalendar } from 'element-plus'
import { ref, onMounted, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import axios from 'axios'
import { ElButton } from 'element-plus'
import { ElRadio } from 'element-plus'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

// 会议列表，先自己初始化一些数据
onMounted(() => {
  getMeetingList()
})

const store = useStore()
const currentProjectId = ref(store.state.currentProjectId)
const userId = ref(store.state.currentUser.id)
// task : 开始时间和结束时间(年月日时分)，任务名称，任务描述，任务id
// class

const radio = ref('meeting')
const centerDialogVisible = ref(false)
const startTime = ref('')
const endTime = ref('')
const title = ref('')
const description = ref('')
const priority = ref(0)
// //taskList，先自己初始化一些数据
class Task {
  constructor(
    public taskId: number,
    public startTime: string = "",
    public endTime: string = "",
    public taskName: string = "",
    public taskDescription: string = "",
    public status: number = 0
  ) {}
}

const formatDateTime = (dateTimeString: string) => {
  //将2021-12-01T10:00Z转化为2021-12-01 10:00
  const date = new Date(dateTimeString);
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedDateTime;
}

const taskList = ref<Task[]>([])

//dealMyDate函数,输入年月日，返回taskList中的任务名称
const dealMyDate = (date: any) => {
  let year = date.split('-')[0]
  let month = date.split('-')[1]
  let day = date.split('-')[2]
  //返回的是一个数组
  let result: Task[] = []
  for (let i = 0; i < taskList.value.length; i++) {
    let task = taskList.value[i]
    let taskYear = task.endTime.split(' ')[0].split('-')[0]
    let taskMonth = task.endTime.split(' ')[0].split('-')[1]
    let taskDay = task.endTime.split(' ')[0].split('-')[2]
    if (taskYear === year && taskMonth === month && taskDay === day) {
      result.push(task)
    }
  }
  return result
}
//展示任务详情
const showTaskDetail = (task: Task) => {
  console.log(task)
  //使用element-plus的弹窗组件
  ElMessageBox({
    title: '详情',
    message: task.taskDescription,
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        done()
      } else {
        done()
      }
    }
  })
}
  //使用userId获取当前用户的任务列表

const getTaskList = () => {
  axios({
    method: 'get',
    url: '/api/task/list-by-member',
    params: {
      userId: userId.value,
    }
  })
    .then((r) => {
      if (r.status === 200 && r.data.code === 200) {
        ElMessage({
          message: '任务列表获取成功',
        })
        console.log('获取到的任务列表长度', r.data.taskData.length)
        //清空taskList
        taskList.value = []
        for (let i = 0; i < r.data.taskData.length; i++) {
          let task = r.data.taskData[i]
          taskList.value.push(
            new Task(
              task.taskId,
              "",
              formatDateTime(task.deadline),
              task.name,
              task.description,
              task.status
            )
          )
        }
      } else {
        ElMessage({
          message: `任务列表获取失败,${r.data.message}`,
          type: 'error'
        })
      }
    })
    .catch((error) => {
      // 输出错误信息
      console.error('Axios Error:', error);
  }
  )
}

//创建日程
// /api/schedule/create
// startTime deadline description title priority
const createSchedule = () => {
  //进行判断
  if (startTime.value === '' || endTime.value === '' || title.value === '' || description.value === '') {
    ElMessage({
      message: '请填写完整信息',
      type: 'error'
    })
    return
  }
  else if (startTime.value > endTime.value) {
    ElMessage({
      message: '开始时间不能晚于结束时间',
      type: 'error'
    })
    return
  }
  console.log("startTime",startTime.value)
  console.log("priority",priority.value)
  axios({
    method: 'post',
    url: '/api/schedule/create',
    params: {
      startTime: startTime.value,
      deadline: endTime.value,
      description: description.value,
      title: title.value,
      priority: priority.value,
    }
  })
    .then((r) => {
      if (r.status === 200 && r.data.code === 200) {
        ElMessage({
          message: '日程创建成功',
        })
        console.log('创建的日程',r.data.data)
      } else {
        ElMessage({
          message: `日程创建失败,${r.data.message}`,
          type: 'error'
        })
      }
    })
    .catch((error) => {
      // 输出错误信息
      console.error('Axios Error:', error);
  }
  )
}

// 获取日程列表
const getSchedule = () => {
  axios({
    method: 'get',
    url: '/api/schedule/get',
  })
    .then((r) => {
      if (r.status === 200 && r.data.code === 200) {
        ElMessage({
          message: '日程列表获取成功',
        })
        console.log('获取到的日程列表长度', r.data.events.length)
        //清空taskList
        taskList.value = []
        for (let i = 0; i < r.data.events.length; i++) {
          let task = r.data.events[i]
          taskList.value.push(
            new Task(
              0,
              formatDateTime(task.startTime),
              formatDateTime(task.deadline),
              task.title,
              task.description,
              task.priority
            )
          )
        }
      } else {
        ElMessage({
          message: `日程列表获取失败,${r.data.message}`,
          type: 'error'
        })
      }
    })
    .catch((error) => {
      // 输出错误信息
      console.error('Axios Error:', error);
  }
  )
}
// 获取会议列表
const getMeetingList = () => {
  axios({
    method: 'get',
    url: '/api/meeting/user/' + userId.value,
  })
    .then((r) => {
      if (r.status === 200 && r.data.code === 200) {

        ElMessage({
          message: '会议列表获取成功',
        })
        console.log('获取到的会议列表长度', r.data.meetings.length)
        //清空taskList
        taskList.value = []
        for (let i = 0; i < r.data.meetings.length; i++) {
          let task = r.data.meetings[i]
          taskList.value.push(
            new Task(
              task.id,
              formatDateTime(task.startTime),
              formatDateTime(task.startTime),
              task.title,
              task.description,
              0
            )
          )
        }
      } else {
        ElMessage({
          message: `会议列表获取失败,${r.data.message}`,
          type: 'error'
        })
      }
    })
    .catch((error) => {
      // 输出错误信息
      console.error('Axios Error:', error);
  }
  )
}

// 监听radio的变化，根据radio的值来决定显示的是会议还是日程还是任务
watch(radio, (newValue, oldValue) => {
      // newValue 是新的值，oldValue 是变化前的值
      handleRadioChange(newValue);
    });

    // 处理 radio 变化的函数
const handleRadioChange = (value:any) => {
      switch (value) {
        case 'meeting':
          getMeetingList();
          break;
        case 'schedule':
          getSchedule();
          break;
        case 'task':
          getTaskList();
          break;
        default:
          // 默认的逻辑，你可以根据实际情况添加
          break;
      }
    };


</script>

<template>
  <div class="container">
    <el-radio-group v-model="radio" class="radio-group py-4">
      <el-radio-button label="meeting">会议</el-radio-button>
      <el-radio-button label="schedule">日程</el-radio-button>
      <el-radio-button label="task">任务</el-radio-button>
    </el-radio-group>
    <el-calendar>
      <template #date-cell="{ data }">
        <div @click=";(centerDialogVisible = true)">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
            {{ data.isSelected ? '✔️' : '' }}
          </p>
        </div>
        <div class="task-list-container" style="gap: 5px">
          <el-button
          type="info"
            link
            v-for="task in dealMyDate(data.day)"
            :key="task.taskId"
            @click="showTaskDetail(task)"
          >
            {{ task.taskName }}
          </el-button>
        </div>
      </template>
    </el-calendar>



  </div>

  <el-dialog v-model="centerDialogVisible" title="设置日程" width="40%" center>
    <el-form>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="Select date and time"
          value-format="YYYY-MM-DDTHH:mm"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间">
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="Select date and time"
          value-format="YYYY-MM-DDTHH:mm"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="标题">
        <el-input v-model="title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="description" placeholder="请输入详情" clearable></el-input>
      </el-form-item>

      <!-- 优先级 -->
        <el-form-item label="优先级">
          <el-radio-group v-model="priority">
            <el-radio :label="0">普通</el-radio>
            <el-radio :label="1">重要</el-radio>
            <el-radio :label="2">紧急</el-radio>
            <el-radio :label="3">重要且紧急</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createSchedule">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>
.is-selected {
  color: #1989fa;
}
.task-list-container {
  max-height: 30px; /* 调整为适当的高度，超过此高度将显示滚动条 */
  overflow-y: auto;
}

.container {
  display: flex;
  flex-direction: column;
  /*宽度铺满 */
  width: 100%;
}

.radio-group {
  margin-top: 10px; /* Adjust the margin as needed */
  justify-content: flex-end; /* Align children to the end (right) of the container */
}
</style>
