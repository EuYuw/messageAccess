<template>
  <el-dialog :title="submitType == 1 ? '新增用户' : '编辑用户'" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="800px" @closed="dialogClosed">
    <el-form :model="userAEForm" label-width="120px">
      <table class="bs-table">
        <tbody>
        <tr>
          <td>*用户名</td>
          <td>
            <el-input v-model="userAEForm.userName" maxlength="32" :readonly="this.submitType == 2"></el-input>
          </td>
        </tr>
        <tr v-if="this.submitType == 1">
          <td>*密码</td>
          <td>
            <el-input type="password" v-model="userAEForm.password" autocomplete="off" maxlength="18"></el-input>
          </td>
        </tr>
        <tr>
          <td>*手机号</td>
          <td>
            <el-input v-model="userAEForm.tel" @keyup.native="formatTel" @blur="formatTel" maxlength="11"></el-input>
          </td>
        </tr>
        <tr>
          <td>*邮箱</td>
          <td>
            <el-input v-model="userAEForm.email" maxlength="32"></el-input>
          </td>
        </tr>
        <tr>
          <td>类型</td>
          <td>
            <el-select v-model="userAEForm.type" class="w100">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </td>
        </tr>
        </tbody>
      </table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnSubLoading" @click="subUserAEForm">保 存</el-button>
      <el-button type="danger" @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {userAPI} from "@/api/api";
  import {constant} from "@/common/constant";
  import {formatUtils, regUtils} from "@/utils/utils";

  export default {
    name: "userAddEdit",
    data() {
      return {
        submitType: 1,
        dialogShow: false,
        btnSubLoading: false,
        userAEForm: {
          userName: '',
          password: '',
          tel: '',
          email: '',
          type: constant.portal,
          id: ''
        },
        typeOptions: [
          {label: '普通用户', value: constant.portal},
          {label: '管理用户', value: constant.manage}
        ]
      }
    },
    methods: {
      validateSubForm() {
        let res = 1;
        if (this.userAEForm.userName == '') {
          res = '请输入用户名';
        } else if (this.submitType == 1 && (this.userAEForm.password.length < 6 || this.userAEForm.password.length > 18)) {
          res = '请输入6-18位密码';
        } else if (this.userAEForm.tel.length != 11) {
          res = '请输入11位手机号码';
        } else if (this.userAEForm.email == '' || !regUtils.email(this.userAEForm.email)) {
          res = '请输入正确格式的邮箱';
        } else {
          res = 1;
        }
        return res;
      },
      subUserAEForm() {
        let vm = this, result = vm.validateSubForm();
        if (result === 1) {
          let pm = vm.userAEForm;
          //user add
          if (vm.submitType === 1) {
            delete pm['id'];
            vm.btnSubLoading = true;
            userAPI.add(pm).then(res => {
              vm.btnSubLoading = false;
              if (res.msg == 'ok') {
                vm.$message({message: '新增成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshList', {});
              } else {
                vm.$message({message: res.msg, type: 'warning'});
              }
            }).catch(error => {
              vm.btnSubLoading = false;
            });
          }
          //user edit
          if (vm.submitType === 2) {
            delete pm['password'];
            vm.btnSubLoading = true;
            userAPI.update(pm).then(res => {
              vm.btnSubLoading = false;
              if (res.msg == 'ok') {
                vm.$message({message: '编辑成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshList', {});
              } else {
                vm.$message({message: res.msg, type: 'warning'});
              }
            }).catch(error => {
              vm.btnSubLoading = false;
            });
          }
        } else {
          vm.$message({message: result, type: 'warning'});
        }
      },
      formatTel() {
        this.userAEForm.tel = formatUtils.num(this.userAEForm.tel);
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
