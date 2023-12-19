<script setup lang="ts">
import ChatList from '@/components/Chat/ChatList.vue'
</script>

<template>
  <el-row class="w-full h-full">
    <el-col :span="6">
      <ChatList />
    </el-col>
    <el-col :span="18">
    </el-col>
  </el-row>
</template>

<style scoped>
</style>