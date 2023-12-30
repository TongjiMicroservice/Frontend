<template>
    <el-calendar v-model="value">
      <template slot="date-cell" slot-scope="{ date }">
        {{ date.getDate() }}
        <div style="width: 100%;" v-for="item in scheduleData" :key="item.day">
          <el-tag type="danger" v-if="item.day === day ">
            {{ item.content }}
          </el-tag>
        </div>
      </template>
    </el-calendar>
  </template>
  
  <script>
  export default {
    name: "MySchedule",
    data() {
      return {
        value: new Date(),
        scheduleData: [
          { day: "2023-12-02", content: "学习1" },
          { day: "2023-01-03", content: "学习2" },
          { day: "2023-01-04", content: "学习3" },
          { day: "2023-01-05", content: "学习4" },
          { day: "2023-01-06", content: "学习5" },
          { day: "2023-01-07", content: "学习6" },
        ],
      };
    },
    methods: {
      formatDate(date) {
        // Format date as "YYYY-MM-DD"
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any scoped styles if needed */
  </style>
  