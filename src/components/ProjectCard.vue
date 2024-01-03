<template>
  <el-tooltip :content="tooltipContent" placement="top">
    <div class="project" @click="handleClick">
      <h2>{{ project.name }}</h2>
    </div>
  </el-tooltip>
</template>

<script>
import Project from '@/models/Project'

export default {
  props: {
    project: {
      type: Project,
      required: true,
    },
  },
  computed: {
    tooltipContent() {
      return `ID: ${this.project.id}\nDescription: ${this.project.description}\nScale: ${this.project.scale}\nLeader: ${this.project.leader}`;
    },
  },
  methods: {
    handleClick() {
      console.log(`Project ${this.project.name} clicked!`);
    },
  },
};
</script>

<style scoped>
.project {
  border: 1px solid #b14f4f;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.project:hover {
  background-color: #d9e0d2;
}
</style>
