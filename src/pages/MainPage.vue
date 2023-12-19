<script setup lang="ts">
</script>

<template>
  <div class="h-screen flex flex-col w-screen">
    <top-bar />
    <div class="main-content">
      <side-bar />
      <RouterView/>
    </div>
  </div>
</template>

<style scoped>
.main-content{
  height: 100%;
  display: flex;
  flex-direction: row;
}
</style>
