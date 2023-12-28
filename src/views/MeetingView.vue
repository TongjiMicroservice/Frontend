<template>
  <div>
    <el-card class="meeting-card">
      <div class="title">
        会议预定
      </div>
      <div class="form-container">
        <el-input v-model="meetingForm.title" placeholder="会议标题"></el-input>
        <el-date-picker v-model="meetingForm.startTime" type="datetime" placeholder="开始时间"></el-date-picker>
        <el-date-picker v-model="meetingForm.endTime" type="datetime" placeholder="结束时间"></el-date-picker>
        <el-select v-model="meetingForm.participants" multiple placeholder="请选择参会人员">
          <el-option v-for="person in participantsList" :key="person.value" :label="person.label" :value="person.value"></el-option>
        </el-select>
        <el-button type="primary" @click="submitMeeting">预定</el-button>
      </div>
    
    <!--会议记录表格-->
    <el-table :data="meetingList.slice((currentPage - 1) * 5, currentPage * 5)" border stripe>
      <el-table-column prop="id" label="会议ID"></el-table-column>
      <el-table-column prop="title" label="会议标题"></el-table-column>
      <el-table-column prop="link" label="会议链接"></el-table-column>
      <el-table-column prop="time" label="会议时间"></el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="5"
      layout="prev, pager, next"
      :total="meetingList.length">
    </el-pagination>
  </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElInput, ElDatePicker, ElSelect, ElOption, ElButton, ElCard, ElTable, ElTableColumn, ElPagination } from 'element-plus';

export default defineComponent({
  name: 'MeetingReservation',
  components: {
    ElInput,
    ElDatePicker,
    ElSelect,
    ElOption,
    ElButton,
    ElCard,
    ElTable,
    ElTableColumn,
    ElPagination
  },
  setup() {
    const meetingForm = ref({
      title: '',
      startTime: '',
      endTime: '',
      participants: []
    });

    const participantsList = [
      { label: 'Person A', value: 'A' },
      { label: 'Person B', value: 'B' },
      { label: 'Person C', value: 'C' }
    ];

    const meetingList = ref([
      { id: 1, title: 'Meeting 1', link: 'link1', time: '2022-01-01 10:00 - 2022-01-01 12:00' },
      { id: 2, title: 'Meeting 2', link: 'link2', time: '2022-01-02 14:00 - 2022-01-02 16:00' },
      { id: 3, title: 'Meeting 3', link: 'link3', time: '2022-01-03 16:00 - 2022-01-03 18:00' },
      { id: 4, title: 'Meeting 4', link: 'link4', time: '2022-01-04 09:00 - 2022-01-04 11:00' },
      { id: 5, title: 'Meeting 5', link: 'link5', time: '2022-01-05 13:00 - 2022-01-05 15:00' },
      { id: 6, title: 'Meeting 6', link: 'link6', time: '2022-01-06 10:00 - 2022-01-06 12:00' },
      { id: 7, title: 'Meeting 7', link: 'link7', time: '2022-01-07 14:00 - 2022-01-07 16:00' },
      { id: 8, title: 'Meeting 8', link: 'link8', time: '2022-01-08 16:00 - 2022-01-08 18:00' },
      { id: 9, title: 'Meeting 9', link: 'link9', time: '2022-01-09 09:00 - 2022-01-09 11:00' },
      { id: 10, title: 'Meeting 10', link: 'link10', time: '2022-01-10 13:00 - 2022-01-10 15:00' }
    ]);

    const currentPage = ref(1);

    const submitMeeting = () => {
      // 会议预定逻辑
      meetingList.value.push({
        id: meetingList.value.length + 1,
        title: meetingForm.value.title,
        link: 'meetingLink', 
        time: `${meetingForm.value.startTime} - ${meetingForm.value.endTime}`
      });
      meetingForm.value.title = '';
      meetingForm.value.startTime = '';
      meetingForm.value.endTime = '';
      meetingForm.value.participants = [];
    };

    const handleCurrentChange = (val: number) => {
      currentPage.value = val;
    };

    return {
      meetingForm,
      participantsList,
      meetingList,
      currentPage,
      submitMeeting,
      handleCurrentChange
    };
  }
});
</script>

<style>
.meeting-card{
  background-color:#24273a;
}
.title{
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 24px;
}
.form-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>