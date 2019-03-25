<template>
  <el-dialog title="近30日短信发送折线统计图"
             :visible.sync="dialogShow" width="1200px" top="10vh" :close-on-click-modal="!dialogShow" @open="dialogOpen" @closed="dialogClosed">
    <echart-line width="96%" :echartsData="echartsData" ref="refEchartLine"></echart-line>
  </el-dialog>
</template>

<script>
  import echartLine from "@/components/echarts/echartLine";

  export default {
    name: "countLineChart",
    data() {
      return {
        dialogShow: false,
        sendCountData: [],
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
      dialogOpen() {
        let vm = this, xAxisArr = [], allCountArr = [], succCountArr = [], failCountArr = [],
          sendCountData = vm.sendCountData;
        for (let i = 0; i < sendCountData.length; i++) {
          xAxisArr.push(sendCountData[i]['sendDate']);
          allCountArr.push(sendCountData[i]['sendCount']);
          succCountArr.push(sendCountData[i]['successCount']);
          failCountArr.push(sendCountData[i]['failCount']);
        }
        vm.echartsData.xAxis.data = xAxisArr;
        vm.echartsData.series[0].data = allCountArr;
        vm.echartsData.series[1].data = succCountArr;
        vm.echartsData.series[2].data = failCountArr;
        vm.$nextTick(() => {
          vm.$refs.refEchartLine.setEchartsOption();
        });
      },
      dialogClosed() {
        //this.sendCountData = [];
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
