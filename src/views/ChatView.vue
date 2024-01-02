<template>
	<div>
		<!-- 下拉框 -->
		<el-select v-model="userId" placeholder="请选择 ID">
			<el-option
					v-for="id in ids"
					:key="id"
					:label="id"
					:value="id">
			</el-option>
		</el-select>

		<!-- 显示选择的 ID -->
		<div>选择的 ID 是: {{ userId }}</div>
	</div>
	<div class="chat-app">
		<!-- 联系人列表 -->
		<div class="contact-list">
			<div
					class="contact"
					v-for="identityOption in identityOptions"
					:key="identityOption.contactId"
					:class="{ 'selected': identityOption.contactId === selectedId }"
					@click="selectIdentity(identityOption.contactId)"
			>
				{{ identityOption.name }}
			</div>
		</div>

		<!-- 消息记录 -->
		<div class="chat-container">

			<div class="message-history">
				<div v-for="msg in currentChatHistory" :key="msg.timestamp" class="message"
				     :class="{ 'sent': msg.senderId === userId, 'received': msg.senderId !== userId }">
					{{ msg.senderId }}:<span class="timestamp">{{ new Date(msg.timestamp).toLocaleString() }}</span><br>
					<div class="message-content">
						<div class="message-metadata">
							<!-- 使用符号来表示已读和未读 -->
							<div>{{ msg.message }}</div>
						</div>
					</div>
					<span class="read-status">{{ msg.isRead ? '✔️' : '🕒' }}</span>
				</div>
			</div>


			<!-- 消息容器 -->
			<div class="message-container">
				<button @click="toggleEmojiPanel">😀</button>
				<div v-if="showEmojis" class="emoji-container">
          <span v-for="(emoji, index) in emojis" :key="index" @click="addEmojiToInput(emoji)">
            {{ emoji }}
          </span>
				</div>
				<el-input
						type="textarea"
						v-model="message"
						placeholder="请输入消息"
						class="message-input">
				</el-input>
				<el-button color="#626aef" :dark="isDark" @click="sendMessage">发送</el-button>
			</div>
		</div>
		<div class="chat-user-info">
			<h3>聊天者信息</h3>
			<div>ID: {{ userId }}</div>
			<!-- 这里可以添加更多聊天者的信息 -->
		</div>
	</div>
</template>
<script>
import io from 'socket.io-client';
import emojiData from "../emoji.json";

export default {
  data() {
    return {
      identityOptions: [
        {name: "A", contactId: "A"},
        {name: "B", contactId: "B"},
        {name: "C", contactId: "C"}
        // 可以根据需要添加更多选项
      ],
      currentChatHistory: [],
      userId: '7', // 假设的当前用户ID
      ids: [...Array(26)].map((_, i) => String.fromCharCode(65 + i)), // 生成从 A 到 Z 的 ID 数组
      selectedId: 'Z',
      socket: null,
      // identity: '',
      message: '',
      showEmojis: false,
      emojis: emojiData.data.split(','),
    };
  },
  mounted() {
    console.log("mounted");
    this.initializeChat();
    // this.socket = io('http://localhost:9092');
    //
    // this.socket.on('messageEvent', (data) => {
    //   console.log('Message from server:', data);
    // });
    //
    // this.socket.emit('requestRecentChats', this.userId );
    //
    // // this.socket.on('recentChatResponse', (data) => {
    // //   this.identityOptions = data.map(item => {
    // //     return { name: item.contactId, contactId: item.contactId };
    // //   });
    // // });
    // this.socket.on('recentChatResponse', (data) => {
    //   this.identityOptions = data.map(item => {
    //     return { name: item.contactId, contactId: item.contactId };
    //   });
    // });
    // // 前端接收聊天记录并更新界面
    // this.socket.on('chatHistoryResponse', (data) => {
    //   this.currentChatHistory = data.map(msg => {
    //     return {
    //       senderId: msg.senderId,
    //       message: msg.message,
    //       timestamp: msg.timestamp,
    //       isRead:msg.isRead,
    //     };
    //   });
    // });

  },
  methods: {
    //加载聊天记录
    loadChatHistory(contactId) {
      this.socket.emit('fetchChatHistory', {senderId: this.userId, receiverId: this.selectedId});
      this.updateRead(contactId);
    },
    //选择联系人
    selectIdentity(selectedId) {
      this.selectedId = selectedId;
      console.log("Chat with:", selectedId);
      this.updateRead(selectedId);
      this.socket.emit('updateReadStatus', {
        senderId: selectedId,
        receiverId: this.userId
      });

      this.loadChatHistory(selectedId);

    },

    updateRead(selectedId) {
      this.socket.emit('updateReadStatus', {
        senderId: selectedId,
        receiverId: this.userId
      });
    },
    //发送信息
    sendMessage() {
      const now = new Date();
      // 格式化时间戳，例如: '2023-03-15T14:20:00Z'
      const timestamp = now.toISOString();
      console.log("Sending message:", {
        senderId: this.userId,
        receiverId: this.selectedId,
        message: this.message,
        timestamp: timestamp,
        isRead: false
      });
      this.socket.emit('messageEvent', {
        senderId: this.userId,
        receiverId: this.selectedId,
        message: this.message,
        timestamp: timestamp,
        isRead: false
      });
      // this.socket.emit('simpleMessageEvent', 'Hello, world!');


      const newMessage = {
        senderId: this.userId,
        receiverId: this.selectedId,
        message: this.message,
        timestamp: timestamp,
      };
      //从输入框清除消息
      this.currentChatHistory.push(newMessage);
      this.message = '';
    },
    toggleEmojiPanel() {
      this.showEmojis = !this.showEmojis;
    },
    addEmojiToInput(emoji) {
      this.message += emoji;
      this.showEmojis = false;
    },
    initializeChat() {
      console.log("正在链接ws");
      this.socket = io('http://localhost:9092' + '?id=7');
      // this.socket.emit('Authorize', this.userId);
      this.socket.on('messageEvent', (data) => {
        console.log('Message from server:', data);
        if (data.receiverId === this.userId) {
          // 如果是，调用 loadChatHistory 方法加载聊天记录
          // 假设 senderId 是从 data 中获取的发送者ID
          const senderId = data.senderId;
          // this.updateRead(senderId);
          this.loadChatHistory(senderId);
        }
      });
      //收到消息已读的通知
      this.socket.on('acknowledgeResponse', (updatedSender) => {
        console.log('Read status updated for messages from:', updatedSender);

        // 如果当前选中的聊天对象是更新消息的发送者，重新加载聊天记录
        if (updatedSender === this.userId) {
          this.loadChatHistory(updatedSender);
        }
      });
      //this.socket.emit('requestRecentChats', this.userId);
      //收到最近聊天列表的通知
      this.socket.on('recentChatResponse', (data) => {
        console.log('Recent chats:', data);
        this.identityOptions = data.map(item => {
          return {name: item.contactId, contactId: item.contactId};
        });
      });
      //收到聊天记录的通知
      this.socket.on('chatHistoryResponse', (data) => {
        this.currentChatHistory = data.map(msg => {
          return {
            senderId: msg.senderId,
            message: msg.message,
            timestamp: msg.timestamp,
            isRead: msg.isRead,
          };
        });
      });
      //收到有人上线的通知
      this.socket.on('loginResponse', (data) => {
        //data:字符串id
      });
      //收到有人下线的通知
      this.socket.on('logoutResponse', (data) => {
        //data:字符串id
      });
      console.log('Socket connection established.');
    }
  },
  watch: {
    userId(newUserId, oldUserId) {
      if (newUserId !== oldUserId) {
        console.log("User ID changed from", oldUserId, "to", newUserId);
        this.initializeChat();
      }
    }
  },
};
</script>

