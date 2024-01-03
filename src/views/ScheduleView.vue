<template>
    <el-row>
      <el-col span="6">
  <el-menu :default-active="activeContactId" class="el-menu-vertical-demo">
    <el-menu-item
        v-for="contact in contacts"
        :key="contact.id"
        :index="contact.id"
        @click="selectContact(contact.id)"
        :class="{ 'is-active': activeContactId === contact.id }"
    >
      <div class="contact-item">
        <el-avatar class="avatar" :src="contact.avatar"></el-avatar>
        <div v-if="contact" class="contact-info">
          <p class="name">{{ contact.name }}</p>
        </div>
      </div>
        </el-menu-item>
        </el-menu>
      </el-col>
      <el-col span="18">
  <el-container >
    <el-header style="height: auto; padding: 0;">
      <!-- 聊天对象信息显示区域 -->
      <div class="chat-header">
        <span>聊天对象: {{currentContact.name }}</span>
      </div>
    </el-header>

    <el-main style="padding: 10px; overflow-y: auto;">
      <!-- 聊天历史显示区域 -->
      <div class="chat-message" v-for="message in chatHistory" :key="message.id">
        <div :class="{'my-message': message.sender === userId, 'other-message': message.sender !== userId}">
          {{ message.content }}
        </div>
      </div>
    </el-main>

    <el-footer style="height: auto; padding: 10px;">
      <!-- 聊天输入区域 -->
      <el-input
          type="textarea"
          v-model="inputMessage"
          placeholder="输入消息..."
      ></el-input>
      <el-button type="primary" @click="sendMessage">发送</el-button>
    </el-footer>
  </el-container>
      </el-col>
    </el-row>
</template>

<script lang="ts">
import io from 'socket.io-client';
import emojiData from "../emoji.json";
import {computed, defineComponent, ref,reactive, onMounted,onUnmounted} from 'vue';
import { ElMenu, ElMenuItem, ElAvatar } from 'element-plus';
import {useStore} from "vuex";
export default defineComponent({
  setup() {

    const store=useStore();
    const userId = computed(() => store.state.currentUser.id);
    console.log(userId.value)
    const contacts = ref([
    { id: 1, name: 'Alice', avatar: 'path/to/alice-avatar.png' },
    { id: 2, name: 'Bob', avatar: 'path/to/bob-avatar.png' },
    { id: 3, name: 'Carol', avatar: 'path/to/carol-avatar.png' },
  // 更多联系人...
      ] );
    const socket = io('http://localhost:9092');
    socket.emit('loginRequest', userId.value);
    onMounted(() => {
      // 监听 WebSocket 消息
      socket.on('recentChatResponse', (data) => {
        console.log('Recent chats:', data);
        contacts.value = data.map(item => {
          console.log(item);
          return { name: item.name, id: item.id,avatar:item.avatar };
        });
      });

      // 可能需要在这里发送一个事件来请求最近的聊天信息
      socket.emit('requestRecentChats', /* 你的请求参数 */);
    });

    onUnmounted(() => {
      // 组件卸载时清理
      socket.off('recentChatResponse');
      socket.close();
    });
    // onMounted();


    const activeContactId = ref(0);
    const inputMessage = ref('');
    const chatHistory = ref([
      { id: 1, sender: 'user123', content: '你好！' },
      { id: 2, sender: 'user456', content: '你好，Alice！' },
      // 更多消息...
    ]);
    // 在<script>标签中
    const currentContact = computed(() => {
      return contacts.value[activeContactId.value-1] || { name: '', avatar: '' };
    });

    const sendMessage = () => {
      // 添加消息到聊天历史，并清空输入框
      if (inputMessage.value.trim() !== '') {
        chatHistory.value.push({
          id: chatHistory.value.length + 1,
          sender: userId.value,
          content: inputMessage.value
        });
        inputMessage.value = '';
      }
    };
      const selectContact = (contact:number) => {
      activeContactId.value = contact;
      console.log('Selected contact:', contact);
      };
  return{
    socket,
    userId,
    contacts,
    activeContactId,
    currentContact,
    selectContact,
    chatHistory,
    inputMessage,
    sendMessage,
  };
  },
});
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}

.contact-item {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 8px;
}

.contact-info .name {
  margin: 0;
  font-weight: bold;
}

.is-active {
  background-color:rgba(55,66,144,0.8); /* 选中联系人的背景颜色 */
}
.chat-header {
  width: 700px; /* 减去左右的内边距 */
  padding: 10px;
  background-color: rgba(55,66,144,0.5);
  border-bottom: 1px solid #ebebeb;
  font-weight: bold;
  border: 1px solid #d3dce6; /* 添加边框样式 */
  border-radius: 4px; /* 可选的圆角 */
  margin: 10px; /* 添加外边距 */
}
</style>
