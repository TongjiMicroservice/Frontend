<script setup lang="ts">
import {onMounted, ref,computed} from 'vue'
import {useStore} from 'vuex'
import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus';

const store=useStore()
const pageSize = ref(6);
const currentPage = ref(1);
const start = computed(() => (currentPage.value - 1) * pageSize.value);

const view=ref('all')


const currentProjectMembers=ref<{
  userId:number,
  username:string,
  avatar:string
  privilege:number
}[]>([])

const filteredMembers = ref<{
    userId:number,
    username:string,
    avatar:string
    privilege:number
}[]>([]);

const filterMember=(view:string)=>{
    if(view==='all'){
        filteredMembers.value=currentProjectMembers.value
    }else if(view==='member'){
        filteredMembers.value=currentProjectMembers.value.filter((member)=>{
            return member.privilege===1
        })
    }else if(view==='admin'){
        filteredMembers.value=currentProjectMembers.value.filter((member)=>{
            return member.privilege===2
        })
    }

}


const getCurrentProjectMembers=()=>{
  loading.value=true
  currentProjectMembers.value=[]
  axios({
    method:'get',
    url:'/api/project/member/get',
    params:{
      projectId:store.state.currentProjectId
    }
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      let data=res.data.members
      for(let i=0;i<data.length;i++){
        axios.get('/api/user/info',{
          params:{
            userId:data[i].userId
          }
        }).then((r)=>{
          if(r.status===200&&r.data.code===200){
            let user={
              userId:r.data.userId,
              username:r.data.username,
              avatar:r.data.avatar,
              privilege:data[i].privilege
            }
            currentProjectMembers.value.push(user)
            if(i===data.length-1){
              filteredMembers.value=currentProjectMembers.value
              loading.value=false
            }
          }else{
            ElMessage({
              message: `获取项目成员失败，${r.data.message}`,
              type: 'error',
            });
            loading.value=false
          }
        })
      }
    }else{
      ElMessage({
        message: `获取项目成员失败，${res.data.message}`,
        type: 'error',
      });
    }
  })
}

const loading=ref(false)

const handlePrivilege=(userId:number,privilege:number)=>{
  axios({
    method:'patch',
    url:'/api/project/privilege/update',
    params:{
      projectId:store.state.currentProjectId,
      userId:userId,
      privilege:privilege
    }
  }).then((res)=>{
    if(res.status===200&&res.data.code===200){
      ElMessage({
        message: `修改权限成功`,
        type: 'success',
      });
      getCurrentProjectMembers()
    }else{
      ElMessage({
        message: `修改权限失败，${res.data.message}`,
        type: 'error',
      });
    }
  })
}

const addMemberDialogVisible=ref(false)

const searchEmail=ref('')

const addMember=()=>{
    axios({
        method:'post',
        url:'/api/project/member/add-by-email',
        params:{
            projectId:store.state.currentProjectId,
            email:searchEmail.value
        }
    }).then((res)=>{
        if(res.status===200&&res.data.code===200){
            ElMessage({
                message: `邀请成功`,
                type: 'success',
            });
            addMemberDialogVisible.value=false
            getCurrentProjectMembers()
        }else{
            ElMessage({
                message: `邀请失败，${res.data.message}`,
                type: 'error',
            });
        }
    })
}

const handleAddMemberOpen=()=>{
    addMemberDialogVisible.value=true
}

onMounted(()=>{
    getCurrentProjectMembers()
})
</script>

<template>
    <div class="w-full h-full p-2 pt-10">
        <div class="flex justify-between pr-5">
            <el-radio-group
                v-model="view"
                class="pl-1"
                @change="filterMember(view)"
            >
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="member">成员</el-radio-button>
                <el-radio-button label="admin">管理员</el-radio-button>
            </el-radio-group>
            <el-button @click="handleAddMemberOpen" type="success">邀请新成员</el-button>
            <el-dialog
                v-model="addMemberDialogVisible"
                title="邀请新成员"
            >
                <el-form>
                    <el-form-item label="邮箱">
                        <el-input v-model="searchEmail" placeholder="请输入用户邮箱"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="addMemberDialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="addMember">确定</el-button>
                </template>
            </el-dialog>
        </div>
        
        <el-table v-loading="loading" stripe :data="filteredMembers.slice(start,start+pageSize)" class="w-full mt-5">
            <el-table-column prop="userId" label="用户ID"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column label="权限">
                <template #default="scope">
                   <el-tag v-if="scope.row.privilege===1" type="primary">成员</el-tag> 
                   <el-tag v-else-if="scope.row.privilege===2" type="success">管理员</el-tag>
                   <el-tag v-else-if="scope.row.privilege===3" type="warning">创建者</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button link v-if="scope.row.privilege===1" type="primary" @click="handlePrivilege(scope.row.userId,2)">赋予管理员</el-button>
                    <el-button link v-if="scope.row.privilege===2" type="danger" @click="handlePrivilege(scope.row.userId,1)">移除管理员</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="py-3 flex justify-center items-center">
            <el-pagination layout="prev, pager, next" :total="filteredMembers.length" background :page-size="pageSize" v-model:current-page="currentPage" />
        </div>
    </div>
</template>

<style scoped>
</style>