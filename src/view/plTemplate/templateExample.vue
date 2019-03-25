<template>
  <el-dialog :title="type == '1' ? '常用验证码模板' : '常用短信通知模板'" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" width="60%" append-to-body @open="dialogOpen" @closed="dialogClosed">
    <el-table :data="tplEgListData" v-loading="tabLoading" class="w100" max-height="500"
              border>
      <el-table-column prop="content" label="模板内容"></el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="useCurrTpl(scope)" style="color: #9b7fea;cursor: pointer;">使用该模板</a>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="dialogShow = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {tplLibAPI} from "@/api/api";

  export default {
    name: "templateExample",
    data() {
      return {
        dialogShow: false,
        type: '1',
        tabLoading: false,
        tplEgListData: []
      }
    },
    mounted() {

    },
    methods: {
      dialogOpen() {
        let vm = this;
        vm.tabLoading = true;
        if (vm.type == '1') {
          tplLibAPI.search({type: 1}).then(res => {//验证码
            let ccArr = [];
            for (let q = 0; q < res.length; q++) {
              ccArr.push({content: res[q]});
            }
            vm.tplEgListData = ccArr;
            vm.tabLoading = false;
          }).catch(error => {
          });
        }
        if (vm.type == '2') {
          tplLibAPI.search({type: 2}).then(res => {//短信通知
            let mnArr = [];
            for (let q = 0; q < res.length; q++) {
              mnArr.push({content: res[q]});
            }
            vm.tplEgListData = mnArr;
            vm.tabLoading = false;
          }).catch(error => {
          });
        }
      },
      useCurrTpl(scope) {
        this.$emit('valTplExample', {content: scope.row.content});
        this.dialogShow = false;
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