<style>
.chat-app {
    display: flex;
    max-width: 90%; /* 或使用具体的像素值，如 '800px' */
}

.contact-list {
    width: 200px; /* 可根据需要调整宽度 */
    border-right: 1px solid #eee;
    padding: 10px;
}

.contact {
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    background-color: white; /* 添加白色背景色 */
    border: 1px solid transparent;
    border-radius: 4px;
}

.contact:hover {
    background-color: #f5f5f5; /* 鼠标悬浮时的背景色 */
    border-color: #e0e0e0;
}

.contact.selected {
    background-color: #b2b2cc; /* 选中时的背景色 */
}

.chat-container {
    flex-grow: 1; /* 让聊天区域占据剩余空间 */
    display: flex;
    flex-direction: column;
    width: 75%; /* 设置聊天容器的宽度 */
}

.message-container {
    flex-grow: 1;
    padding: 20px;
}

.message-input {
    margin-bottom: 20px;
}

/* ... 现有的 CSS 样式 ... */

.message-history {
    overflow-y: auto;
    height: 400px; /* 设置固定高度 */
    padding: 20px; /* 内边距 */
    border: 1px solid #ddd; /* 边框 */
    margin: 10px; /* 与外部元素的距离 */
    background-color: #f8f8f8; /* 背景色 */
}

.message {
    margin-bottom: 10px;
}

.message.sent {
    text-align: right;
    color: blue; /* 标识发送的消息 */
}

.message.received {
    text-align: left;
    color: green; /* 标识接收的消息 */
}

.message-input-area {
    display: flex;
    flex-direction: column;
}

.chat-container {
    width: 100%;
    max-width: 600px; /* 可以根据需要调整宽度 */
    margin: auto;
    padding: 10px;
    background-color: #f4f4f8;
}

.message-history {
    height: 500px;
    overflow-y: auto;
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

.message-content {
    display: inline-block;
    max-width: 70%;
    padding: 10px;
    border-radius: 20px;
    background-color: #e0e0e0;
}

.sent .message-content {
    background-color: #b0e0e6;
}

.message-metadata {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    margin-top: 5px;
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
}

.emoji-container span {
    cursor: pointer;
    margin: 5px;
}

.chat-user-info {

    width: 250px; /* 调整宽度 */
    padding: 5px;
    border-right: 1px solid #ccc;
    margin-right: 1px;
    background-color: white; /* 设置背景色为白色 */
}
</style>
