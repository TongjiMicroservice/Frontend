<template>
  <div>
    <div class="meeting-table">
    <h1>已开始的会议</h1>
    <el-table :data="startedMeetings.slice((startedCurrentPage-1)*5,startedCurrentPage*5)"  border stripe>
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column prop="title" label="Title" width="200"></el-table-column>
      <el-table-column prop="url" label="URL" width="200"></el-table-column>
      <el-table-column prop="startTime" label="Start Time" width="150"></el-table-column>
      <el-table-column label="Operation" width="200">
        <template #default="scope">
          <el-button type="text" @click="showMembersDialog(scope.row.id)">成员</el-button>
          <el-button type="text" @click="cancelMeeting(scope.row.id)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange1"
      :current-page="startedCurrentPage"
      :page-size="5"
      layout="prev, pager, next"
      :total="startedMeetings.length">
     </el-pagination>
    </div>
    <div class="meeting-table">
    <h1>待参加的会议</h1>
    <el-table :data="upcomingMeetings.slice((upcomingCurrentPage-1)*5,upcomingCurrentPage*5)"  border stripe>
      <el-table-column prop="id" label="ID" width="100" ></el-table-column>
      <el-table-column prop="title" label="Title" width="200"></el-table-column>
      <el-table-column prop="url" label="URL" width="200"></el-table-column>
      <el-table-column prop="startTime" label="Start Time" width="150"></el-table-column>
      <el-table-column label="Operation" width="200">
        <template #default="scope">
          <el-button type="text" @click="showMembersDialog(scope.row.id)">成员</el-button>
          <el-button type="text" @click="cancelMeeting(scope.row.id)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange2"
      :current-page="upcomingCurrentPage"
      :page-size="5"
      layout="prev, pager, next"
      :total="upcomingMeetings.length">
     </el-pagination>
  </div>

    <!--成员管理窗口-->
    <el-dialog v-model="membersDialogVisible" title="成员列表">
      <!-- 成员列表的展示逻辑 -->
      <!-- ... -->
    </el-dialog>

    <!--创建会议窗口-->
    <el-button type="primary" @click="showCreateMeetingDialog">创建</el-button>
    <el-dialog v-model="dialogVisible" title="创建会议">
      <el-form :model="meetingForm" label-width="80px">
        <el-form-item label="会议标题" prop="title">
          <el-input v-model="meetingForm.title"></el-input>
        </el-form-item>
        <el-form-item label="会议描述" prop="description">
          <el-input v-model="meetingForm.description"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker type="datetime" v-model="meetingForm.startTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker type="datetime" v-model="meetingForm.deadline"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createMeeting">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import Meeting from '@/models/Meeting'
import {ElMessage} from 'element-plus'

export default defineComponent({
  setup() {
    const startedMeetings = ref<Meeting[]>([]);
    const upcomingMeetings = ref<Meeting[]>([]);
    const dialogVisible = ref(false);
    const membersDialogVisible = ref(false);
    const startedCurrentPage = ref(1);
    const upcomingCurrentPage = ref(1);
    const userId = ref(null); 
    const meetingForm = ref({
      title: '',
      description: '',
      startTime: '',
      deadline: ''
    });

    const fetchUserId = () => {
      axios.get('http://luxingzhi.cn:8090/api/user')
        .then((response) => {
          const data = response.data;
          if (data.code === 200) {
            userId.value = data.userId; // 将获取到的userId存入ref
            fetchMeetings(); // 获取userId后调用fetchMeetings
          } else {
            console.error('Failed to fetch userId: ' + data.message);
          }
        })
    };
    
      //处理翻页逻辑
    const handleCurrentChange1 = (val: number) => {
      startedCurrentPage.value=val;
    };
    const handleCurrentChange2 = (val: number) => {
      upcomingCurrentPage.value=val;
    };

    const showCreateMeetingDialog = () => {
      //弹出创建窗口逻辑---role判断
      dialogVisible.value = true;
    };

    const showMembersDialog = (meetingId: string) => {
      // 弹出成员列表的逻辑
      membersDialogVisible.value = true;
    };

    const createMeeting = () => {
      const projectId = 1; // 假设当前项目的 projectId 为 1
      const formData = {
        projectId,
        title: meetingForm.value.title,
        description: meetingForm.value.description,
        startTime: meetingForm.value.startTime,
        deadline: meetingForm.value.deadline
      };
      axios.post('/api/meeting', formData)
        .then((response) => {
          // 处理创建会议成功的逻辑
          console.log('Meeting created successfully', response.data);
          dialogVisible.value = false;
          ElMessage.success('创建成功');
        })
        .catch((error) => {
          // 处理创建会议失败的逻辑
          console.error('Error creating meeting', error);
          ElMessage.error('创建失败');
        });
    };

    const cancelMeeting = (meetingId: string) => {
      axios.delete(`http://luxingzhi.cn:8090/api/meeting/${meetingId}`)
        .then((response) => {
          // 处理取消会议成功的逻辑
          fetchMeetings(); // 重新获取会议列表
        })
        .catch((error) => {
          // 处理取消会议失败的逻辑
          console.error('Error cancelling meeting', error);
        });
    };

    const fetchMeetings = () => {
      if (!userId.value) {
        return; // 如果userId未获取到，直接返回
      }
      axios.get(`http://luxingzhi.cn:8090/api/meeting/user/${userId.value}`)
        .then((response) => {
          const data = response.data;
          if (data.code === 200) {
            const meetings = data.meetings;
            const currentTime = new Date().getTime();
            startedMeetings.value = meetings.filter((meeting: Meeting) => new Date(meeting.startTime).getTime() < currentTime);
            upcomingMeetings.value = meetings.filter((meeting: Meeting) => new Date(meeting.startTime).getTime() > currentTime);
          } else {
            console.error('Failed to fetch meetings: ' + data.message);
          }
        })
    };

    onMounted(() => {
      fetchUserId();
      fetchMeetings();
    });

    return {
      startedMeetings,
      upcomingMeetings,
      fetchMeetings,
      dialogVisible,
      meetingForm,
      showCreateMeetingDialog,
      createMeeting,
      membersDialogVisible,
      showMembersDialog,
      cancelMeeting,
      startedCurrentPage,
      upcomingCurrentPage,
      handleCurrentChange1,
      handleCurrentChange2
    };
  }
});
</script>

<style scoped>
.meeting-table {
  margin-bottom: 30px;
  position: relative;
}

</style>