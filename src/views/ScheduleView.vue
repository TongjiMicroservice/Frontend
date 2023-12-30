<template>
  <div>
    <el-calendar v-model="this.selectedDate" ref="calendar" @ready="handleCalendarReady()">
      <template #date-cell="{ data }">
        <div class="calendar-item" :class="data.isSelected ? 'is-selected' : ''">
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

    <el-dialog v-model="centerDialogVisible" title="设置日程" width="30%" center>
      <el-form>
        <el-form-item label="日期">
          <el-date-picker
            v-model="selectedDate"
            type="date"
            :placeholder="selectedDate"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="时间">
          <el-time-picker v-model="selectedTime" placeholder="请选择时间"></el-time-picker>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="title" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item label="详情">
          <el-input v-model="details" placeholder="请输入详情" clearable></el-input>
        </el-form-item>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveSchedule">保存</el-button>
          </span>
        </template>
      </el-form>
    </el-dialog>

    <el-dialog
      v-model="popoverSecheduleVisible"
      title="日程详细信息"
      width="30%"
      :text-align="center"
      @close="popoverSecheduleVisible = false"
    >
      <el-row>
        <el-col :span="8"><strong>日期:</strong></el-col>
        <el-col :span="16">{{ selectedDate }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><strong>时间:</strong></el-col>
        <el-col :span="16">{{ selectedTime }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><strong>标题:</strong></el-col
        ><!--这里的绑定信息改成后端读取到的信息-->
        <el-col :span="16">{{ title }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><strong>详情:</strong></el-col>
        <el-col :span="16">{{ details }}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

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
      ],
      centerDialogVisible: false,
      popoverSecheduleVisible: false,
      selectedDate: null,
      selectedTime: null,
      title: '',
      details: null
      //这里添加显示的日程详细信息
    }
  },
  mounted() {
    this.handleCalendarReady()
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
    },
    // handleClickCalendarItem(isSelected, day) {
    //   if (isSelected) {
    //     console.log('储存了日期数据：', day)
    //     this.selectedDate = day
    //   }
    // },
    handleCalendarReady() {
      // 在 el-calendar 渲染完成后执行
      const calendarInstance = this.$refs.calendar
      console.log('日历渲染完成')
      const dateCells = this.$el.querySelectorAll('.date-cell')
      console.log(dateCells)
      dateCells.forEach((cell) => {
        const date = cell.date //直接访问date数据
        console.log('date:', date)
      })
      const cells = calendarInstance.$el.querySelectorAll('.el-calendar-table td')
      cells.forEach((cell) => {
        cell.addEventListener('click', () => {
          this.handleCellClick(cell)
        })
      })
    },
    handleCellClick(cell) {
      // 处理格子项的点击事件
      console.log('点击的格子项:', cell)
      console.log('是否有日历信息:', cell.querySelector('span') != null)
      console.log('当前日期信息:', this.selectedDate)
      let hasSchedule = cell.querySelector('span') != null
      // 获取data-day属性的值
      const parentComponent = cell.__vueParentComponent
      console.log(
        'parentComponent:',
        parentComponent,
        ' ',
        parentComponent.$slots,
        ' ',
        parentComponent.$slots
      )
      if (parentComponent && parentComponent.$slots && parentComponent.$slots['date-cell']) {
        const slotContent = parentComponent.$slots['date-cell']
        // 在这里可以访问 date-cell 插槽内容
        console.log('date-cell 插槽内容:', slotContent)
      }
      if (hasSchedule) {
        this.popoverSecheduleVisible = true
      } else {
        this.centerDialogVisible = true
      }
    },
    saveSchedule() {
      // 在这里执行保存日程的逻辑
      console.log('保存日程')
      console.log('日期:', this.selectedDate)
      console.log('时间:', this.selectedTime)
      console.log('标题:', this.title)
      this.centerDialogVisible = false
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