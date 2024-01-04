<template>
    <div class="w-full h-full p-2 pt-10">
        <el-radio-group
            v-model="view"
            class="pl-1"
            @change="filterApplication(view)"
        >
            <el-radio-button label="unhandled">未处理</el-radio-button>
            <el-radio-button label="passed">已通过</el-radio-button>
            <el-radio-button label="rejected">已拒绝</el-radio-button>
        </el-radio-group>
        <el-table v-loading="loading" stripe :data="filteredApplications.slice(start,start+pageSize)" class="w-full mt-5">
            <el-table-column prop="name" label="用户名"></el-table-column>
            <el-table-column label="申请时间">
                <template #default="scope">
                    {{ new Date(scope.row.requestTime).toDateString() }}
                </template>
            </el-table-column>
            <el-table-column label="申请状态">
                <template #default="scope">
                    <el-tag v-if="scope.row.status===0" type="danger">未处理</el-tag>
                    <el-tag v-else-if="scope.row.status===1" type="success">已通过</el-tag>
                    <el-tag v-else-if="scope.row.status===2" type="warning">已拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button link v-if="scope.row.status===0" type="primary" @click="handleApplication(scope.row.userId,1)">通过</el-button>
                    <el-button link v-if="scope.row.status===0" type="danger" @click="handleApplication(scope.row.userId,2)">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="py-3 flex justify-center items-center">
            <el-pagination layout="prev, pager, next" :total="filteredApplications.length" background :page-size="pageSize" v-model:current-page="currentPage" />
        </div>
    </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import {onMounted, ref,computed} from 'vue'
import { useStore } from 'vuex';
import Application from '@/models/Application';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const pageSize = ref(6);
const currentPage = ref(1);

const start = computed(() => (currentPage.value - 1) * pageSize.value);

const store = useStore();

const view=ref('unhandled')

const loading = ref(false);

const applications = ref<Application[]>([]);
const filteredApplications = ref<Application[]>([]);

const filterApplication = (type: string) => {
    if (type === 'unhandled') {
        filteredApplications.value = applications.value.filter((application) => {
            return application.status === 0
        })
    } else if (type === 'passed') {
        filteredApplications.value = applications.value.filter((application) => {
            return application.status === 1
        })
    }else if(type==='rejected'){
        filteredApplications.value = applications.value.filter((application) => {
            return application.status === 2
        })
    }
} 


const handleApplication = (id: number, status: number) => {
    axios.patch(`/api/project/request?projectId=${store.state.currentProjectId}&judgement=${status}&userId=${id}`).then((res) => {
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: `处理申请成功`,
                type: 'success'
            })
            getApplications()
        } else {
            ElMessage({
                message: `处理申请失败,${res.data.message}`,
                type: 'error'
            })
        }
    })
}

const getApplications = ()=>{
    loading.value=true
    axios.get(`/api/project/request?projectId=${store.state.currentProjectId}`).then((res)=>{
        if(res.status===200&&res.data.code===200){
            applications.value=res.data.list
            ElMessage({
                message: `获取申请列表成功`,
                type: 'success'
            })
            loading.value=false
            filterApplication(view.value)
        }else{
            ElMessage({
                message: `获取申请列表失败,${res.data.message}`,
                type: 'error'
            })
            loading.value=false
        }
    })
}

onMounted(()=>{
    getApplications()
})
</script>