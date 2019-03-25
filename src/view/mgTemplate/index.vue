<template>
  <div class="bs-wp">
    <!-- list table row -->
    <el-row>
      <el-table :data="tplListData" v-loading="tabLoading" class="w100" max-height="800" border>
        <el-table-column :formatter="formatTplType" label="模板类型" width="130" :resizable="resizable"></el-table-column>
        <el-table-column prop="name" label="模板名称" width="220" :resizable="resizable"></el-table-column>
        <el-table-column prop="content" label="模板内容" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatTplStatus" label="状态" :resizable="resizable"></el-table-column>
        <el-table-column prop="description" label="申请说明" :resizable="resizable"></el-table-column>
        <el-table-column prop="auditingTime" label="审核时间" width="170" :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="170" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="140" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.status == 2" class="iconfont icon-editor fs-12" @click="tplAudit(scope)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- page row -->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="tplPSChange"
                     @current-change="tplPCChange"
                     :current-page.sync="tplPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="tplPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="tplCount">
      </el-pagination>
    </el-row>
    <!-- template audit -->
    <el-row>
      <template-audit ref="refTemplateAudit" @refreshList="searchTplList"></template-audit>
    </el-row>
  </div>
</template>

<script>
  import templateAudit from "./templateAudit";
  import {templateAPI} from "@/api/api";

  export default {
    name: "mgTemplateIndex",
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
    components: {templateAudit},
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
        }
        vm.tabLoading = true;
        templateAPI.search(pm).then(res => {
          vm.tplListData = res.datas;
          vm.tplCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      tplAudit(scope) {
        this.$refs.refTemplateAudit.temAuditForm.templeteId = scope.row.id;
        this.$refs.refTemplateAudit.dialogShow = true;
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
          return '待审核';
        }
        if(scope.status == '3'){
          return '审核未通过（原因：'+scope.refuseDesc + '）';
        }
      },
      tplPSChange(ps) {
        this.tplPageSize = ps;
      },
      tplPCChange(pc) {
        this.tplPageCur = pc;
      }
    }
  }
</script>

<style scoped>

</style>
