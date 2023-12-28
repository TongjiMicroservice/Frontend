<script setup lang="ts">
import { useStore } from 'vuex';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const store=useStore()
const router=useRouter()

const createProjectVisible=ref(false)
const searchProjectVisible=ref(false)

const createProjectForm=reactive({
    name:'',
    description:'',
    scale:0,
})

watch(()=>searchProjectVisible.value,(v)=>{
    console.log(v)
})


const createProject=(name:string,description:string,scale:number)=>{
    createProjectVisible.value=false

    let createProjectForm={
        name:name,
        description:description,
        scale:scale,
        leader:store.state.currentUser.id,
        id:0
    }

    axios({
        method:'post',
        url:'/api/project/create',
        params:createProjectForm
    }).then((res)=>{
        if(res.status===200&&res.data.code===200){
            ElMessage({
                message: '创建项目成功,项目id'+res.data.projectId.toString()+'，即将为你自动刷新页面',
                type: 'success'
            })
            window.localStorage.setItem(`${store.state.currentUser.id}_currentProject`,res.data.projectId.toString())
            window.location.reload()
        }else{
            ElMessage({
                message: `创建项目失败,${res.data.message}`,
                type: 'error'
            })
        }
    })
}
</script>

<template>
    <div class="h-full">
        <div class="font-bold text-3xl mt-5 ml-3">TeamSphere</div>
        <div class="flex flex-col justify-center items-center" style="height: 70%;">
            <div class="font-bold text-center text-3xl mb-5">您还没有项目,请选择创建项目或加入项目</div>
            <div class="flex justify-center items-center">
                <el-button @click="createProjectVisible=true" class="mx-2">创建项目</el-button>
                <el-dialog v-model="createProjectVisible">
                    <el-form :model="createProjectForm" title="创建项目">
                        <el-form-item label="项目名称">
                            <el-input v-model="createProjectForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="项目描述">
                            <el-input v-model="createProjectForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="项目规模">
                            <el-input v-model="createProjectForm.scale"></el-input>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button type="primary" @click="createProject(createProjectForm.name,createProjectForm.description,createProjectForm.scale)">
                            确定
                        </el-button>
                    </template>
                </el-dialog>
                <el-button @click="router.push('search_project')">加入项目</el-button>
            </div>
        </div>
    </div>
    
</template>

<style scoped>
</style>