<template>
  <el-tooltip :content="projectId" placement="top">
    <div class="project" @click="handleClick">
      <h2>{{ projectName }}</h2>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    projectName: {
      type: String,
      default: "testName",
    },
    projectId: {
      type: Number,
      default: "testID",
    },
  },
  methods: {
    handleClick() {
      console.log(`Project ${this.projectName} clicked!`);
    },
  },
};
</script>

<style scoped>
.project {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.project:hover {
  background-color: #f0f0f0;
}
</style>
