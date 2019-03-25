<template>
  <div class="bs-wp">
    <!-- oper row -->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addTemplate">新增模板</el-button>
    </el-row>
    <!-- list table row -->
    <el-row class="mgtp-10">
      <el-table :data="tplListData" v-loading="tabLoading" max-height="580" border>
		<el-table-column prop="id" label="模板id" width="100" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatTplType" label="模板类型" width="160" :resizable="resizable"></el-table-column>
        <el-table-column prop="name" label="模板名称" width="260" :resizable="resizable"></el-table-column>
        <el-table-column prop="content" label="模板内容"  :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatTplStatus" label="状态"  :resizable="resizable"></el-table-column>
        <el-table-column prop="description" label="申请说明"  :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="140" :resizable="resizable">
          <template slot-scope="scope">
              <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="tplDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- page row -->
    <el-row class="mgtp-10">
      <el-pagination class="fr" prev-text="上一页" next-text="下一页"
                     @size-change="tplPSChange"
                     @current-change="tplPCChange"
                     :current-page.sync="tplPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="tplPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="tplCount">
      </el-pagination>
    </el-row>
    <!-- template oper -->
    <el-row>
      <template-oper ref="refTemplateOper" @refreshList="searchTplList"></template-oper>
    </el-row>
  </div>
</template>

<script>
  import {templateAPI} from "@/api/api";
  import templateOper from "./templateOper";

  export default {
    name: "plTemplateIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        tplPageCur: 1,
        tplPageSize: 10,
        tplCount: 0,
        tplListData: []
      }
    },
    components: {templateOper},
    watch: {
      tplPageCur: 'searchTplList',
      tplPageSize: 'searchTplList'
    },
    mounted() {
      this.searchTplList();
    },
    methods: {
      searchTplList() {
        let vm = this, pm = {
          pageSize: vm.tplPageSize,
          pageNum: vm.tplPageCur - 1
        };
        vm.tabLoading = true;
        templateAPI.searchCurrentUser(pm).then(res => {
          vm.tplListData = res.datas;
          vm.tplCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      addTemplate() {
        this.$refs.refTemplateOper.dialogShow = true;
      },
      tplDelete(scope) {
        let vm = this, pm = {id: scope.row.id};
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              templateAPI.del(pm).then(res => {
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
          vm.searchTplList();
        }).catch(() => {//取消
        });
      },
      tplPSChange(ps) {
        this.tplPageSize = ps;
      },
      tplPCChange(pc) {
        this.tplPageCur = pc;
      },
      formatTplType(scope) {
        if(scope.type == '1'){return '验证码';}
        if(scope.type == '2'){return '短信通知';}
      },
      formatTplStatus(scope) {
        if(scope.status == '0'){
          return '已删除';
        }
        if(scope.status == '1'){
          return '审核通过';
        }
        if(scope.status == '2'){
          return '审核中';
        }
        if(scope.status == '3'){
          return '审核未通过（原因：'+scope.refuseDesc+'，时间：'+ scope.auditingTime +'）';
        }
      }
    }
  }
</script>

<style scoped>

</style>
