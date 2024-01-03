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
    <el-dialog v-model="membersDialogVisible" title="参会人管理">
    <el-select v-model="selectedMembers" multiple placeholder="请选择参会人">
      <el-option v-for="member in members" :key="member.userId" :label="member.name" :value="member.userId"></el-option>
    </el-select>
    <el-button type="primary" @click="addParticipants">添加</el-button>

    <el-table :data="meetingParticipants.slice((memberCurrentPage-1)*5,memberCurrentPage*5)" style="width: 100%">
      <el-table-column prop="name" label="成员姓名">
        <template #default="{ row }">
          {{ row.name }} <span v-if="row.role === 'host'">(host)</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="setHost(row)">主持人</el-button>
          <el-button type="danger" @click="deleteParticipant(row.meeting_id, row.participant_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="memberCurrentChange"
      :current-page="memberCurrentPage"
      :page-size="5"
      layout="prev, pager, next"
      :total="meetingParticipants.length">
     </el-pagination>

  </el-dialog>

    <!--创建会议窗口-->
    <el-button type="primary" @click="showCreateMeetingDialog">创建</el-button>
    <el-dialog v-model="dialogVisible" title="创建会议" >
      <el-form :model="meetingForm" label-width="80px" ref="meetingFormRef">
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
import { useStore } from 'vuex';

interface Member { //项目成员声明
  userId: number;
  projectId: number;
  privilege: number;
  name: string;
  avatar: string;
}
interface MeetingParticipant {
  id: number;
  name: string;
  meeting_id: string;
  participant_id: number;
  role: string;
}

export default defineComponent({
  setup() {
    const store=useStore();
    const startedMeetings = ref<Meeting[]>([]);
    const upcomingMeetings = ref<Meeting[]>([]);
    const dialogVisible = ref(false);
    const membersDialogVisible = ref(false);
    const startedCurrentPage = ref(1);
    const upcomingCurrentPage = ref(1);
    const memberCurrentPage = ref(1);
    const members = ref<Member[]>([]); //项目成员
    const selectedMembers = ref<number[]>([]); //被选成员
    const meetingParticipants = ref<MeetingParticipant[]>([]); //参会人员
    //const meetingFormRef = ref<ElForm | null>(null); 
    var currentMeetingId='';//当前会议Id
    const meetingForm = ref({
      title: '',
      description: '',
      startTime: '',
      deadline: ''
    });
    
      //处理翻页逻辑
    const handleCurrentChange1 = (val: number) => {
      startedCurrentPage.value=val;
    };
    const handleCurrentChange2 = (val: number) => {
      upcomingCurrentPage.value=val;
    };
    const handleCurrentChange3 = (val: number) => {
      memberCurrentPage.value=val;
    };

    const showCreateMeetingDialog = () => {
      //弹出创建窗口逻辑---role判断
      axios({
        method:'get',
        url:`/api/project/privilege/get`,
        params:{
          projectId:store.state.currentProjectId,
          userId:store.state.currentUser.id
        }
      }).then((response) => {
          const data = response.data;
          if (data.code === 200) {
            if (data.privilege === 3) {
              dialogVisible.value = true; 
            }
            else{
              ElMessage.error("无创建权限");
            }
          }
          else{
            ElMessage.error("获取权限失败");
          }
        })
    };

    const fetchParticipants = (meetingId: string) => {
      axios.get(`/api/meeting/${meetingId}/participants`)
        .then((response) => {
          const data = response.data;
          if (data.code === 200) {
            meetingParticipants.value = data.participants;
          } else {
            ElMessage.error('获取参会人列表失败: ' + data.message);
          }
        })
    };

    const showMembersDialog = (meetingId:string) => {
      currentMeetingId = meetingId;//点击成员按钮后设置当前会议Id，供addMember调用
      membersDialogVisible.value = true;
      fetchParticipants(meetingId);

      axios({
        method:'get',
        url:'/api/project/member/get',
        params:{
          projectId:store.state.currentProjectId
        }
      }).then((response) => {
          const data = response.data;
          if (data.code === 200) {
            members.value = data.members;
          } else {
            ElMessage.error('获取成员列表失败: ' + data.message);
          }
        })
    };
    const addParticipant = (meetingId: string, userId: number) => {
      return axios({
        method:'post',
        url:'/api/meeting/participant',
        params:{
          meetingId:meetingId,
          participantId:userId,
          role:'member'
        }
      });
    };

    const addParticipants = () => {
      const promises = selectedMembers.value.map(userId => addParticipant(currentMeetingId, userId));
      Promise.all(promises)
      .then((responses) => {
          ElMessage.success('添加参会人成功');
          fetchParticipants(currentMeetingId);
          selectedMembers.value = [];
        })
        .catch((error) => {
          console.error('Error adding participants', error);
        });
    };

    const setHost = (participant: MeetingParticipant) => {
      const newRole = participant.role === 'member' ? 'host' : 'member';
      axios({
        method:'put',
        url:`/api/meeting/participant/${participant.participant_id}/role`,
        params:{
          meetingId:participant.meeting_id,
          participantId:participant.participant_id,
          role:newRole
        }
      }).then((response) => {
        if(response.data.code==200){
          ElMessage.success('更改成功');
          fetchParticipants(participant.meeting_id);
        }
        else{
          console.error('Error setting host', error);
          ElMessage.error('更改失败');
        }
      })
    };

    const deleteParticipant = (meetingId: string, participantId: number) => {
      axios({
        method:'delete',
        url:`/api/meeting/participant/${participantId}`,
        params:{
          meetingId:meetingId,
          participantId:participantId
        }
      }).then((response) => {
        if(response.data.code==200)
          fetchParticipants(meetingId);
        else{
          console.error('Error deleting participant', error);
          ElMessage.error('删除参会人失败');
        }
      })
    };

    const createMeeting = () => {
      axios({
        method:'post',
        url:`/api/meeting`,
        params:{
          projectId:store.state.currentProjectId,
          title: meetingForm.value.title,
          description: meetingForm.value.description,
          startTime: meetingForm.value.startTime,
          deadline: meetingForm.value.deadline
        }
      }).then((response) => {
          // 处理创建会议成功的逻辑
          dialogVisible.value = false;
          ElMessage.success('创建成功');
          fetchMeetings();
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
      if(store.state.role=='member'){
      axios({
        method:'get',
        url:`/api/meeting/user/${store.state.currentUser.id}`,
      }).then((response) => {
          const data = response.data;
          if (data.code === 200) {
            const meetings = data.meetings;
            const currentTime = new Date().getTime();
            startedMeetings.value = meetings.filter((meeting: Meeting) => new Date(meeting.startTime).getTime() <= currentTime);
            upcomingMeetings.value = meetings.filter((meeting: Meeting) => new Date(meeting.startTime).getTime() > currentTime);
          } else {
            console.error('Failed to fetch meetings: ' + data.message);
          }
        })
      }else{
        axios({
        method:'get',
        url:`/api/meeting/project/${store.state.currentProjectId}`,
      }).then((response) => {
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
      }
    };

    onMounted(() => {
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
      memberCurrentPage,
      handleCurrentChange1,
      handleCurrentChange2,
      handleCurrentChange3,
      members,
      selectedMembers,
      addParticipants,
      setHost,
      deleteParticipant,
      meetingParticipants
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