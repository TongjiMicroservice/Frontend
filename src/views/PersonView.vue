<template>
  <button @click="openDialog">打开对话框</button>
  <el-dialog v-model:visible="showDialog" title="测试对话框">
    这是一个测试对话框。
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const showDialog = ref(false);

    function openDialog() {
      showDialog.value = true;
    }

    return {
      showDialog,
      openDialog,
    };
  },
});
</script>
