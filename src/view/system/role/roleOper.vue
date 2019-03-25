<template>
  <el-dialog :title="submitType == 1 ? '新增角色' : '编辑角色' " :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="800px" @closed="dialogClosed">
    <el-form :model="roleOperForm" label-width="120px">
      <table class="bs-table">
        <tbody>
        <tr>
          <td>*角色编码</td>
          <td>
            <el-input v-model="roleOperForm.code"></el-input>
          </td>
        </tr>
        <tr>
          <td>*角色名称</td>
          <td>
            <el-input v-model="roleOperForm.name" maxlength="60"></el-input>
          </td>
        </tr>
        <tr>
          <td>角色描述</td>
          <td>
            <el-input type="textarea" v-model="roleOperForm.description" rows="5" maxlength="300"></el-input>
          </td>
        </tr>
        </tbody>
      </table>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="btnSubLoading" @click="subRoleOperForm">保 存</el-button>
      <el-button type="danger" @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {regUtils} from "@/utils/utils";
  import {roleAPI} from "../../../api/api";

  export default {
    name: "roleOper",
    data() {
      return {
        submitType: 1,
        dialogShow: false,
        btnSubLoading: false,
        roleOperForm: {
          id: '',
          code: '',
          name: '',
          description: ''
        }
      }
    },
    methods: {
      validateForm() {
        let res = 1;
        if (this.roleOperForm.code == '' || !regUtils.numLetter(this.roleOperForm.code)) {
          res = '请输入字母数字构成的角色编码';
        } else if (this.roleOperForm.name == '') {
          res = '请输入角色名称';
        } else {
          res = 1;
        }
        return res;
      },
      subRoleOperForm() {
        let vm = this, flag = vm.validateForm();
        if (flag === 1) {

          vm.btnSubLoading = true;
          if(vm.submitType == 1){//新增
            roleAPI.add(vm.roleOperForm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '新增成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refresh', {});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
          if(vm.submitType == 2){//编辑

          }
        } else {
          vm.$message({message: flag, type: 'warning'});
        }
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
