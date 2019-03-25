<template>
  <el-dialog title="接口调用" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="700px" @open="dialogOpen"
             @closed="dialogClosed">
    <el-form :model="implInvokeForm" label-width="120px">
      <el-form-item label="token">
        <el-col :span="20">
          <el-input v-model="implInvokeForm.token" :suffix-icon="tokenInputLoading" readonly></el-input>
        </el-col>
        <el-col :span="3" :offset="1"><a href="javascript:void(0)" @click="getToken"
                                         style="color: #1610CD;text-decoration: underline;">获取token</a></el-col>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="implInvokeForm.phoneNum" @keyup.native="formatPhoneNum" @blur="formatPhoneNum"
                  maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="模板">
        <el-select v-model="implInvokeForm.templeteId" class="w100" placeholder="请选择模板" clearable
                   @change="templateChange">
          <el-option
            v-for="item in templateSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板内容">
        <el-input type="textarea" v-model="templateContent" rows="5" readonly></el-input>
      </el-form-item>
      <el-form-item label="参数">
        <el-input type="textarea" v-model="implInvokeForm.params" rows="5" maxlength="200"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
      <el-button type="primary" :loading="btnSubLoading" @click="implInvoke">调 用</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {smsAPI, templateAPI} from "@/api/api";
  import {formatUtils, regUtils} from "@/utils/utils";

  export default {
    name: "interfaceInvoke",
    data() {
      return {
        dialogShow: false,
        btnSubLoading: false,
        tokenInputLoading: '',//el-icon-loading
        templateSelect: [],
        tokenForm: {
          grant_type: 'password',
          client_id: '',
          client_secret: ''
        },
        templateContent: '',
        implInvokeForm: {
          token: '',
          phoneNum: '',
          templeteId: '',
          params: ''
        }
      }
    },
    methods: {
      dialogOpen() {
        let vm = this;
        templateAPI.fetchCurrentUserEnableTempletes({pageNum: 0, pageSize: 200}).then(res => {
          let resArr = res.datas;
          for (let q = 0; q < resArr.length; q++) {
            vm.templateSelect.push({value: resArr[q]['id'], label: resArr[q]['name'], content: resArr[q]['content']});
          }
        }).catch(error => {
        })
      },
      getToken() {
        let vm = this;
        vm.tokenInputLoading = 'el-icon-loading';
        smsAPI.getToken(vm.tokenForm).then(res => {
          vm.$message({message: 'token获取成功', type: 'success'});
          vm.implInvokeForm.token = res.access_token;
          vm.tokenInputLoading = '';
        }).catch(error => {
        });
      },
      validateGetTokenForm() {
        let res = 1;
        if (this.implInvokeForm.token == '') {
          res = '请获取有效的token';
        } else if (this.implInvokeForm.phoneNum.length != 11 || !regUtils.tel(this.implInvokeForm.phoneNum)) {
          res = '请输入正确格式的手机号';
        } else if (this.implInvokeForm.templeteId == '') {
          res = '请选择模板';
        } else if (this.implInvokeForm.params == '') {
          res = '请输入参数';
        } else {
          res = 1;
        }
        return res;
      },
      implInvoke() {
        let vm = this, flag = vm.validateGetTokenForm();
        if (flag === 1) {
          let checkFlag = true;
          try {
            JSON.parse(vm.implInvokeForm.params);
          } catch (e) {
            checkFlag = false;
            vm.$message({message: '参数不是一个合法JSON', type: 'error'});
          }
          if(checkFlag){
            vm.btnSubLoading = true;
            smsAPI.sendMessage(vm.implInvokeForm).then(res => {
              vm.btnSubLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '接口调用成功', type: 'success'});
              }else{
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
        } else {
          vm.$message({message: flag, type: 'warning'});
        }
      },
      templateChange(val) {
        if (val) {
          let vm = this, tplArr = vm.templateSelect;
          for (let i = 0; i < tplArr.length; i++) {
            if (tplArr[i]['value'] == val) {
              vm.templateContent = tplArr[i]['content'];
              break;
            }
          }
          let regArr = (vm.templateContent).match(/\$\{[^\{\}]*?\}/g); //匹配${code}相似格式的内容，并生成参数
          let paramsStr = '{';
          for(let q = 0; q < regArr.length; q++){
            regArr[q] = regArr[q].replace(/\$\{/g, '');
            regArr[q] = regArr[q].replace(/\}/g, '');
            paramsStr += '"'+ regArr[q] +'": "",';
          }
          paramsStr = paramsStr.substring(0, paramsStr.length - 1);
          paramsStr += '}';
          vm.implInvokeForm.params = paramsStr;
        }else{
          vm.implInvokeForm.params = '';
        }
      },
      formatPhoneNum() {
        this.implInvokeForm.phoneNum = formatUtils.num(this.implInvokeForm.phoneNum);
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
