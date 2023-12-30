<script setup lang="ts">
import {useStore} from 'vuex'
import {computed, watch,ref} from 'vue'

const store=useStore()

const role=computed(()=>store.state.role)

</script>

<template>
  <div class="h-full">
    <el-menu
      :collapse="true"
      default-active="/home"
      class="h-full side-bar"
      router
    >
      <el-menu-item index="/person">
        <el-avatar :size="25" :src="store.state.currentUser.avatar"></el-avatar>
        <template #title>个人信息</template>
      </el-menu-item>
      <el-menu-item index="/home">
        <el-icon><HomeFilled /></el-icon>
        <template #title>主页</template>
      </el-menu-item>
      <el-menu-item index="/chat">
        <el-icon><ChatDotRound /></el-icon>
        <template #title>聊天</template>
      </el-menu-item>
      <el-menu-item index="/contact">
        <el-icon><UserFilled /></el-icon>
        <template #title>联系人</template>
      </el-menu-item>
      <el-menu-item index="/schedule">
        <el-icon><Bell /></el-icon>
        <template #title>日程</template>
      </el-menu-item>
      <el-menu-item index="/docs">
        <el-icon><Document /></el-icon>
        <template #title>文档</template>
      </el-menu-item>
      <el-menu-item index="/meeting">
        <el-icon><Histogram /></el-icon>
        <template #title>会议</template>
      </el-menu-item>
      <el-menu-item index="/manage" v-if="role==='admin'||role==='leader'">
        <el-icon><Tools /></el-icon>
        <template #title>管理</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.side-bar{
  background: rgb(78,68,247);
  background: linear-gradient(184deg, rgba(78,68,247,1) 27%, rgba(207,112,255,1) 95%);
  border: 0px;
}
</style>
