<template>
    <div>
      <br><br>
      <label for="room">选择会议室：</label>
      <el-select v-model="selectedRoom" id="room">
        <el-option v-for="room in rooms" :value="room">{{ room }}</el-option>
      </el-select>
      
      <br><br>
      
      <label for="time">选择会议时间：</label>
      <input type="datetime-local" v-model="selectedTime" id="time">
      
      <br><br>
      
      <label for="attendees">参会人员：</label>
      <el-select v-model="selectedAttendees" multiple id="attendees">
        <el-option v-for="attendee in attendees" :key="attendee" :value="attendee">{{ attendee }}</el-option>
      </el-select>
      
      <br><br>
      
      <el-button @click="reserveMeeting">预定会议</el-button>
      
      <br><br>
      
      <h2>会议列表</h2>
      <el-table :data="meetings" border>
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column prop="room" label="会议室"></el-table-column>
        <el-table-column prop="time" label="会议时间"></el-table-column>
        <el-table-column prop="attendees" label="参会人员"></el-table-column>
      </el-table>
      
      <div>
        <el-pagination
          layout="prev, pager, next"
          :total="meetings.length"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="changePage"
        ></el-pagination>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedRoom: '',
        selectedTime: '',
        selectedAttendees: [],
        attendees: ['参会人员1', '参会人员2', '参会人员3'], // 可选的参会人员列表
        rooms: ['会议室1', '会议室2', '会议室3'], // 可选的会议室列表
        meetings: [], // 会议列表
        currentPage: 1, // 当前页码
        pageSize: 5 // 每页显示的预定信息数量
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.meetings.length / this.pageSize);
      },
      displayedMeetings() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.meetings.slice(startIndex, endIndex);
      }
    },
    methods: {
      reserveMeeting() {
        // 创建一个新的会议对象
        const newMeeting = {
          room: this.selectedRoom,
          time: this.selectedTime,
          attendees: this.selectedAttendees
        };
        
        // 将新会议添加到会议列表中
        this.meetings.push(newMeeting);
        
        // 清空输入框
        this.selectedRoom = '';
        this.selectedTime = '';
        this.selectedAttendees = [];
        
        // 跳转到最后一页
        this.currentPage = this.totalPages;
      },
      changePage(page) {
        this.currentPage = page;
      }
    }
  };
  </script>

<style scoped>

</style>

