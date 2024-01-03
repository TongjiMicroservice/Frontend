<template>
  <el-container >

    <el-header style="text-align: right; padding: 0 10px;">
      <el-row>
        <el-col span="10">
      <div class="p-4">
        <el-radio-group v-model="radio">
          <el-radio-button label="显示全部" />
          <el-radio-button label="已收藏" />
          <el-radio-button label="未收藏" />

        </el-radio-group>
      </div>
        </el-col>
        <el-col span="4">
          <div class="space"></div>
        </el-col>
        <el-col span="8">
      <div class="header-content">
        <!-- 搜索框 -->
        <el-input
            placeholder="搜索文件"
            style="width: 280px;height:40px"
            v-model="searchQuery"
            class="search-input m-4"
        />

      </div></el-col>
      </el-row>

    </el-header>
    <el-main>

        <el-upload
            class="upload-demo "
            drag
            :action="'http://luxingzhi.cn:8090/api/file?userId=' + userId + '&projectId=' + projectId"

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

      <el-table :data="filteredFiles.slice(start,start+pageSize)" class="my-custom-table" style="width: 100%" >
        <el-table-column type="index" label="#" width="60"/>
        <el-table-column label="文件类型" width="80">
          <template #default="{ row }">
            <component
                :is="getIconComponent(row.type)"
                class="file-icon"
                style="margin-right: 5px; font-size: 20px;"
            ></component>
          </template>
        </el-table-column>
        <el-table-column   width="40"/>
        <el-table-column prop="name" label="文件名" width="140">
        <template #default="{ row}">
        {{ row.name }}
        </template>
        </el-table-column>
        <el-table-column prop="filesize" label="大小（B）" width="100"/>
        <el-table-column label="星标" width="80">
          <template #default="{ row }">
            <el-button type="text" @click="toggleStar(row)">
              <el-icon v-if="row.starred" :size="20">
                <star-filled />
              </el-icon>
              <el-icon v-else :size="20">
                <star />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="修改日期" width="240"/>
        <el-table-column prop="userId" label="上传者" width="100"/>
        <el-table-column label="操作" width="480">
          <template #default="{ row }">

            <el-button type="text" icon="Download" @click="downloadFile(row)">下载</el-button>
            <el-button type="text" icon="Delete" @click="deleteFile(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="py-3 flex justify-center items-center">
        <el-pagination layout="prev, pager, next" :total="filteredFiles.length" background :page-size="pageSize" v-model:current-page="currentPage" />
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { onMounted,defineComponent, reactive, Ref,computed,ref } from 'vue';
import 'element-plus/dist/index.css';
import { Document, Delete, Download, FolderOpened ,Tickets,Picture,VideoPlay,Message } from '@element-plus/icons-vue';
import { UploadFilled,StarFilled, Star } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import axios from 'axios';
import Project from "@/models/Project";


