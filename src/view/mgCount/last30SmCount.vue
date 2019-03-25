<template>
  <el-dialog title="近30日短信发送折线统计" :visible.sync="dialogShow" width="70%" @open="searchLastSmCount" @closed="dialogClosed">
    <!--<el-table :data="lastSmCountData" v-loading="tabLoading" max-height="580" border show-summary>
      <el-table-column prop="sendDate" label="日期"></el-table-column>
      <el-table-column prop="sendCount" label="总计发送(条)"></el-table-column>
      <el-table-column prop="successCount" label="发送成功(条)"></el-table-column>
      <el-table-column prop="failCount" label="发送失败(条)"></el-table-column>
    </el-table>-->
    <echart-line width="96%" :echartsData="echartsData" ref="refEchartLine"></echart-line>
  </el-dialog>
</template>

<script>
  import {applicationAPI} from "@/api/api";
  import echartLine from "@/components/echarts/echartLine";

  export default {
    name: "last30SmCount",
    data() {
      return {
        dialogShow: false,
        appId: null,
        echartsData: {
          xAxis: {
            data: [],
            name: '日期',
            boundaryGap: false,
            axisLabel: {
              rotate: -45
            },
          },
          series: [{
            data: [],
            name: '总计发送',
            type: 'line'
          }, {
            data: [],
            name: '发送成功',
            type: 'line'
          }, {
            data: [],
            name: '发送失败',
            type: 'line'
          }]
        }
      }
    },
    components: {echartLine},
    methods: {
      searchLastSmCount() {
        let vm = this;
        applicationAPI.fetchAppLast30SendCount({appId: vm.appId}).then(res => {
          let xAxisArr = [], allCountArr = [], succCountArr = [], failCountArr = [];
          for (let i = 0; i < res.length; i++) {
            xAxisArr.push(res[i]['sendDate']);
            allCountArr.push(res[i]['sendCount']);
            succCountArr.push(res[i]['successCount']);
            failCountArr.push(res[i]['failCount']);
          }
          vm.echartsData.xAxis.data = xAxisArr;
          vm.echartsData.series[0].data = allCountArr;
          vm.echartsData.series[1].data = succCountArr;
          vm.echartsData.series[2].data = failCountArr;
          vm.$nextTick(() => {
            vm.$refs.refEchartLine.setEchartsOption();
          })
        }).catch(error => {
        });
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
