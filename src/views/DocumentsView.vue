<template>
  <el-container>
    <el-header style="text-align: right; padding: 0 20px;">

      <div class="header-content">
        <!-- 搜索框 -->
        <el-input
            placeholder="搜索文件"
            style="width: 200px;"
            v-model="searchQuery"
            class="search-input"
        />

        <!-- 文件上传按钮 -->
<!--        <el-upload-->
<!--            class="upload-demo"-->
<!--            action="http://example.com/upload"-->
<!--            :on-success="handleUploadSuccess"-->
<!--            :on-error="handleUploadError"-->
<!--            style="margin-left: auto;"-->
<!--        >-->
<!--          <el-button size="small" type="primary">点击上传</el-button>-->
<!--        </el-upload>-->
      </div>
    </el-header>

    <el-main>
      <div class="upload-container">
        <el-upload
            class="upload-demo "
            drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :data="{ userId:userId.value, username: projectId.value[0]?.id }"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            multiple
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              files with a size less than 500Mb
            </div>
          </template>
        </el-upload>
      </div>
      <el-table :data="filteredFiles" style="width: 100%;" stripe>
        <el-table-column type="index" label="#" width="80"/>
        <el-table-column label="文件" width="180">
          <template #default="{ row }">
            <component
                :is="getIconComponent(row.type)"
                class="file-icon"
                style="margin-right: 5px; font-size: 20px;"
            ></component>
            {{ row.name }}
          </template>

        </el-table-column>
        <el-table-column  width="280"/>
        <el-table-column prop="date" label="修改日期" width="280"/>
        <el-table-column label="操作" width="480">
          <template #default="{ row }">
            <el-button type="text" icon="Download" @click="downloadFile(row)">下载</el-button>
            <el-button type="text" icon="Delete" @click="deleteFile(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { onMounted,defineComponent, reactive, Ref,computed,ref } from 'vue';
import 'element-plus/dist/index.css';
import { Document, Delete, Download, FolderOpened ,Tickets} from '@element-plus/icons-vue';
import { UploadFilled } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import Project from "@/models/Project";


const store = useStore();

const userId = computed(() => store.state.currentUser.id);
const projectId = computed(() => store.state.projects);
export default defineComponent({
  name: 'FileManager',
  components: {
    Document,
    Delete,
    Download,
    FolderOpened,
    Tickets ,
  },
  setup() {
    const searchQuery: Ref<string> = ref('');

    const files = reactive([
      { name: 'Redis学习笔记.pdf', date: '2023-11-23 16:43', type: 'pdf' },
      { name: 'nginx学习笔记.txt', date: '2023-11-19 20:17', type: 'txt' },
      // 更多文件数据
    ]);

    const store = useStore();
    const projectId = computed(() => store.state.projects);
    const userId = computed(() => store.state.currentUser.id);
    console.log(userId.value)
    console.log(projectId.value[0].id)
    const filteredFiles = computed(() => {
      if (!searchQuery.value) {
        return files;
      }
      return files.filter(file => file.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
    });

    const getIconComponent = (type: string) => {
      const typeToIconComponentMap: Record<string, typeof Document | typeof FolderOpened|typeof Tickets> = {
        pdf: Document,
        txt: Tickets,
        doc: FolderOpened,
        // 更多类型的图标组件
      };
      return typeToIconComponentMap[type] || Document;
    };

    const downloadFile = (file: any): void => {
      // 实现文件下载逻辑
      console.log('Downloading', file);
    };

    const deleteFile = (file: any): void => {
      // 实现文件删除逻辑
      console.log('Deleting', file);
    };
    const handleUploadSuccess = (response: any, file: any, fileList: any) => {
      console.log("Upload Successful:", response, file, fileList);
      // 这里可以添加逻辑来处理上传成功
    };

    const handleUploadError = (err: any, file: any, fileList: any) => {
      console.error("Upload Error:", err, file, fileList);
      // 这里可以添加逻辑来处理上传错误
    };
    onMounted(async () => {
      try {
        // 发送 GET 请求到你的后端接口
        const response = await fetch('http://localhost:8090/api/file-by-project?projectId=10');
        if (response.ok) {
          const data = await response.json();
          if (data.code === 200 && data.list) {
            // 使用从后端获取的数据覆盖前端的数据
            files.splice(0, files.length, ...data.list.map(item => ({
              name: item.name + '.' + item.type, // 添加文件扩展名
              date: item.uploadTime,
              type: item.type,
              url: item.url,
              userId: item.userId,
              projectId: item.projectId,
              size: item.size
            })));
          } else {
            console.error('获取数据失败:', data.message);
          }
        } else {
          console.error('HTTP 请求错误:', response.status);
        }
      } catch (error) {
        console.error('请求发生错误:', error);
      }
    });
    return {
      searchQuery,
      filteredFiles,
      getIconComponent,
      downloadFile,
      deleteFile,
      handleUploadSuccess,
      handleUploadError,
      userId,
      projectId,
    };
  },
});
</script>

<style scoped>
.black-background {
  background-color: black;
  color: white; /* 改变文本颜色以提高可读性 */
}

.black-background .el-upload-dragger {
  border-color: transparent; /* 可选：移除边框或设置为适合黑色背景的颜色 */
}
.black-background .el-upload__text {
  color: white; /* 确保上传区域文本是白色 */
}

.black-background .el-upload__tip {
  color: white; /* 确保提示文本是白色 */
}

</style>
