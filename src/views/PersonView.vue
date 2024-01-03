<template>
  <el-card v-for="contact in contacts" :key="contact.id" class="contact-card" @click="selectContact(contact)">
    <div class="contact-info">
      <el-avatar :src="contact.avatar"></el-avatar>
      <div class="contact-details">
        <h3>{{ contact.name }}</h3>
        <p>ID: {{ contact.id }}</p>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElAvatar, ElCard } from 'element-plus';

export default defineComponent({
  components: {
    ElAvatar,
    ElCard
  },
  setup() {
    const contacts = ref([
      { id: 'A', name: 'Alice', avatar: 'path/to/avatar1.png' },
      { id: 'B', name: 'Bob', avatar: 'path/to/avatar2.png' },
      { id: 'C', name: 'Charlie', avatar: 'path/to/avatar3.png' },
      // 更多联系人...
    ]);

    const selectContact = (contact: any) => {
      console.log('Selected contact:', contact);
      // 这里执行选择联系人的逻辑，比如更新当前聊天对象的状态
    };

    return {
      contacts,
      selectContact
    };
  },
});
</script>

<style scoped>
.contact-card {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.contact-card:hover {
  background-color: #f5f5f5;
}

.contact-info {
  display: flex;
  align-items: center;
}

.contact-details {
  margin-left: 10px;
}

.contact-details h3 {
  margin: 0;
  font-size: 1.2em;
}

.contact-details p {
  margin: 0;
  color: #666;
}
</style>
