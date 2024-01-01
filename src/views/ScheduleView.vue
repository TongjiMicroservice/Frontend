<template>
  <el-button @click="showDialog = true">更改权限</el-button>

  <el-dialog
      title="更改权限"
      v-model="showDialog"
      width="30%"
  >
    <el-input
        v-model.number="privilegeValue"
        type="number"
        placeholder="请输入新的权限值"
    ></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmPrivilege">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showDialog = ref(false);
const privilegeValue = ref<number | ''>(''); // 初始化为空字符串

const confirmPrivilege = () => {
  console.log('更改后的权限值:', privilegeValue.value);
  showDialog.value = false; // 关闭对话框
};

const closeDialog = () => {
  showDialog.value = false; // 关闭对话框并重置权限值
  privilegeValue.value = ''; // 重置权限值
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
