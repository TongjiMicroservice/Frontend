<template>
  <el-row style="background-color:rgba(55,46,76,0.2)">
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
            <el-avatar class="avatar">{{ contact.name.toUpperCase()[0] }}</el-avatar>
            <div v-if="contact" class="contact-info">
              <p class="name">{{ contact.name }}</p>
            </div>
          </div>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col span="18" style="background-color:rgba(55,66,144,0.5)">
      <el-container >
        <el-header style="height: auto; padding: 0;">
          <!-- 聊天对象信息显示区域 -->
          <div class="chat-header">
            <span>聊天对象: {{currentContact.name }}</span>
          </div>
        </el-header>

        <el-main style="height: 300px;padding: 10px; overflow-y: auto;">
          <!-- 聊天历史显示区域 -->

          <div v-for="msg in chatHistory" :key="msg.timestamp" class="message"
               :class="{ 'sent': msg.sender === userId, 'received': msg.sender !== userId }">
            {{ msg.sendername }}:<span class="timestamp">{{ msg.timestamp }}</span><br>
            <div class="message-content">
              <div class="message-metadata">
                <!-- 使用符号来表示已读和未读 -->
                <div>{{ msg.message }}</div>
              </div>
            </div>
            <span class="read-status">{{ msg.isRead ? '✔️' : '🕒' }}</span>
          </div>

        </el-main>

        <el-footer style="height: auto; padding: 10px;">
          <!-- 聊天输入区域 -->
<!--          <el-input-->
<!--              type="textarea"-->
<!--              v-model="inputMessage"-->
<!--              placeholder="输入消息..."-->
<!--          ></el-input>-->
          <div class="chat-input-area">
            <!-- 表情按钮 -->
            <button @click="toggleEmojiPanel">😀</button>

            <!-- 表情面板 -->
            <div v-if="showEmojis" class="emoji-container">
               <span v-for="(emoji, index) in emojis" :key="index" @click="addEmojiToInput(emoji)">
              {{ emoji }}
                 </span>
            </div>

            <!-- 输入框 -->
            <el-input
                type="textarea"
                v-model="inputMessage"
                placeholder="输入消息..."
            ></el-input>

          <el-button color="#626aef" :dark="isDark" @click="sendMessage">发送</el-button>
          </div>
        </el-footer>
      </el-container>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import io from 'socket.io-client';
