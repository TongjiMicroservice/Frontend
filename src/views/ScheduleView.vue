<template>
  <el-button type="primary" @click="dialogVisible = true">Invite New Member</el-button>
  <el-dialog :model-value="dialogVisible" title="Enter Email" @update:model-value="dialogVisible = $event">
    <el-input
        v-model="email"
        type="email"
        placeholder="Enter member's email"
    ></el-input>
    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="confirmEmail">Confirm</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dialogVisible = ref(false);
const email = ref('');

const confirmEmail = () => {
  console.log(email.value);
  dialogVisible.value = false;
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
