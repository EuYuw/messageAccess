<template>
  <div class="bs-wp">
    <el-row>
      <el-table :data="appListData" v-loading="tabLoading" max-height="580" border>
        <el-table-column prop="name" label="应用名称" width="260" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatLicenseType" label="应用证件类型" width="160"
                         :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatStatus" label="状态" :resizable="resizable"></el-table-column>
        <el-table-column prop="description" label="申请说明" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="340" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.status == 1" class="iconfont icon-zhexiantu fs-12"
                       @click="last30SmCount(scope)">短信发送折线统计
            </el-button>
            <el-button type="primary" size="mini" v-if="scope.row.status == 1" class="iconfont icon-browse fs-12"
                       @click="SendMsgDetail(scope)">短信发送详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--page row-->
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
    <!--last sm count row-->
    <el-row class="mgtp-10">
      <last30-sm-count ref="refLastSmCount"></last30-sm-count>
    </el-row>
    <!--msg send detail row-->
    <el-row class="mgtp-10">
      <msg-send-detail ref="refMsgSendDetail"></msg-send-detail>
    </el-row>
  </div>
</template>

<script>
  import {applicationAPI} from "@/api/api";
  import last30SmCount from "./last30SmCount";
  import msgSendDetail from "./msgSendDetail";

  export default {
    name: "mgCountIndex",
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
    components: {last30SmCount, msgSendDetail},
    watch: {
      appPageCur: 'searchAppList',
      appPageSize: 'searchAppList'
    },
    mounted() {
      this.searchAppList();
    },
    methods: {
      searchAppList() {
        let vm = this, pm = {
          pageSize: vm.appPageSize,
          pageNum: vm.appPageCur - 1
        };
        vm.tabLoading = true;
        applicationAPI.search(pm).then(res => {
          vm.appListData = res.datas;
          vm.appCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {
        });
      },
      last30SmCount(scope) {
        this.$refs.refLastSmCount.appId = scope.row.id;
        this.$refs.refLastSmCount.dialogShow = true;
      },
      SendMsgDetail(scope) {
        this.$refs.refMsgSendDetail.appId = scope.row.id;
        this.$refs.refMsgSendDetail.dialogShow = true;
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
          return '审核未通过（原因：'+scope.refuseDesc+'，时间：'+ scope.auditingTime +'）';
        }
      },
      appPSChange(ps) {
        this.appPageSize = ps;
      },
      appPCChange(pc) {
        this.appPageCur = pc;
      },
    }
  }
</script>

<style scoped>

</style>
