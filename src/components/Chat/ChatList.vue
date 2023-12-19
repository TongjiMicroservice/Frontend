<script setup lang="ts">
import {ref} from 'vue'

const chatListRef = ref(['a','b','c','d','e'])
</script>

<template>
  <el-scrollbar>
    <div class="w-full single-chat" v-for="(chatUser,index) in chatListRef" :key="index">
      <el-avatar :size="40" src="/src/assets/default_avatar.png"/>
      <div class="flex flex-col justify-start items-center flex-nowrap m-0.5">
        <div >测试用户</div>
        <div >这是一条消息</div>
      </div>
    </div>
  </el-scrollbar>
  
</template>

<style scoped>
.single-chat {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  text-align: left;
}
</style>