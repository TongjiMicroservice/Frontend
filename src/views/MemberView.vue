<template>
  <div>
    <!-- 编辑联系人dialog窗口 -->
    <el-dialog title="编辑" v-model="editFormVisible" width="30%">
      <el-form :model="editForm" :rules="formRules" ref="editFormRef">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="editForm.tel"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeEditForm">取消</el-button>
        <el-button type="primary" @click="saveContact">保存</el-button>
      </template>
    </el-dialog>

    <el-card class="list-card">
      <el-table :data="displayedData" empty-text="暂无联系人">
        <el-table-column
            prop="id"
            label="id"
            width="80"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            align="center"
        ></el-table-column>
        <el-table-column
            prop="tel"
            label="电话"
            align="center"
        ></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="showEditForm(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteContact(row)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            layout="prev, pager, next"
            :total="contactList.length"
            :page-size="pageSize"
            v-model:current-page="currentPage"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from 'axios'

export default defineComponent({
  name: "ContactList",
  setup() {
    const contactList = ref([
      { id: 3, name: "王五", tel: "15833333333" },
      { id: 5, name: "钱七", tel: "17755555555" },
      { id: 2, name: "李四", tel: "13922222222" },
      { id: 1, name: "张三", tel: "13811111111" },
      { id: 7, name: "周九", tel: "16577777777" },
      { id: 6, name: "孙八", tel: "15066666666" },
      { id: 10, name: "马二", tel: "13000000000" },
      { id: 4, name: "赵六", tel: "18844444444" },
      { id: 18, name: "高静", tel: "13888888888" },
      { id: 17, name: "鲁阳", tel: "13777777777" },
      { id: 16, name: "贾钢", tel: "13666666666" },
      { id: 15, name: "金莉", tel: "13555555555" },
      { id: 14, name: "胡伟", tel: "13444444444" },
      { id: 13, name: "陈红", tel: "13333333333" },
      { id: 12, name: "史琳", tel: "13222222222" },
      { id: 11, name: "祖维", tel: "13111111111" },
      { id: 9, name: "郑一", tel: "15999999999" },
      { id: 8, name: "吴十", tel: "17688888888" },
      { id: 19, name: "马超", tel: "13999999999" },
      { id: 20, name: "周涛", tel: "14000000000" },
    ]);
    const sortedContactList = ref([]);
    const displayedData = ref([]);
    const pageSize = ref(5);
    const currentPage = ref(1);
    const editFormVisible = ref(false);
    const editForm = ref({ id: "", name: "", tel: "" });
    const formRules = ref({
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      tel: [
        {
          required: true,
          message: "请输入电话号码",
          trigger: "blur",
        },
        {
          pattern: /^1[3456789]\d{9}/,
          message: "请输入有效的手机号码",
          trigger: "blur",
        },
      ],
    });

    // 获取所有联系人列表
    const getContactList = () => {
      sortedContactList.value = contactList.value
          .slice()
          .sort((a, b) => a.id - b.id);
      displayedData.value = sortedContactList.value.slice(0, pageSize.value);
    };

    // 显示编辑弹窗
    const showEditForm = (row) => {
      editFormVisible.value = true;
      editForm.value = Object.assign({}, row);
    };

    // 关闭编辑弹窗
    const closeEditForm = () => {
      editFormVisible.value = false;
      ElMessage({
        message: "已取消编辑。",
        grouping: true,
        type: "info",
      });
    };

    // 保存联系人信息
    const saveContact = () => {
      const index = sortedContactList.value.findIndex(
          (item) => item.id === editForm.value.id
      );
      if (index >= 0) {
        const oldItem = contactList.value.find(
            (item) => item.id === editForm.value.id
        );
        contactList.value.splice(contactList.value.indexOf(oldItem), 1, {
          ...oldItem,
          ...editForm.value,
        });
        sortedContactList.value.splice(index, 1, {
          ...oldItem,
          ...editForm.value,
        });
        displayedData.value.splice(
            index - pageSize.value * (currentPage.value - 1),
            1,
            editForm.value
        );
        editFormVisible.value = false;
        ElMessage({
          message: "编辑成功！",
          grouping: true,
          type: "success",
        });
      }
    };

    // 删除联系人
    const deleteContact = (row) => {
      const index = sortedContactList.value.findIndex(
          (item) => item.id === row.id
      );
      ElMessageBox.confirm(`确定要删除联系人${row.name}吗`, "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (index >= 0) {
          const oldItem = contactList.value.find((item) => item.id === row.id);
          contactList.value.splice(contactList.value.indexOf(oldItem), 1);
          sortedContactList.value.splice(index, 1);
          displayedData.value.splice(
              index - pageSize.value * (currentPage.value - 1),
              1
          );
          ElMessage({
            message: "删除成功！",
            grouping: true,
            type: "success",
          });
        }
      });
    };

    // 处理页码改变事件
    const handleCurrentChange = (val) => {
      currentPage.value = val;
      const start = pageSize.value * (currentPage.value - 1);
      const end = pageSize.value * currentPage.value;
      displayedData.value = sortedContactList.value.slice(start, end);
    };

    // 初始化获取所有联系人列表
    getContactList();

    return {
      contactList,
      sortedContactList,
      displayedData,
      pageSize,
      currentPage,
      editFormVisible,
      editForm,
      formRules,
      getContactList,
      showEditForm,
      closeEditForm,
      saveContact,
      deleteContact,
      handleCurrentChange,
    };
  },
});
</script>

<style>
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