interface File {
  id:number;
  userId:number;
  url: string;
  type: string;
  name: string;
  filesize: number;
  uploadTime: string;
  projectId: number;
  starred: number;
}
// const store = useStore();
//
// const userId = computed(() => store.state.currentUser.id);
// const projectId = computed(() => store.state.projects);
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
    const pageSize=ref(3);
    const currentPage=ref(1);
    const start = computed(() => (currentPage.value - 1) * pageSize.value);
    const searchQuery: Ref<string> = ref('');
    // const files = ref<File[]>([]);
    const fileschange = ref<File[]>([]);
    const files = reactive([
      { id:333,userId:1, projectId:2,url:'aaa',  type: 'pdf' , name: 'Redis学习笔记.pdf', filesize: 500,uploadTime: '2023-11-23 16:43',starred:1 },
      { id:666,userId:2, projectId:2,url:'bbb', type: 'txt' , name: 'nginx学习笔记.txt',  filesize: 600,uploadTime: '2023-11-19 20:17', starred:0},
      // 更多文件数据
    ]);
    const starredFiles = computed(() => {
      return files.filter(file => file.starred === 1);
    });
    const radio = ref('显示全部')
    const store=useStore();
    const userId = computed(() => store.state.currentUser.id);
    const projectId=computed(() => store.state.currentProjectId);
    console.log(userId.value)
    console.log(projectId.value)
    onMounted(async () => {
       fetchFilesByProject(); // 确保在这里传递正确的项目ID
    });
    async function fetchFilesByProject() {
      try {
        const response = await axios.get(`/api/file-by-project?projectId=${projectId.value}`, {
          headers: { 'accept': 'application/json' }
        });
        if (response.data.code === 200 && response.data.list) {

           console.log(response.data.list)
          fileschange.value = response.data.list.map((file): File => {
            console.log("size:"+file.size);
            return {
              userId: file.userId,
              url: file.url,
              type: file.type || 'unknown', // assuming that type is optional and might not be present
              name: file.name,
              filesize: file.size,
              uploadTime: file.uploadTime,
              projectId: file.projectId,
              starred:file.starred,
              id:file.id,
            };
          });
          console.log(fileschange.value)
          updateFiles()
          console.log(files)
        }
      } catch (error) {
        console.error('Failed to retrieve files information', error);
      }
    }
    function updateFiles() {
      // 清空当前 files 数组
      files.splice(0, files.length);

      // 将 fileschange.value 中的每个文件对象添加到 files 数组中
      fileschange.value.forEach(file => {
        files.push(file);
      });
    }


    const toggleStar = (file) => {
      // 这里假设 starred 属性是一个数字，0 表示未星标，1 表示已星标
      file.starred = file.starred ? 0 : 1;
      console.log("正在改变")
      console.log(file.id)
      axios.patch(`/api/file/star?fileId=${file.id}`)
          .then(response => {
            if (response.data.code === 200) {
              console.log('Star status toggled successfully:', response.data.message);
              // Handle successful star toggle here
            } else {
              console.error('Failed to toggle star status:', response.data.message);
              // Handle failure here
            }
          })
          .catch(error => {
            console.error('Error toggling star status:', error);
            // Handle errors here
          });

    };

    const filteredFiles = computed(() => {
      // 首先根据收藏状态过滤文件
      let result = files;
      if (radio.value === '已收藏') {
        result = result.filter(file => file.starred === 1);
      } else if (radio.value === '未收藏') {
        result = result.filter(file => file.starred === 0);
      }

      // 然后应用搜索查询
      if (searchQuery.value) {
        result = result.filter(file =>
            file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      return result;
    });

    const getIconComponent = (type: string) => {
      const typeToIconComponentMap: Record<string, typeof Document | typeof FolderOpened|typeof Tickets|typeof Picture| typeof VideoPlay |typeof Message> = {
        pdf: Message,
        txt: Tickets,
        doc: FolderOpened,
        jpg: Picture,
        png: Picture,
        mp4:VideoPlay ,

        // 更多类型的图标组件
      };
      return typeToIconComponentMap[type] || Document;
    };

    const downloadFile = (file: any): void => {
      // 实现文件下载逻辑
      console.log('Downloading', file);
      window.open(file.url);
    };

    const deleteFile = (file: any): void => {
      // 实现文件删除逻辑
      console.log('Deleting', file.name);

      const encodedFileName = encodeURIComponent(file.name);
      const url = `/api/file?fileName=${encodedFileName}`;

      axios.delete(url, {
        headers: {
          'Accept': 'application/json'
        }
      })
          .then(response => {
            const data = response.data;
            // 这里处理从服务器接收到的数据
            if (data.code === 200) {
              console.log('成功删除:', data);
              fetchFilesByProject(); // 调用fetchFilesByProject函数
            } else {
              console.warn('删除失败:', data);
            }
          })
          .catch(error => {
            // 这里处理错误情况
            if (error.response) {
              // 服务器响应了请求但状态码不在2xx的范围内
              console.error('删除失败，状态码:', error.response.status);
              console.error('失败响应:', error.response.data);
            } else if (error.request) {
              // 请求已经发出，但是没有收到响应
              console.error('没有响应:', error.request);
            } else {
              // 在设置请求的时候触发了某些问题
              console.error('请求错误:', error.message);
            }
          });
    };
    const handleUploadSuccess = (response: any, file: any, fileList: any) => {
      console.log("Upload Successful:", response, file, fileList);
      fetchFilesByProject(); // 调用fetchFilesByProject函数
      // 这里可以添加逻辑来处理上传成功
    };

    const handleUploadError = (err: any, file: any, fileList: any) => {
      console.error("Upload Error:", err, file, fileList);
      // 这里可以添加逻辑来处理上传错误
    };
    return {
      pageSize,
      currentPage,
      start,
      radio,
      userId,
      projectId,
      files,
      fileschange,
      searchQuery,
      filteredFiles,
      getIconComponent,
      downloadFile,
      deleteFile,
      handleUploadSuccess,
      handleUploadError,
      toggleStar,
      updateFiles,
      // userId,
      // projectId,
    };
  },
});
</script>

<style >
.my-custom-table :deep(.el-table__body-wrapper tbody tr) {
  background-color: transparent !important;
}
.my-custom-table :deep(.el-table__header-wrapper thead th) {
  background-color: rgba(78,68,247,0.2)!important; /* 半透明蓝色 */
}
.my-custom-table:deep(.el-table__body-wrapper tbody tr:hover) {
  background-color: rgba(183,203,240, 0.9) !important;
}
.el-table__body-wrapper > tbody > tr {
  background-color: transparent !important;
}
.upload-container{
  height:300px;
}
</style>

