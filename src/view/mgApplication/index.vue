<template>
  <div class="bs-wp">
    <el-row>
      <el-table :data="appListData" v-loading="tabLoading" class="w100" max-height="700" border>
        <el-table-column :resizable="resizable" type="expand">
          <template slot-scope="props">
            <el-form label-position="right" inline class="demo-table-expand" label-width="140px">
              <el-row v-if="props.row.licenseType == '1'">
                <el-form-item label="三证合一：">
                  <span><img class="licenceImg" :src="props.row.inOneLicenceUrl" /></span>
                </el-form-item>
                <el-form-item label="授权委托书：">
                  <span><a :href="props.row.authorizationUrl">{{props.row.authorizationUrl}}</a></span>
                </el-form-item>
              </el-row>
              <el-row v-else>
                <el-form-item label="营业执照：">
                  <span><img class="licenceImg" :src="props.row.businessLicenceUrl" /></span>
                </el-form-item>
                <el-form-item label="组织机构代码证：">
                  <span><img class="licenceImg" :src="props.row.organizationLicenceUrl" /></span>
                </el-form-item>
                <el-form-item label="税务登记证：">
                  <span><img class="licenceImg" :src="props.row.taxLicenceUrl" /></span>
                </el-form-item>
                <el-form-item label="授权委托书：">
                  <span><a :href="props.row.authorizationUrl">{{props.row.authorizationUrl}}</a></span>
                </el-form-item>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="应用名称" width="160" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatLicenseType" label="应用证件类型" width="160" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatStatus" label="状态" :resizable="resizable"></el-table-column>
        <el-table-column prop="description" label="申请说明" :resizable="resizable"></el-table-column>
        <el-table-column prop="auditingTime" label="审核时间" width="170" :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="170" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="140" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.status == 2" class="iconfont icon-editor fs-12" @click="appAudit(scope)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="mgtp-10">
      <el-pagination class="fr"
          @size-change="appPSChange"
          @current-change="appPCChange"
          :current-page.sync="appPageCur"
          :page-sizes="[10, 20, 50]"
          :page-size="appPageSize"
          layout="total, sizes, prev, pager, next"
          :total="appCount">
      </el-pagination>
    </el-row>
    <el-row class="mgtp-10">
      <application-audit ref="refApplicationAudit" @refreshList="searchAppListData"></application-audit>
    </el-row>
  </div>
</template>

<script>
  import {applicationAPI} from "@/api/api";
  import applicationAudit from "./applicationAudit";

  export default {
    name: "mgApplicationIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        appListData: [],
        appCount: 0,
        appPageCur: 1,
        appPageSize: 10
      }
    },
    components: {applicationAudit},
    watch: {
      appPageCur: 'searchAppListData',
      appPageSize: 'searchAppListData'
    },
    mounted() {
      this.searchAppListData();
    },
    methods: {
      searchAppListData() {
        let vm = this, pm = {
          pageSize: vm.appPageSize,
          pageNum: vm.appPageCur - 1
        };
        vm.tabLoading = true;
        applicationAPI.search(pm).then(res =>{
          vm.appListData = res.datas;
          vm.appCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {vm.tabLoading = false;});
      },
      appAudit(scope) {
        this.$refs.refApplicationAudit.appAuditForm.appId = scope.row.id;
        this.$refs.refApplicationAudit.dialogShow = true;
      },
      appPSChange(ps) {
        this.appPageSize = ps;
      },
      appPCChange(pc) {
        this.appPageCur = pc;
      },
      formatLicenseType(scope) {
        if(scope.licenseType == '1'){return '三证合一';}
        if(scope.licenseType == '2'){return '三证分离';}
      },
      formatStatus(scope) {
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
          return '审核未通过（原因：'+scope.refuseDesc+'）';
        }
      }
    }
  }
</script>

<style scoped>
.licenceImg{
  max-width: 500px;
}
</style>
