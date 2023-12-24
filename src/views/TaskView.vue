<template>
  <div class="task-submit-page">
    <div class="task-info">
      <h1 class="task-title">{{ taskTitle }}</h1>
      <el-divider></el-divider>
      <div class="info-module">
        <p>截止时间: {{ deadline }}</p>
        <p>绩效: {{ performance }}</p>
        <p>提交要求: {{ submissionRequirement }}</p>
      </div>
    
    <el-divider></el-divider>
    <div class="task-content">
      <div class="content-module">
        <p>任务内容: {{ taskContent }}</p>
      </div>
    </div>
    <el-button class="submit" type="primary" @click="showSubmitDialog">提交</el-button>
  </div>
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
      <div slot="footer" class="dialog-footer">
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
  padding: 20px;
}

.task-info {
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
}

.task-title {
  font-weight: bold;
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.info-module {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
}

.task-content {
  margin: 0 10px;
  margin-bottom: 20px;
}

.content-module {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.submit{
  margin: 0 10px 20px;
}
</style>