import emojiData from "../emoji.json";
import {computed, defineComponent, ref,reactive, Ref,onMounted,onUnmounted,watch } from 'vue';
import { ElMenu, ElMenuItem, ElAvatar } from 'element-plus';
import {useStore} from "vuex";
import { useRoute } from 'vue-router';
import axios from "axios";
import * as constants from "constants";
interface ChatMessage {
  sender: string;
  sendername?: string;
  receiver:number;
  message: string;
  timestamp: string;
  isRead: boolean;
  // 其他你需要的属性...
}
export default defineComponent({
  setup() {
    const SERVER_URL = 'http://luxingzhi.cn:9092';
    const intervalId = ref(null);
    const store=useStore();
    const userId = computed(() => String(store.state.currentUser.id));
    const userName=computed(() => store.state.currentUser.name);
    console.log("当前登录用户"+userId.value);
    const contacts = ref([
      { id: '2', name: 'Bob', avatar: 'path/to/bob-avatar.png' },
      { id: '3', name: 'Carol', avatar: 'path/to/carol-avatar.png' },
      // 更多联系人...
    ] );
    const contactsName = ref([
      { id: '2', name: 'Bob', avatar: 'path/to/bob-avatar.png' },
      { id: '3', name: 'Carol', avatar: 'path/to/carol-avatar.png' },
    ]);
    const activeContactId = ref(1);
    const inputMessage = ref('');
    const chatHistory: Ref<ChatMessage[]> = ref([
      { sender: '123', message: '你好！', timestamp: '2023-3-23T11:00:00', isRead: false },
      { sender: '456', message: '你好，Alice！', timestamp: '2023-3-23T12:00:00', isRead: false },
      // 更多消息...
    ]);
    const route = useRoute();
    // 你可以直接在setup中使用 route.params.userId 或者作为响应式引用
    const beginchatId = ref(String(route.params.userId|| 1));
    console.log(beginchatId.value)
    const showEmojis = ref(false);
    // 定义切换表情面板的函数
    const toggleEmojiPanel = () => {
      showEmojis.value = !showEmojis.value;
    };

    // 定义添加表情到输入框的函数
    const addEmojiToInput = (emoji: string) => {
      inputMessage.value += emoji; // 直接修改响应式变量的值
      showEmojis.value = false;
    };
    const populateSenderNames = () => {
      chatHistory.value = chatHistory.value.map((message) => {
        let senderName; // Declare a variable to hold the sender name
        console.log(contactsName.value);
        console.log(contacts.value);
        console.log("消息发送者:%s\n" , message.sender);
        if (message.sender === userId.value) {
          // If the sender ID matches the current user ID, use the current user's name
          senderName = userName.value;
        } else {
          // Otherwise, find the matching contact name from the contacts array
          const contact = contacts.value.find((contact) => contact.id === message.sender);
          const contact2 = contactsName.value.find((contact) => contact.id === message.sender);
          senderName = contact ? contact.name : contact2 ? contact2.name : "unknown"; // If no contact is found, use 'Unknown'
        }

        // Return the new message object with the sender name included
        return {
          ...message,
          sendername: senderName,
        };
      });
    };


    const fetchUserDetails = async (userId: number) => {
      try {
        const response = await axios.get(`/api/user/info?userId=${+userId}`);
        if (response.data.code === 200) {
          // console.log(response.data);
          const { userId: id, username: name, avatar } = response.data;
          contacts.value.push({ id, name, avatar });
          return response.data; // 返回用户详细信息

        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    const loadChatHistory= () =>{
      console.log("获取聊天记录")
      socket.emit('chatHistoryRequest', activeContactId.value);
      socket.off('chatHistoryResponse');
      socket.on('chatHistoryResponse', (data) => {
        console.log("聊天记录如下")
        // console.log(data);
        chatHistory.value = data.map(msg => {
          return {
            sender: msg.sender,
            message: msg.message,
            timestamp: msg.timestamp,
            isRead: msg.isRead,
          };
        });
        populateSenderNames();
        console.log(chatHistory.value);
      });

      // updateRead(contactId);
    };
    intervalId.value=setInterval(() => {
      loadChatHistory();
    }, 5000);
    const socket = io(SERVER_URL);
    console.log('userid:'+userId.value)
    socket.emit('loginRequest', userId.value);
    watch(() => route.params.userId, (newUserId) => {
      beginchatId.value = String(newUserId);


    });
    const loadChatPerson=()=>{
      socket.emit('recentChatRequest', userId.value);
      console.log('开始查询最近联系人');
      socket.on('groupNameResponse' , (data) =>{
        contactsName.value = data.map(item => {
          console.log("群聊成员：%s，%s",item.name,item.id);
          return { name: item.name, id:item.id,avatar:item.avatar};
        });
      });
      socket.on('recentChatResponse', (data) => {

        contacts.value = data.map(item => {

          return { name: item.name, id:item.id,avatar:item.avatar };

        });
      });


    }
    console.log('最近联系人数据',  contacts.value);
    onMounted(() => {
      console.log("发起和"+beginchatId.value+"的聊天");
      fetchUserDetails(beginchatId.value);

      console.log(contacts.value)
      loadChatHistory();
      loadChatPerson();
      console.log(contacts.value);
      console.log(beginchatId.value);
      const existingContact = contacts.value.find(contact => contact.id === beginchatId.value);

      // 如果不存在，则发送初始会话消息
      if (!existingContact) {
        const now = new Date();
        const timestamp = now.toISOString();

        socket.emit('messageRequest', {
          senderId: userId.value,
          receiverId: beginchatId.value,
          message: "我们已经是好友啦，开始聊天吧",
          timestamp: timestamp,
          isRead: false,
        });
        console.log("初始对话建立成功");

        chatHistory.value.push({
          sender: userId.value,
          receiver: beginchatId.value,
          message: "我们已经是好友啦，开始聊天吧",
          timestamp: timestamp,
          isRead: false,
        });
      }
      loadChatHistory();
      loadChatPerson();
    });

    socket.on('acknowledgeResponse', (updatedSender) => {
      console.log('Read status updated for messages from:', updatedSender);

      // 如果当前选中的聊天对象是更新消息的发送者，重新加载聊天记录
      if (updatedSender === activeContactId.value) {
        loadChatHistory();

      }
    });
    socket.on('loginResponse', (data) => {
      console.log("有人上线");

      //data:字符串id
    });
    //收到有人下线的通知
    socket.on('logoutResponse', (data) => {
      console.log("有人下线")
      //data:字符串id
    });
    onUnmounted(() => {
      // 组件卸载时清理
      socket.off('recentChatResponse');
      clearInterval(intervalId.value);
      socket.close();
    });
    // onMounted();


    console.log(activeContactId.value)
    // 在<script>标签中
    const currentContact = computed(() => {
      const contact = contacts.value.find(c => c.id === activeContactId.value);
      return contact || { name: '', avatar: '' }; // 如果未找到，则返回一个带有空属性的对象
    });

    const sendMessage = () => {
      const now = new Date();
      // 格式化时间戳，例如: '2023-03-15T14:20:00Z'
      const timestamp = now.toISOString();
      // 添加消息到聊天历史，并清空输入框
      if (inputMessage.value.trim() !== '') {
        socket.emit('messageRequest', {
          senderId: userId.value,
          receiverId: activeContactId.value,
          message: inputMessage.value,
          timestamp:timestamp,
          isRead: false,
        });
        console.log("成功发送消息");
        chatHistory.value.push({
          sender: userId.value,
          receiver:activeContactId.value,
          message: inputMessage.value,
          timestamp:timestamp,
          isRead: activeContactId.value[0] === 'g',
        });

        //从输入框清除消息
        inputMessage.value = '';
      }
    };


    const selectContact = (contact:number) => {
      activeContactId.value = contact;

      console.log('Selected contact:', contact);
      socket.emit('acknowledgeRequest', activeContactId.value);
      loadChatHistory();
    };
    return{
      showEmojis,
      emojis: emojiData.data.split(','),
      toggleEmojiPanel,
      addEmojiToInput,
      socket,
      userId,
      userName,
      contacts,
      activeContactId,
      currentContact,
      selectContact,
      chatHistory,
      inputMessage,
      sendMessage,
      beginchatId,
      fetchUserDetails,
      loadChatHistory,
      loadChatPerson,
      SERVER_URL,
      intervalId,
      populateSenderNames,
      contactsName,
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


.message {
  padding: 10px;
  margin-bottom: 10px;
}

.sent {
  text-align: right;
}

.received {
  text-align: left;
}

.message-metadata {

  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
  margin-top: 5px;
}

.message.sent {
  text-align: right;
  color: rgba(189,245,255,0.8); /* 标识字体颜色 */
}

.message.received {
  text-align: left;
  color: rgba(245,244,159,0.8); /* 标识字体颜色  */
}
.message-content {
  display: inline-block;
  max-width: 70%;
  padding: 10px;
  border-radius: 20px;
  background-color: rgba(152,208,66,0.2);
}
.sent .message-content {
  background-color:rgba(66,154,155,0.2);/* 标识气泡颜色  */
}
.read-status {
  margin-left: 10px;
}

.emoji-container {
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  position: absolute; /* 或其他位置调整 */
  z-index: 1000; /* 确保在输入框上方 */
  max-height: 80px; /* 或您想要的任何高度 */
  overflow-y: auto; /* 添加滚动条 */

  transform: translateY(100%); /* 将表情面板向上移动自身的高度 */
}

.emoji-container span {
  cursor: pointer;
  margin: 5px;
}
</style>
