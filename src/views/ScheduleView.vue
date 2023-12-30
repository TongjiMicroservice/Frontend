<template>
  <div>
    <el-calendar>
      <template #dateCell="{ data }">
        <div class="calendar-item">
          <div class="calendar-time">
            {{ data.day.split('-').slice(2).join('') }}
          </div>
          <div>
            <span
              class="remark-text calendar-time"
              v-for="(item, index) in dealMyDate(data.day)"
              :key="index"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'MySchedule',
  data() {
    return {
      resDate: [
        { date: '2023-12-23', content: '放假' },
        { date: '2023-12-01', content: '放假' },
        { date: '2023-12-02', content: '划水' },
        { date: '2023-12-24', content: '学习vue' },
        { date: '2023-12-25', content: '学习vue' },
        { date: '2023-12-26', content: '学习vue' },
        { date: '2023-12-27', content: '学习vue' },
        { date: '2023-12-28', content: '学习vue' }
      ]
    }
  },
  methods: {
    dealMyDate(v) {
      let res = ''
      for (let index = 0; index < this.resDate.length; index++) {
        if (this.resDate[index].date === v) {
          res = this.resDate[index].content
          break
        }
      }
      return res
    }
  }
}
</script>

<style>
.remark-text {
  font-size: 8px;
}
.calendar-item {
  flex-direction: column;
}
.calendar-time {
  height: 16px;
  line-height: 16px;
}
</style>