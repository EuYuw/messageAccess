<template>
  <div class="bs-wp">
    <!--oper row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addUsefulTpl">新增常用模板</el-button>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table :data="tplLibListData" v-loading="tabLoading" class="w100" max-height="580" border>
        <el-table-column :formatter="formatTplLibType" label="模板类型" width="160"></el-table-column>
        <el-table-column prop="content" label="模板内容"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="tplLibDelete(scope)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--page row-->
    <el-row  class="mgtp-10">
      <el-pagination class="fr" prev-text="上一页" next-text="下一页"
                     @size-change="tplLibPSChange"
                     @current-change="tplLibPCChange"
                     :current-page.sync="tplLibPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="tplLibPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="tplLibCount">
      </el-pagination>
    </el-row>
    <!--template lib add-->
    <el-row  class="mgtp-10">
      <template-lib-add ref="refTplLibAdd" @refreshList="searchTplLibList"></template-lib-add>
    </el-row>
  </div>
</template>

<script>
  import {tplLibAPI} from "@/api/api";
  import templateLibAdd from "./templateLibAdd";

  export default {
    name: "mgTplLibIndex",
    data() {
      return {
        tabLoading: false,
        tplLibListData: [],
        tplLibCount: 0,
        tplLibPageCur: 1,
        tplLibPageSize: 10
      }
    },
    components: {templateLibAdd},
    watch: {
      'tplLibPageCur': 'searchTplLibList',
      'tplLibPageSize': 'searchTplLibList'
    },
    mounted() {
      this.searchTplLibList();
    },
    methods: {
      searchTplLibList() {
        let vm = this, pm = {
          pageSize: vm.tplLibPageSize,
          pageNum: vm.tplLibPageCur - 1
        };
        vm.tabLoading = true;
        tplLibAPI.mgSearch(pm).then(res => {
          vm.tabLoading = false;
          vm.tplLibListData = res.datas;
          vm.tplLibCount = res.totalNum;
        }).catch(error => {
          vm.tabLoading = false;
        });
      },
      addUsefulTpl() {
        this.$refs.refTplLibAdd.dialogShow = true;
      },
      tplLibDelete(scope) {
        let vm = this, pm = {id: scope.row.id};
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              tplLibAPI.del(pm).then(res => {
                if (res.msg == 'ok') {
                  instance.$message({message: '删除成功', type: 'success'});
                  done();
                } else {
                  instance.$message({message: res.msg, type: 'error'});
                }
              }).catch(() => {
                instance.confirmButtonLoading = false;
              });
            } else {
              done();
            }
          }
        }).then(() => {//确定
          vm.searchTplLibList();
        }).catch(() => {//取消
        });
      },
      formatTplLibType(scope) {
        if (scope.type == '1') {
          return '验证码';
        }
        if (scope.type == '2') {
          return '短信通知';
        }
      },
      tplLibPSChange(ps) {
        this.tplLibPageSize = ps;
      },
      tplLibPCChange(pc) {
        this.tplLibPageCur = pc;
      }
    }
  }
</script>

<style scoped>

</style>
