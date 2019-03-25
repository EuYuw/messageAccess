<template>
  <div :id="id" :style="{width: width + 'px', height: height + 'px'}"></div>
</template>

<script>
  // 引入 ECharts 主模块
  const echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/line');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/legend');

  export default {
    name: "echartLine",
    props: {
      id: {
        type: String,
        default: 'echart-line'
      },
      width: {
        type: String
      },
      height: {
        type: String,
        default: '550'
      },
      echartsData: {
        type: Object,
        require: true
      }
    },
    data() {
      return {
        echartLine: null
      }
    },
    mounted() {
      this.executeDom();
      this.initLineEchart();
    },
    methods: {
      executeDom() {
        let ppwidth = document.getElementById(this.id).parentNode.offsetWidth;
        if (!this.width) {
          document.getElementById(this.id).style.width = ppwidth + 'px';
        } else {
          if (this.width.indexOf('%') !== -1) {
            let tw = parseInt(this.width) / 100;
            document.getElementById(this.id).style.width = parseInt(tw * ppwidth) + 'px';
          }
        }
      },
      initLineEchart() {
        this.echartLine = echarts.init(document.getElementById(this.id));
        this.setEchartsOption();
      },
      setEchartsOption() {
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          xAxis: {
            type: 'category'
          },
          yAxis: {
            type: 'value'
          }
        };
        /*option.xAxis.data = this.echartsData.xAxis.data;*/
        Object.assign(option.xAxis, this.echartsData.xAxis);
        option.series = this.echartsData.series;
        if(this.echartLine){
          this.echartLine.setOption(option);
        }
      },
      beforeDestroy() {
        this.echartLine = null;
      }
    }
  }
</script>

<style scoped>

</style>
