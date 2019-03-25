<template>
  <el-dialog title="应用审核" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="700px" @closed="dialogClosed">
    <el-form :model="appAuditForm" label-width="120px">
      <el-form-item label="审核状态">
        <el-radio-group v-model="appAuditForm.status">
          <el-radio label="1">审核通过</el-radio>
          <el-radio label="3">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="不通过原因" v-show="appAuditForm.status == '3'">
        <el-input type="textarea" v-model="appAuditForm.refuseDesc" rows="5" maxlength="100"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="btnSubLoading" @click="subAppAuditForm">审 核</el-button>
      <el-button @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {applicationAPI} from "@/api/api";

  export default {
    name: "applicationAudit",
    data() {
      return {
        dialogShow: false,
        btnSubLoading: false,
        appAuditForm: {
          appId: '',
          status: '1',
          refuseDesc: ''
        }
      }
    },
    methods: {
      validateAppAuditForm() {
        let res = 1;
        if (this.appAuditForm.status == '3' && this.appAuditForm.refuseDesc == '') {
          res = '请输入不通过原因';
        } else {
          res = 1;
        }
        return res;
      },
      subAppAuditForm() {
        let vm = this, flag = vm.validateAppAuditForm();
        if (flag === 1) {
          vm.btnSubLoading = true;
          let pm = vm.appAuditForm;
          if (pm.status == '1') {
            pm.refuseDesc = '';
          }
          applicationAPI.audit(pm).then(res => {
            vm.btnSubLoading = false;
            if (res.msg == 'ok') {
              vm.$message({message: '审核成功', type: 'success'});
              vm.dialogShow = false;
              vm.$emit('refreshList', {});
            } else {
              vm.$message({message: res.msg, type: 'error'});
            }
          }).catch(error => {
            vm.btnSubLoading = false;
          });
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
