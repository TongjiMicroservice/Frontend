<script setup lang="ts">
  import { ElMessage } from 'element-plus';
  import { ref } from 'vue';

  const taskTitle = ref('任务1');
  const deadline = ref('2022-12-31');
  const performance = ref('A+');
  const submissionRequirement = ref('按时提交');
  const taskContent = ref('任务详细要求');
  const taskStatus=ref('办理中');
  const submitDialogVisible = ref(false);
  const fileList = ref([]);

  const handlePreview = (file: any) => {
    // 处理文件预览的逻辑
    console.log('文件预览', file);
  };
  
  const beforeRemove = (file: any) => {
    // 处理文件移除前的逻辑
    console.log('准备移除文件', file);
    return true; // 返回true允许移除，返回false阻止移除
  };

  const handleSuccess = (response: any, file: any, fileList: any) => {
    // 文件上传成功的逻辑
    fileList.value = fileList;
  };

  const handleRemove = (file: any, fileList: any) => {
    // 文件移除的逻辑
    fileList.value = fileList;
  };

  const showSubmitDialog = () => {
    submitDialogVisible.value = true;
  };

  const acceptTask = () => {

  }

  const submitTask = () => {
    // 提交任务的逻辑
   ElMessage.success('提交成功')
    submitDialogVisible.value = false;
  };
</script>

<template>
  <div class="task-submit-page">
    <el-card class="task-info">
      <h1 class="task-title">{{ taskTitle }}</h1>
      <el-divider></el-divider>
      <el-card class="info-card">
        <p>截止时间: {{ deadline }}</p>
        <p>绩效: {{ performance }}</p>
        <p>提交要求: {{ submissionRequirement }}</p>
      </el-card>
      <el-card class="info-card">
        <p>任务内容: {{ taskContent }}</p>
      </el-card>
      <el-button v-if="taskStatus === '待办'" class=button @click="acceptTask">接受</el-button>
      <el-button v-else-if="taskStatus === '办理中'" class=button @click="showSubmitDialog">提交</el-button>
      <el-button v-else-if="taskStatus === '办结'" class=button @click="showSubmitDialog">重新提交</el-button>
      <!--<el-button class="submit" type="primary" @click="showSubmitDialog">提交</el-button>-->
    </el-card>
    <el-dialog title="提交任务" v-model="submitDialogVisible" width="30%">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-remove="beforeRemove"
        :file-list="fileList"
        :auto-upload="false"
      >
      <el-button size="small" type="primary">点击上传</el-button>    
      </el-upload>
      <div  class="dialog-footer">
        <el-button @click="submitDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTask">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      taskTitle: '任务1',
      deadline: '2022-12-31',
      performance: 'A+',
      submissionRequirement: '按时提交',
      taskContent: '任务内容描述',
      submitDialogVisible: false,
      fileList: []
    };
  },
  methods: {
    showSubmitDialog() {
      this.submitDialogVisible = true;
    },
    submitTask() {
      // 提交任务的逻辑
      this.$message.success('提交成功');
      this.submitDialogVisible = false;
    },
    handleSuccess(response, file, fileList) {
      // 文件上传成功的逻辑
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      // 文件移除的逻辑
      this.fileList = fileList;
    }
  }
};
</script>

<style scoped>
.task-submit-page {
  display:flex;
  justify-content: center; 
  margin-bottom: 30px;
  margin-top: 15px;
  width:100%;
}
.task-info{
  width:50%;
  background-color:#24273a;
}
.task-title {
  font-weight: bold;
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}
.info-card{
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 20px;
  margin-top:20px;
}
.button{
  margin: 0 5px 20px;
}
</style>