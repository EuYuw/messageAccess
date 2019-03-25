<template>
  <div class="bs-wp">
    <!-- oper row -->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addApplication">新增应用</el-button>
    </el-row>
    <!-- list table row -->
    <el-row class="mgtp-10">
      <el-table :data="appListData" v-loading="tabLoading" max-height="580" border>
        <el-table-column :resizable="resizable" type="expand">
          <template slot-scope="props">
            <el-form label-position="right" inline class="demo-table-expand" label-width="140px">
              <el-row v-if="props.row.licenseType == '1'">
                <el-form-item label="三证合一：">
                  <span><img class="licenceImg" :src="props.row.inOneLicenceUrl"/></span>
                </el-form-item>
                <el-form-item label="授权委托书：">
                  <span><a :href="props.row.authorizationUrl">{{props.row.authorizationUrl}}</a></span>
                </el-form-item>
              </el-row>
              <el-row v-else>
                <el-form-item label="营业执照：">
                  <span><img class="licenceImg" :src="props.row.businessLicenceUrl"/></span>
                </el-form-item>
                <el-form-item label="组织机构代码证：">
                  <span><img class="licenceImg" :src="props.row.organizationLicenceUrl"/></span>
                </el-form-item>
                <el-form-item label="税务登记证：">
                  <span><img class="licenceImg" :src="props.row.taxLicenceUrl"/></span>
                </el-form-item>
                <el-form-item label="授权委托书：">
                  <span><a :href="props.row.authorizationUrl">{{props.row.authorizationUrl}}</a></span>
                </el-form-item>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="应用名称" width="260" :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatLicenseType" label="应用证件类型" width="160"
                         :resizable="resizable"></el-table-column>
        <el-table-column :formatter="formatStatus" label="状态" :resizable="resizable"></el-table-column>
        <el-table-column prop="description" label="申请说明" :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="280" :resizable="resizable">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.status == '3'" class="iconfont icon-editor fs-12"
                       @click="appEdit(scope)">编辑
            </el-button><!--//-->
            <el-button type="primary" size="mini" v-if="scope.row.status == '1'" class="iconfont icon-tiaoshi fs-12"
                       @click="interfaceInvoke(scope)">接口调用说明
            </el-button>
            <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="appDelete(scope)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- page row -->
    <el-row class="mgtp-10">
      <el-pagination class="fr" prev-text="上一页" next-text="下一页"
                     @size-change="appPSChange"
                     @current-change="appPCChange"
                     :current-page.sync="appPageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="appPageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="appCount">
      </el-pagination>
    </el-row>
    <!-- application oper row -->
    <el-row class="mgtp-10">
      <application-oper ref="refApplicationOper" @refreshList="searchApplicationList"></application-oper>
    </el-row>
    <!--interface invoke desc row-->
    <el-row class="mgtp-10">
      <!--<interface-invoke ref="refInterfaceInvoke"></interface-invoke>-->
      <impl-invoke-desc ref="refImplInvokeDesc"></impl-invoke-desc>
    </el-row>
  </div>
</template>

<script>
  import {applicationAPI} from "@/api/api";
  import applicationOper from "./applicationOper";
  import implInvokeDesc from "./implInvokeDesc";

  export default {
    name: "plApplicationIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        appPageCur: 1,
        appPageSize: 10,
        appCount: 0,
        appListData: []
      }
    },
    components: {applicationOper, implInvokeDesc},
    watch: {
      appPageSize: 'searchApplicationList',
      appPageCur: 'searchApplicationList'
    },
    mounted() {
      this.searchApplicationList();
    },
    methods: {
      searchApplicationList() {
        let vm = this, pm = {
          pageSize: vm.appPageSize,
          pageNum: vm.appPageCur - 1
        };
        vm.tabLoading = true;
        applicationAPI.searchCurrentUser(pm).then(res => {
          vm.appListData = res.datas;
          vm.appCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {
          vm.tabLoading = false;
        });
      },
      addApplication() {
        this.$refs.refApplicationOper.dialogShow = true;
      },
      interfaceInvoke(scope) {
        let refObj = this.$refs.refImplInvokeDesc;
        refObj.getTokenForm.param.client_id = scope.row.appKey;
        refObj.getTokenForm.param.client_secret = scope.row.appSecret;
        refObj.dialogShow = true;
      },
      appEdit(scope) {
        let refObj = this.$refs.refApplicationOper;
        refObj.submitType = 2;
        refObj.appDataId = scope.row.id;
        refObj.appOperForm.name = scope.row.name;
        refObj.appOperForm.licenseType = scope.row.licenseType;
        refObj.appOperForm.description = scope.row.description;
        refObj.threeInOneImgUrl = scope.row.inOneLicenceUrl;
        refObj.busImgUrl = scope.row.businessLicenceUrl;
        refObj.organImgUrl = scope.row.organizationLicenceUrl;
        refObj.taxImgUrl = scope.row.taxLicenceUrl;
        refObj.authorImgUrl = scope.row.authorizationUrl;
        refObj.dialogShow = true;
      },
      appDelete(scope) {
        let vm = this, pm = {id: scope.row.id};
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              applicationAPI.del(pm).then(res => {
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
          vm.searchApplicationList();
        }).catch(() => {//取消
        });
      },
      appPSChange(ps) {
        this.appPageSize = ps;
      },
      appPCChange(pc) {
        this.appPageCur = pc;
      },
      formatLicenseType(scope) {
        if (scope.licenseType == '1') {
          return '三证合一';
        }
        if (scope.licenseType == '2') {
          return '三证分离';
        }
      },
      formatStatus(scope) {
        if (scope.status == '0') {
          return '已删除';
        }
        if (scope.status == '1') {
          return '审核通过';
        }
        if (scope.status == '2') {
          return '审核中';
        }
        if (scope.status == '3') {
          return '审核未通过（原因：' + scope.refuseDesc + '，时间：' + scope.auditingTime + '）';
        }
      }
    }
  }
</script>

<style scoped>
  .licenceImg {
    max-width: 500px;
  }
</style>
