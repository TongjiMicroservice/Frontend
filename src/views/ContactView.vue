<template>
  <div>
    <el-input v-model="searchQuery" placeholder="搜索成员..."></el-input>
    <el-row :gutter="20">
      <el-col v-for="member in filteredMembers" :key="member.id" :span="24">
        <div class="member-item">
          <img :src="member.avatar" alt="头像" class="avatar" />
          <div class="space"></div>
          <span>
            <!-- 悬停在姓名上时显示的 popover -->
            <el-popover placement="top" trigger="hover" :width="300">
              <p><strong>电话：</strong>{{ member.phone }}</p>
              <p><strong>邮箱：</strong>{{ member.email }}</p>
              <template #reference>
                <span class="name">{{ member.name }}</span>
              </template>
            </el-popover>
          </span>
          <el-button>聊天</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

interface Member {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
}
export default defineComponent({
  setup() {
    const members = ref<Member[]>([{
          id: '1',
          name: '张三',
          avatar: 'avatar1.jpg',
          phone: '123-456-7890',
          email: 'zhangsan@example.com'
        },
        {
          id: '2',
          name: '李四',
          avatar: 'avatar2.jpg',
          phone: '234-567-8901',
          email: 'lisi@example.com'
        },
        {
          id: '3',
          name: '王五',
          avatar: 'avatar3.jpg',
          phone: '345-678-9012',
          email: 'wangwu@example.com'
        },
        {
          id: '4',
          name: '赵六',
          avatar: 'avatar4.jpg',
          phone: '456-789-0123',
          email: 'zhaoliu@example.com'
        },
        {
          id: '5',
          name: '孙七',
          avatar: 'avatar5.jpg',
          phone: '567-890-1234',
          email: 'sunqi@example.com'
        },
  ]);
    const searchQuery = ref('');
    const detailsVisible = ref(true);
    const selectedMember = ref<Member | null>(null);

    // 计算属性：根据搜索查询过滤成员
    const filteredMembers = computed(() =>
        members.value.filter(member =>
            member.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    );

    function showDetails(member: Member) {
      console.log(member)
      selectedMember.value = member;
      detailsVisible.value = true;
    }

    return {
      searchQuery,
      filteredMembers,
      showDetails,
      detailsVisible,
      selectedMember,
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
</style>
