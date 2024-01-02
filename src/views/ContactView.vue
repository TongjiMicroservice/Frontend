<template>
  <div>
    <el-input v-model="searchQuery" placeholder="搜索成员..."></el-input>
    <el-row :gutter="20">

      <el-col v-for="member in filteredMembers" :key="member.userId" :span="24">
        <div class="space"></div>
        <div class="member-item">
          <div class="space"></div>
          <img :src="member.avatar" alt="头像" class="avatar" />
          <div class="space"></div>
          <span>
            <!-- 悬停在姓名上时显示的 popover -->
            <el-popover placement="top" trigger="hover" :width="300">
              <p><strong>权限：</strong>{{ member.privilege }}</p>
              <p><strong>邮箱：</strong>{{ member.email }}</p>
              <template #reference>
                <span class="name">{{ member.username }}</span>
              </template>
            </el-popover>
          </span>

          <el-button @click="preparePrivilegeChange(member.userId)">更改权限</el-button>
          <el-dialog
              title="更改权限"
              v-model="showDialog"
              width="30%"
          >
            <el-input
                v-model.number="privilegeValue"
                type="number"
                placeholder="请输入新的权限值"
            ></el-input>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmPrivilege">确认</el-button>
      </span>
            </template>
          </el-dialog>
          <el-button @click="deleteUser(member.userId)">删除</el-button>
          <el-button>聊天</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="space"></div>
    <el-button
        size="large"
        type="success"
        class="invite-button"
        @click="dialogVisible = true"
    >
      邀请新成员
    </el-button>
    <el-dialog :model-value="dialogVisible" title="Enter Email" @update:model-value="dialogVisible = $event">
      <el-input
          v-model="email"
          type="email"
          placeholder="Enter member's email"
      ></el-input>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmEmail">Confirm</el-button>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts">
import { watchEffect ,defineComponent, ref, computed , onMounted,reactive} from 'vue';
import axios from "axios";
import {useStore} from 'vuex'


