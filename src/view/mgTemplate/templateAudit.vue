<template>
  <el-dialog title="模板审核" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="700px" @closed="dialogClosed">
    <el-form :model="temAuditForm" label-width="120px">
      <el-form-item label="审核状态">
        <el-radio-group v-model="temAuditForm.status">
          <el-radio label="1">审核通过</el-radio>
          <el-radio label="3">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="模板CODE" v-show="temAuditForm.status == '1'">
        <el-input v-model="temAuditForm.aliCode" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="不通过原因" v-show="temAuditForm.status == '3'">
        <el-input type="textarea" v-model="temAuditForm.refuseDesc" rows="5" maxlength="100"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="btnSubLoading" @click="subTplAuditForm">审 核</el-button>
      <el-button @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {templateAPI} from "@/api/api";

  export default {
    name: "templateAudit",
    data() {
      return {
        btnSubLoading: false,
        dialogShow: false,
        temAuditForm: {
          status: '1',
          aliCode: '',
          refuseDesc: '',
          templeteId: ''
        }
      }
    },
    methods: {
      validateTplAuditForm() {
        let res = 1;
        if(this.temAuditForm.status == '1' && this.temAuditForm.aliCode == ''){
          res = '请输入模板CODE';
        }else if(this.temAuditForm.status == '3' && this.temAuditForm.refuseDesc == ''){
          res = '请输入不通过原因';
      }else{
          res = 1;
        }
        return res;
      },
      subTplAuditForm() {
        let vm = this, flag = vm.validateTplAuditForm();
        if(flag === 1){
          vm.btnSubLoading = true;
          templateAPI.audit(vm.temAuditForm).then(res => {
            vm.btnSubLoading = false;
            if(res.msg == 'ok'){
              vm.$message({message: '审核成功', type: 'success'});
              vm.dialogShow = false;
              vm.$emit('refreshList', {});
            }else{
              vm.$message({message: res.msg, type: 'error'});
            }
          }).catch(error => { vm.btnSubLoading = false;});
        }else{
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
