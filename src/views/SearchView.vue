<template>
  <el-container>
    <el-header style="background-color: #243b55">
      <el-input placeholder="请输入搜索内容" v-model="searchQuery">
        <template #append>
          <el-button icon="Search" type="text"></el-button>
        </template>
      </el-input>
    </el-header >
    <el-main>
      <el-row :gutter="20">
        <el-col :span="8" v-for="(task, index) in filteredTasks" :key="index">
          <el-card :body-style="{ padding: '20px' }">
            <h4>{{ task.title }}</h4>
            <p>{{ task.description }}</p>
            <el-button color="#626ae6" :dark="isDark"  @click="viewTask(task)" plain :icon="Search">详情</el-button>
            <el-button color="#626aef" :dark="isDark" @click="joinTask(task)">加入</el-button>
          </el-card>
        </el-col>
      </el-row>

    </el-main>
  </el-container>

  <el-dialog
      title="任务详情"
      v-model="taskDetailsVisible"
      width="50%"
  >
    <div v-if="currentTask">
      <h4>{{ currentTask.title }}</h4>
      <p>{{ currentTask.description }}</p>
      <p>{{ currentTask.more }}</p>
      <!-- 在这里添加其他你希望显示的任务信息 -->
    </div>
  </el-dialog>

  <div v-if="currentTask">
  <el-dialog
      :title="'请问您确定加入 ' + currentTask.title + ' 项目？'"
      v-model="joinDialogVisible"
      width="30%"
  >

    <template #footer>
    <span class="dialog-footer">
      <el-button @click="joinDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmJoin">确认</el-button>
    </span>
    </template>

  </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'TaskSearch',
  setup() {
    const taskDetailsVisible = ref(false)
    const currentTask = ref(null)
    const searchQuery = ref('')
    const joinDialogVisible = ref(false)
    const isDark = ref(false);

    const tasks = ref([
      { title: '项目1', description: '项目1的描述' ,more:'lalalala'},
      { title: '项目2', description: '项目2的描述' ,more:'guaguagua'},
      { title: '项目3', description: '项目3的描述' ,more:'hahahahah'},
      // ...更多任务
    ])

    const filteredTasks = computed(() =>
        tasks.value.filter((task) =>
            task.title.includes(searchQuery.value) || task.description.includes(searchQuery.value)
        )
    )

    function joinTask(task: any) {
      console.log('Joining task:', task.title)
      currentTask.value = task
      joinDialogVisible.value = true
    }
    function viewTask(task: any) {
      console.log('Viewing task:', task.title)
      currentTask.value = task
      taskDetailsVisible.value = true
    }
    function confirmJoin() {
      console.log('确认加入项目：', currentTask.value.title)
      joinDialogVisible.value = false
      // 在这里可以添加实际的加入任务逻辑
    }
    return {
      searchQuery,
      filteredTasks,
      currentTask,
      taskDetailsVisible,
      joinTask,
      viewTask,
      joinDialogVisible,
      confirmJoin,
      isDark,
    }
  },
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