interface Member {
  userId: number;
  username: string;
  avatar: string;
  email: string;
  privilege:number;
  message:string;
  projectId:number;
  code:number;
}
interface MemberDetails {
  userId: number;
  username: string;
  email: string;
  avatar: string;
}
interface MemberResponse {
  userId: number;
  projectId: number;
  privilege:number;
}
export default defineComponent({
  setup() {
    const members = ref<Member[]>([{
      userId: 1,
      username: '张三',
      avatar: 'avatar1.jpg',
      email: 'zhangsan@example.com',
      privilege:1,
      message:'ooo',
      projectId:10,
      code:200,
    },
      {
        userId: 2,
        username: '李四',
        avatar: 'avatar2.jpg',
        email: 'lisi@example.com',
        privilege:2,
        message:'ooo',
        projectId:10,
        code:200,
      },
    ]);
    const userIds = ref<number[]>([1, 2, 3]);
    const membersDetails = ref<MemberDetails[]>([]);
    const searchQuery = ref('');
    const detailsVisible = ref(true);
    const selectedMember = ref<Member | null>(null);
    const memberResponse = ref<MemberResponse[]>([]);
    const showDialog = ref(false);//privilege
    const privilegeValue = ref<number | ''>(''); // 初始化为空字符串
    const currentUserId = ref<number | null>(null); // 当前被修改权限的用户ID
    const dialogVisible = ref(false);//invite
    const email = ref('');

    const store=useStore();
    const userId = computed(() => store.state.currentUser.id);
    const projectId=computed(() => store.state.currentProjectId);
    console.log(userId.value)
    console.log(projectId.value)
    const confirmEmail = () => {
      console.log(email.value);
      sendInvite();
      window.location.reload();
      dialogVisible.value = false;
      // window.location.reload();
    };
    const sendInvite = async () => {

      const url = `/api/project/member/add-by-email`;

      try {
        const response = await axios.post(url, {}, {
          params: {
            projectId: projectId.value,
            email: email.value
          },
          headers: {
            'accept': 'application/json',
            // Add any other headers your API requires
          }
        });

        if (response.data.code === 200) {
          console.log('Invite sent successfully:', response.data);
          // Add any additional success handling here
        } else {
          console.error('Failed to send invite:', response.data);
          // Add any additional error handling here
        }
      } catch (error) {
        console.error('Error sending invite:', error);
        // Add any additional error handling here
      }
    };
    const preparePrivilegeChange = (userId: number) => {
      console.log("正在更改用户权限，用户id为") ;
      currentUserId.value = userId;
      console.log(userId) ;
      showDialog.value = true;
    };
    const confirmPrivilege = () => {
      console.log('更改后的权限值:', privilegeValue.value);
      changePrivilege();
      showDialog.value = false; // 关闭对话框
    };
    const fetchMembers = async () => {
      try {
        const response = await axios.get('/api/project/member/get', {
          params: {projectId: projectId.value} // replace with the actual project ID you need
        });
        if (response.data && response.data.members) {
          memberResponse.value = response.data.members as MemberResponse[];
          const userId = computed(() => {
            return memberResponse.value.map(member => member.userId);
          });
          userIds.value=userId.value;
          console.log("简单数据");
          console.log(memberResponse.value)
          console.log("开始查询详细数据");
          // console.log(memberResponse.value)
          // console.log(memberResponse.value[1].userId)

          fetchAllUserDetails();
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    // Call fetchMembers on component mount
    onMounted(fetchMembers);
    // 计算属性：根据搜索查询过滤成员
    const filteredMembers = computed(() =>
        members.value.filter(member =>
            member.username.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    );
    const fetchUserDetails = async (userId: number) => {
      try {
        const response = await axios.get(`/api/user/info?userId=${userId}`);
        if (response.data.code === 200) {
          return response.data; // 返回用户详细信息
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    const fetchAllUserDetails = async () => {
      const detailsPromises = userIds.value.map(id => fetchUserDetails(id));
      const results = await Promise.all(detailsPromises);
      membersDetails.value = results.filter(detail => detail != null) as MemberDetails[];
      console.log(membersDetails.value)
    };

    const finalMembers = computed(() => {
      return memberResponse.value.map(projectMember => {
        const userDetails = membersDetails.value.find(userDetail => userDetail.userId === projectMember.userId);
        return { ...projectMember, ...userDetails };
      });
    });

    const deleteUser = async (userId:number) => {
      console.log("正在尝试删除")
      console.log( userId);
      try {
        const response = await axios.delete('/api/project/member/delete', {
          params: {
            projectId: projectId.value,
            userId: userId,
          }
        });
        console.log(response.data); // handle the success response
        window.location.reload();
        // You can also check for response.status === 200 if needed
      } catch (error) {
        console.error(error); // handle the error
      }
    };
    const changePrivilege = async () => {
      try {
        const response = await axios.patch('/api/project/privilege/update', null, {
          params: {
            projectId: projectId.value, // 你需要替换为实际的projectId
            userId:  currentUserId.value, // 你需要替换为实际操作的userId
            privilege: privilegeValue.value
          }
        });
        if (response.data.code === 200) {
          console.log('权限更改成功');
          window.location.reload();
        }
      } catch (error) {
        console.error('权限更改失败', error);
      }
    };
    const closeDialog = () => {
      showDialog.value = false;
      privilegeValue.value = ''; // 重置权限值
      currentUserId.value = null; // 重置当前用户ID
    };
    watchEffect(() => {
      members.value = finalMembers.value.map(member => ({
        userId: member.userId,
        username: member.username as string, // 断言为 string 类型
        avatar: member.avatar as string, // 断言为 string 类型
        email: member.email as string, // 断言为 string 类型
        privilege: member.privilege,
        message: member.message as string, // 断言为 string 类型
        projectId: member.projectId,
        code: member.code as number // 断言为 number 类型
      }));
      console.log("合并后数据", finalMembers.value);
    });
    function showDetails(member: Member) {
      console.log(member)
      selectedMember.value = member;
      detailsVisible.value = true;
    }

    return {
      userId,
      projectId,
      searchQuery,
      filteredMembers,
      showDetails,
      detailsVisible,
      selectedMember,
      fetchMembers,
      membersDetails,
      members,
      finalMembers,
      userIds,
      deleteUser,
      showDialog,
      confirmPrivilege,
      privilegeValue,
      preparePrivilegeChange,
      closeDialog,
      currentUserId,
      dialogVisible,
      email,
      confirmEmail,
      sendInvite

    };
  }
});
</script>

<style>
.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee; /* 添加分割线 */
  padding: 10px 0;
}

.avatar {
  /* 根据需要调整头像样式 */
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.name {
  flex-grow: 1; /* 使姓名占据多余空间 */
  margin-left: 15px; /* 名字和头像之间的空间 */
  cursor: pointer;
  color:lightblue;
}

.el-button {
  margin-left: auto; /* 将按钮推到右边 */
}
.space{
  min-width: 60px;
}
.invite-button {
  font-size: 1.2em; /* 增大字体大小 */
  padding: 10px 20px; /* 增大按钮内边距 */
  border-radius: 5px; /* 轻微圆角边框 */
  background-color: #5b4b8a; /* 蓝紫色背景 */
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  color: white; /* 文字颜色为白色 */
  border: none; /* 移除边框 */
  box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2); /* 添加阴影效果 */
  transition: all 0.3s; /* 平滑过渡效果 */
}

.invite-button:hover {
  transform: translateY(-2px); /* 鼠标悬浮时上移按钮 */
  box-shadow: 0 6px 12px 0 rgba(0,0,0,0.3); /* 鼠标悬浮时增强阴影效果 */
  background-color: #726da8; /* 鼠标悬浮时变为更亮的蓝紫色 */
}
</style>
