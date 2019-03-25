<template>
  <div class="bs-wp">
    <el-row>
      <div class="title-line-wrap">
        <div class="bar"></div>
        <label>近30日发送短信应用列表</label>
      </div>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table :data="appCountListData" v-loading="tabLoading" max-height="700" border>
        <!--<el-table-column :resizable="resizable" type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.sendCountList" size="small" max-height="500" show-summary>
              <el-table-column prop="sendDate" label="日期"></el-table-column>
              <el-table-column prop="sendCount" label="总计发送(条)"></el-table-column>
              <el-table-column prop="successCount" label="成功条数(条)"></el-table-column>
              <el-table-column prop="failCount" label="失败条数(条)"></el-table-column>
            </el-table>
          </template>
        </el-table-column>-->
        <el-table-column prop="appName" label="应用名称" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" align="center" width="340" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="iconfont icon-zhexiantu fs-12"
                       @click="appSendMsgLineChart(scope)">短信发送折线统计
            </el-button>
            <el-button type="primary" size="mini" class="iconfont icon-browse fs-12" @click="appSendMsgDetail(scope)">短信发送详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--line chart count-->
    <el-row class="mgtp-10">
      <count-line-chart ref="refCountLineChart"></count-line-chart>
    </el-row>
    <!--msg send detail-->
    <el-row class="mgtp-10">
      <msg-send-detail ref="refMsgSendDetail"></msg-send-detail>
    </el-row>
  </div>
</template>

<script>
  import {applicationAPI} from "@/api/api";
  import msgSendDetail from "./msgSendDetail";
  import countLineChart from "./countLineChart";

  export default {
    name: "plCountIndex",
    data() {
      return {
        appCountListData: [],
        tabLoading: false,
        resizable: false
      }
    },
    components: {msgSendDetail, countLineChart},
    mounted() {
      this.searchAppCountList();
    },
    methods: {
      searchAppCountList() {
        let vm = this;
        vm.tabLoading = true;
        applicationAPI.fetchCurrentUserAppLast30SendCount().then(res => {
          vm.tabLoading = false;
          vm.appCountListData = res;
        }).catch(error => {
        });
      },
      appSendMsgDetail(scope) {
        this.$refs.refMsgSendDetail.appId = scope.row.appId;
        this.$refs.refMsgSendDetail.dialogShow = true;
      },
      appSendMsgLineChart(scope) {
        this.$refs.refCountLineChart.sendCountData = scope.row.sendCountList;
        this.$refs.refCountLineChart.dialogShow = true;
      }
    }
  }
</script>

<style scoped lang="scss">
  .title-line-wrap {
    height: 20px;
    line-height: 20px;
    font-size: 15px;
    color: #666;
    .bar {
      float: left;
      margin-right: 9px;
      width: 12px;
      height: 100%;
      background-color: #4cafff;
    }
  }
</style>
