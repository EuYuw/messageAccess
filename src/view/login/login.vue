<template>
  <el-container class="h100 login-bg">
    <el-main>
      <div class="login-center-wrap">
        <div class="title-wrap"><img src="../../assets/login/title_pl.png"></div>
        <div class="left-wrap"></div>
        <div class="right-wrap">
          <el-form class="loginForm pl" :model="loginForm" label-width="100px" label-position="right">
            <div class="lgfm-title-wrap">
              <div class="bar"></div>
              <label>用户登录</label>
            </div>
            <div class="lg-row-wrap">
              <div class="lf-bar">
                <i class="iconfont icon-people"></i>
                <label>用户名</label>
              </div>
              <div class="rt-bar"><el-input v-model="loginForm.username" maxlength="32" placeholder="请输入用户名"></el-input></div>
            </div>
            <div class="lg-row-wrap">
              <div class="lf-bar">
                <i class="iconfont icon-lock"></i>
                <label>密码</label>
              </div>
              <div class="rt-bar"><el-input v-model="loginForm.password" type="password" maxlength="18" @keyup.native.enter="submitLoginForm" placeholder="请输入密码"></el-input></div>
            </div>
            <div class="lg-row-wrap" style="border: none">
              <el-button class="lg-btn" type="primary" :loading="btnSubLoading" @click="submitLoginForm">登  录</el-button>
              <!--<a href="javascript:void(0)" @click.prevent="lor = 2">注册</a><a href="javascript:void(0)">忘记密码?</a>-->
            </div>
          </el-form>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import {userAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: 'login',
    data() {
      return {
        btnSubLoading: false,
        loginForm: {
          username: '',
          password: '',
        }
      };
    },
    methods: {
      validateLoginForm() {//验证登录表单
        let res = 1;
        if (this.loginForm.username == '') {
          res = '请输入用户名';
        } else if (this.loginForm.password == '') {
          res = '请输入密码';
        } else {
          res = 1;
        }
        return res;
      },
      submitLoginForm() {//登录
        let vm = this, result = vm.validateLoginForm();
        if (result === 1) {
          let pm = vm.loginForm;
          pm.type = vm.$constant.portal;//门户type为2
          vm.btnSubLoading = true;
          setTimeout(() => {
            vm.btnSubLoading = false;
          }, 1500);
          userAPI.login(pm).then(res => {
            if (res) {
              sessionStorage.removeItem('routerAuth');//router历史表
              vm.$store.commit("user/saveLogin", res);
              vm.$router.push({path: '/home'});
            }
          }).catch(error => {
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
  .login-center-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -600px;
    width: 1200px;
    height: 500px;
    border-radius: 10px;
    .title-wrap {
      position: absolute;
      top: -90px;
      width: 100%;
      text-align: center;
    }
    .left-wrap {
      float: left;
      width: 670px;
      height: 100%;
      background: url("../../assets/login/bg_04.jpg") no-repeat center center;
      background-size: 100% 100%;
    }
    .right-wrap {
      float: left;
      padding: 110px 52px 0 52px;
      width: 530px;
      height: 100%;
      background-color: #fff;
      .loginForm {
        width: 100%;
        .lgfm-title-wrap {
          margin-bottom: 30px;
          width: 100%;
          height: 30px;
          line-height: 30px;
          > .bar {
            float: left;
            width: 12px;
            height: 100%;
            background-color: #4cafff;
          }
          > label {
            margin-left: 16px;
            color: #5a617d;
            font-size: 19px;
            font-weight: 600;
          }
        }
        .lg-row-wrap{
          margin-bottom: 30px;
          border: 1px solid #d3d5dc;
          > .lf-bar{
            float: left;
            padding-left: 11px;
            width: 100px;
            height: 50px;
            line-height: 50px;
            color: #a1a3a8;
            font-size: 14px;
            border-right: 1px solid #d3d5dc;
            > i{
              vertical-align: 0;
            }
          }
          > .rt-bar{
            margin-left: 100px;
            height: 50px;
            line-height: 50px;
          }
        }
        .lg-btn {
          width: 100%;
          background-color: #31a4ff;
          &:hover{
            background-color: #2c7bff;
          }
        }
      }
    }
  }

  .ml5 {
    margin-left: 5px;
  }

  .login-bg {
    background: url("../../assets/login/bg_03.jpg") no-repeat center center;
    background-size: 100% 100%;
  }
</style>
