<template>
  <el-dialog title="短信发送详情"
             :visible.sync="dialogShow" width="70%" top="10vh" @open="searchMSList" @closed="dialogClosed">
    <el-row>
      <el-form :model="msSearchForm" class="fr">
        <el-button type="primary" class="fr" size="small" icon="el-icon-refresh" @click="resetSrhFormData"
                   style="margin-left: 8px;"></el-button>
        <el-button type="primary" class="fr" size="small" icon="el-icon-search" @click="searchMSList"
                   style="margin-left: 8px;"></el-button>
        <el-date-picker class="fr" style="margin-left: 8px;"
                        v-model="startEndDateModel"
                        size="small"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        unlink-panels
                        @change="seDatePick">
        </el-date-picker>
        <el-select v-model="msSearchForm.status" class="fr" style="margin-left: 8px;" size="small"
                   @change="searchMSList">
          <el-option
            v-for="item in statusSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="msSearchForm.phoneNum" @keyup.native="formatPhone" size="small" maxlength="11"
                  prefix-icon="el-icon-search" placeholder="目标手机"
                  class="oper-right-search"></el-input>
      </el-form>
    </el-row>
    <el-row class="mgtp-10">
      <el-table :data="msListData" v-loading="tabLoading" max-height="550" border>
        <el-table-column prop="phoneNum" label="目标手机"></el-table-column>
        <el-table-column prop="params" label="参数"></el-table-column>
        <el-table-column :formatter="formatMsStatus" label="状态"></el-table-column>
        <el-table-column prop="info" label="信息" width="300"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
    </el-row>
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="msPSChange"
                     @current-change="msPCChange"
                     :current-page.sync="msPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="msPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="msCount">
      </el-pagination>
    </el-row>
  </el-dialog>
</template>

<script>
  import {applicationAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";

  export default {
    name: "msgSendDetail",
    data() {
      return {
        dialogShow: false,
        tabLoading: false,
        appId: null,
        msListData: [],
        msCount: 0,
        msPageSize: 10,
        msPageCur: 1,
        startEndDateModel: '',
        statusSelect: [{value: '', label: '所有状态'}, {value: '1', label: '发送成功'}, {value: '0', label: '发送失败'}],
        msSearchForm: {
          phoneNum: '',
          status: '',
          startTime: '',
          endTime: ''
        }
      }
    },
    watch: {
      'msPageSize': 'searchMSList',
      'msPageCur': 'searchMSList'
    },
    methods: {
      searchMSList() {
        let vm = this, pm = {
          appId: vm.appId,
          phoneNum: vm.msSearchForm.phoneNum,
          status: vm.msSearchForm.status,
          startTime: vm.msSearchForm.startTime,
          endTime: vm.msSearchForm.endTime,
          pageSize: vm.msPageSize,
          pageNum: vm.msPageCur - 1
        };
        vm.tabLoading = true;
        applicationAPI.searchSmsSendLog(pm).then(res => {
          vm.tabLoading = false;
          vm.msListData = res.datas;
          vm.msCount = res.totalNum;
        }).catch(error => {
        });
      },
      resetSrhFormData() {
        Object.assign(this.msSearchForm, this.$options.data().msSearchForm);
        this.startEndDateModel = '';
        this.msPageCur = 1;
        this.searchMSList();
      },
      seDatePick(dateArr) {//清空时dateArr为null 正常选择是时为数组 0为开始日期 1为结束日期
        if(dateArr){
          this.msSearchForm.startTime = dateArr[0];
          this.msSearchForm.endTime = dateArr[1];
        }else{
          this.msSearchForm.startTime = '';
          this.msSearchForm.endTime = '';
        }
        this.searchMSList();
      },
      msPSChange(ps) {
        this.msPageSize = ps;
      },
      msPCChange(pc) {
        this.msPageCur = pc;
      },
      formatMsStatus(scope) {
        if (scope.status == '1') {
          return '发送成功'
        }
        if (scope.status == '0') {
          return '发送失败'
        }
      },
      formatPhone() {
        this.msSearchForm.phoneNum = formatUtils.num(this.msSearchForm.phoneNum);
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
