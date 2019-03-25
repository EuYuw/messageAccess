<template>
  <!-- 添加管理端target-mg或门户端标识target-pl，用于控制样式或其他 -->
  <el-container class="h100" :class="$store.getters.userType == $constant.portal ? 'system-pl' : 'system-mg'">
    <el-header class="headerbg" style="height: 68px">
      <topHeader @foldLeftNav="foldLeftNav"></topHeader>
    </el-header>
    <el-container class="el-con">
      <el-aside width="auto">
        <leftNav ref="leftNavCom"></leftNav>
      </el-aside>
      <el-main class="con-main-bg">
        <!--<transition name="el-fade-in">-->
        <router-view></router-view>
        <!--</transition>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import leftNav from "./leftNav";
  import topHeader from "./topHeader";

  export default {
    name: "layout",
    components: {topHeader, leftNav},
    methods: {
      foldLeftNav() {
        let obj = this.$refs['leftNavCom'].$refs['navMenu'];
        obj.updateActiveIndex(0);//取消active
        obj.closeMenu(obj.openedMenus[0]);//折叠nav
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-con {
    height: calc(100% - 68px);
  }

  .con-main-bg {
    background-color: #E9EEF3;
  }
</style>
