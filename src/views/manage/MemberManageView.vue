<template>
  <div>
    <div class="flex flex-col p-3">
      <el-radio-group v-model="view" class="pt-5">
        <el-radio-button label="manage-member">成员管理</el-radio-button>
        <el-radio-button label="manage-application">项目管理</el-radio-button>
      </el-radio-group>
      <div v-if="view==='manage-member'">

      </div>
      <div v-if="view==='manage-application'">

      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import {ref} from 'vue'
const view=ref('manage-member')
</script>

