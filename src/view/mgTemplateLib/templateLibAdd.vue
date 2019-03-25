<template>
  <el-dialog title="新增常用模板" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="800px" @closed="dialogClosed">
    <el-form :model="tplLibOperForm" label-width="120px">
      <table class="bs-table">
        <tbody>
        <tr>
          <td>*模板类型</td>
          <td>
            <el-radio-group v-model="tplLibOperForm.type">
              <el-radio label="1">验证码</el-radio>
              <el-radio label="2">短信通知</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td>*模板内容</td>
          <td>
            <el-input type="textarea" v-model="tplLibOperForm.content" rows="5" maxlength="320"></el-input>
          </td>
        </tr>
        </tbody>
      </table>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="btnSubLoading" @click="subTplLibAddForm">保 存</el-button>
      <el-button type="danger" @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {tplLibAPI} from "@/api/api";

  export default {
    name: "templateLibAdd",
    data() {
      return {
        dialogShow: false,
        btnSubLoading: false,
        tplLibOperForm: {
          type: '1',
          content: ''
        }
      }
    },
    methods: {
      subTplLibAddForm() {
        let vm = this;
        if (vm.tplLibOperForm.content == '') {
          vm.$message({message: '请输入模板内容', type: 'warning'});
        } else {
          vm.btnSubLoading = true;
          tplLibAPI.add(vm.tplLibOperForm).then(res => {
            vm.btnSubLoading = false;
            if (res.msg == 'ok') {
              vm.$message({message: '新增成功', type: 'success'});
              vm.dialogShow = false;
              vm.$emit('refreshList', {});
            } else {
              vm.$message({message: res.msg, type: 'error'});
            }
          }).catch(error => {
            vm.btnSubLoading = false;
          });
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
