<template>
<div id="container" style="margin:auto; width: 100%; height: 100%;">
  <div id="header" style="text-align: center;">
  <h1 style="margin-bottom:0;">个人信息页面</h1>
  </div>
      <!-- User Avatar Section -->
    <div id="avatar" style="text-align: center; padding: 20px;">
      <!-- Display user's avatar/image here -->
      <img src="/default_avatar.png" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%;" />
    </div>
    <!-- Profile Information Section -->
  <div id="personalInfor" style="width: 60%; float: left; height: 100%; box-sizing: border-box;">
    <!-- Name -->
    <el-form :model="profile" label-width="80px" style="margin-bottom: 20px;">
      <el-form-item label="Name">
        <el-input v-model="profile.name" :disabled="!editMode"></el-input>
      </el-form-item>

      <!-- Account -->
      <el-form-item label="Account">
        <el-input v-model="profile.account" :disabled="!editMode"></el-input>
      </el-form-item>

        <!-- Password -->
      <el-form-item label="Password">
        <el-input v-model="profile.password" :type="showPassword ? 'text' : 'password'" :disabled="!editMode">
          <template slot="append">
            <el-button @click="showPassword = !showPassword" icon="el-icon-view"></el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>

  <div id="content" style="width:40%; float:left; height: 100%; box-sizing: border-box;">
    内容在这里
  </div>

  <div id="footer" style="clear:both; text-align:center;">
    版权 © Tongji software 2023
  </div>
</div>


</template>

<script>
export default {
  data() {
    return {
      profile: {
        name: 'John Doe',
        account: 'john@example.com',
        password: '********', // Initial password
      },
      editMode: false,
      showPassword: false,
    };
  },
};
</script>


<style scoped>

</style>
