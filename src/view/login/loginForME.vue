<template>
  <el-container class="h100 login-bg">
    <el-main>
      <div class="login-center-wrap">
        <div class="title-wrap"><img src="../../assets/login/title_mg.png" /></div>
        <div class="left-wrap"></div>
        <div class="right-wrap">
          <el-form class="loginForm mg" :model="loginForm" ref="loginForm" label-width="0">
            <div class="lgForm-title">
              <label>用户登录</label>
            </div>
            <el-form-item class="lgpt-par-wp" style="margin-bottom: 36px">
              <el-input v-model="loginForm.username" type="text" maxlength="32" autocomplete="off" placeholder="请输入用户名"><i slot="prefix" class="iconfont icon-people ml5"></i></el-input>
            </el-form-item>
            <el-form-item class="lgpt-par-wp" style="margin-bottom: 36px">
              <el-input v-model="loginForm.password" type="password" maxlength="18" autocomplete="off" @keyup.native.enter="submitForm" placeholder="请输入密码"><i slot="prefix" class="iconfont icon-lock ml5"></i></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="lg-btn" type="primary" :loading="btnLoginLoading" @click="submitForm">登  录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import {userAPI} from "@/api/api";

  export default {
    name: 'login',
    data() {
      return {
        btnLoginLoading: false,
        loginForm: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      validateSubForm() {
        let res = 1;
        if(this.loginForm.username == ''){
          res = '请输入用户名';
        }else if(this.loginForm.password == ''){
          res = '请输入密码';
        }else{
          res = 1;
        }
        return res;
      },
      submitForm() {
        let vm = this, result = vm.validateSubForm();
        if (result === 1) {
          let pm = vm.loginForm;
          pm.type = vm.$constant.manage;//管理type为1
          vm.btnLoginLoading = true;
          setTimeout(() => {vm.btnLoginLoading = false;}, 1500);
          userAPI.login(pm).then(res => {
            if (res) {
              sessionStorage.removeItem('routerAuth');//router历史表
              vm.$store.commit("user/saveLogin", res);
              vm.$router.push({path: '/home'});
            }
          }).catch(error =>{
            vm.$message({message: '用户名或密码错误', type: 'error'});
          });
        } else {
          vm.$message({message: result, type: 'warning'});
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .login-center-wrap{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -600px;
    width: 1200px;
    height: 500px;
    border-radius: 10px;
    box-shadow: 4px 2px 6px 6px #d7e5fa;
    .title-wrap{
      position: absolute;
      top: -120px;
      width: 100%;
      text-align: center;
    }
    .left-wrap{
      float: left;
      width: 620px;
      height: 100%;
      background: url("../../assets/login/bg_02.jpg") no-repeat center center;
      background-size: 100% 100%;
      border-top-left-radius: 9px;
      border-bottom-left-radius: 9px;
    }
    .right-wrap{
      float: left;
      padding: 90px 70px 0 75px;
      width: 580px;
      height: 100%;
      background-color: #fff;
      border-top-right-radius: 9px;
      border-bottom-right-radius: 9px;
      .loginForm{
        width: 100%;
        .lgForm-title{
          margin-bottom: 50px;
          line-height: 1.0;
          text-align: center;
          letter-spacing: 4px;
          color: #999;
          font-size: 29px;
          font-weight: 500;
        }
        .lg-btn{
          width: 100%;
          height: 60px;
          font-size: 18px;
          background: -webkit-linear-gradient(left, #6fb2ff , #095fff);
          background: -o-linear-gradient(left, #6fb2ff , #095fff);
          background: -moz-linear-gradient(left, #6fb2ff , #095fff);
          background: linear-gradient(to right, #6fb2ff , #095fff);
          &:hover{
            background: -webkit-linear-gradient(left, #2f79fc , #095fff);
            background: -o-linear-gradient(left, #2f79fc , #095fff);
            background: -moz-linear-gradient(left, #2f79fc , #095fff);
            background: linear-gradient(to right, #2f79fc , #095fff);
          }
        }
      }
    }
  }
  .ml5{
    margin-left: 5px;
  }
  .login-bg{
    background: url("../../assets/login/bg_01.jpg") no-repeat center center;
    background-size: 100% 100%;
  }
</style>
