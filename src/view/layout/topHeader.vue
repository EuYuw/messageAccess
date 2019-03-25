<template>
  <div class="bs-wp">
    <!-- portal header -->
    <el-row class="portal-header" v-if="headerType == $constant.portal">
      <el-row>
        <span class="pointer" @click="toHome"><img src="../../assets/main/title_pl.png" alt="短信接入平台" title="短信接入平台" /></span>
        <el-dropdown class="fr" @command="handleCommand" :show-timeout="150" :hide-timeout="250">
            <span class="el-dropdown-link">
              {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="resetPasswrod">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-row>
    <!--reset password dialog-->
    <el-row  v-if="headerType == $constant.portal">
      <resetPassword ref="resetPsdDialog"></resetPassword>
    </el-row>
    <!-- manager header -->
    <el-row class="manager-header" v-if="headerType == $constant.manage">
      <span class="pointer" @click="toHome"><img src="../../assets/main/title_mg.png" alt="短信接入平台管理端" title="短信接入平台管理端" /></span>
      <el-dropdown class="fr" @command="handleCommand" :show-timeout="150" :hide-timeout="250">
          <span class="el-dropdown-link">
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <!--<el-dropdown-item command="personMsg">个人信息</el-dropdown-item>-->
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
  </div>
</template>

<script>
  import resetPassword from "./resetPassword";

  export default {
    name: "topHeader",
    data() {
      return {
        userName: '',
        headerType: '2'
      }
    },
    components: {resetPassword},
    beforeMount() {
      this.headerType = this.$store.getters.userType;
    },
    mounted() {
        this.userName = JSON.parse(this.$store.getters.userCurrent).userName;
    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          this.logout();
        }
        if (command === 'resetPasswrod') {
          this.resetPsd();
        }
      },
      logout() {//退出
        this.$store.dispatch('user/logout').then(() => {
          location.reload();
        });
      },
      resetPsd() {//重置密码
        this.$refs['resetPsdDialog'].resetPsdDialogShow = true;
      },
      toHome() {
        this.$router.push({path: '/home'});
        this.$emit('foldLeftNav', {});
      }
    }
  }
</script>

<style scoped>
  .el-dropdown-link {
    color: #fff;
    cursor: pointer;
    font-size: 15px;
  }
  .portal-header,
  .manager-header{
    line-height: 68px;
  }
</style>
