
<template>
  <div class="flex h-full w-full">
    <div class="h-full w-1/6">
      <el-menu 
        class="manage-sidebar"
        default-active="/manage/member"
        router
      >
        <el-sub-menu>
          <template #title>
            <span>项目成员管理</span>
          </template>
          <el-menu-item index="/manage/member">
            <template #title>
              <span>成员管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/manage/application">
            <template #title>
              <span>申请管理</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/manage/task">
            <template #title>
                <span>项目任务管理</span>
            </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="w-4/5">
      <RouterView/>
    </div>
  </div>
  

</template>

<style scoped>
.manage-sidebar{
  border: 2px;
  border-color: azure;
}
</style>