<script setup lang="ts">
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
        <el-avatar :size="25" src="/public/default_avatar.png"></el-avatar>
        <template #title>个人信息</template>
      </el-menu-item>
      <el-menu-item index="/home">
        <el-icon><HomeFilled /></el-icon>
        <template #title>主页</template>
      </el-menu-item>
      <el-menu-item index="/chat">
        <el-icon><UserFilled /></el-icon>
        <template #title>联系人</template>
      </el-menu-item>   
      <el-menu-item index="/docs">
        <el-icon><Document /></el-icon>
        <template #title>文档</template>
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