<template>
  <el-dialog title="接口调用说明" :close-on-click-modal="dialogShow" :visible.sync="dialogShow" width="900px" top="10vh"
             @open="dialogOpen" @closed="dialogClosed">
    <div class="bs-wp">
      <el-steps :active="active" process-status="success" finish-status="success">
        <el-step title="获取token"></el-step>
        <el-step title="调用接口"></el-step>
      </el-steps>
      <div class="step-content mgtp-10">
        <div class="step-1" v-show="active == 0">
          <el-form :model="getTokenForm" label-width="120px">
            <el-form-item label="接口地址：" class="mgbt-5">
              <label>{{getTokenForm.implUrl}}</label>
            </el-form-item>
            <el-form-item label="请求方式：" class="mgbt-5">
              <label>{{getTokenForm.httpType}}</label>
            </el-form-item>
            <el-form-item label="请求参数：" class="mgbt-5">
              <p>grant_type：{{getTokenForm.param.grant_type}}<label class="desc-label">(固定值password)</label></p>
              <p>client_id：{{getTokenForm.param.client_id}}<label class="desc-label">(值为当前应用的appKey)</label></p>
              <p>client_secret：{{getTokenForm.param.client_secret}}<label class="desc-label">(值为当前应用的appSecret)</label>
              </p>
            </el-form-item>
            <el-form-item label="参数类型：" class="mgbt-5">
              <label>{{getTokenForm.paramType}}</label>
            </el-form-item>
            <el-form-item label="预期返回：" class="mgbt-5">
              <div>{</div>
              <div style="line-height: 1.0">
                <p style="margin-left: 10px;line-height: 20px;">"access_token" : "{{sendMsgForm.param.token}}"
                  <label class="desc-label">(目标值token)</label></p>
                <p style="margin-left: 10px;line-height: 20px;">"token_type" : "xxx"</p>
                <p style="margin-left: 10px;line-height: 20px;">"expires_in" : "xxx"</p>
                <p style="margin-left: 10px;line-height: 20px;">"accessTokenRequest" : "xxx"</p>
              </div>
              <div> }</div>
            </el-form-item>
            <el-form-item label-width="36px">
              <el-button type="primary" size="small" :loading="btnLoading" @click="tryGetToken">获取token</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="step-2" v-show="active == 1">
          <el-form :model="sendMsgForm" label-width="120px">
            <el-form-item label="接口地址：" class="mgbt-5">
              <label>{{sendMsgForm.implUrl}}</label>
            </el-form-item>
            <el-form-item label="请求方式：" class="mgbt-5">
              <label>{{sendMsgForm.httpType}}</label>
            </el-form-item>
            <el-form-item label="请求参数：" class="mgbt-5">
              <div>token：{{sendMsgForm.param.token}}<label class="desc-label">(步骤1获取的token)</label></div>
              <div class="mgbt-5">
                <div class="title-blc">phoneNum：</div>
                <el-input v-model="sendMsgForm.param.phoneNum" style="width: 300px;"></el-input>
                <label class="desc-label">(目标手机号)</label></div>
              <div class="mgbt-5">
                <div class="title-blc">templeteId：</div>
                <el-select v-model="sendMsgForm.param.templeteId" style="width: 300px;" placeholder="请选择模板" clearable @change="templateChange">
                  <el-option
                    v-for="item in templateSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <label class="desc-label">(所选模板的ID)</label></div>
              <div class="pr mgbt-5">
                <div class="title-blc" style="position: absolute;top: 0;left: 0;">模板内容：</div>
                <span style="margin-left: 89px;"><el-input type="textarea" v-model="templateContent" rows="5" readonly style="width: 400px"></el-input></span><label class="desc-label">(模板内容非参数)</label>
              </div>
              <div class="pr">
                <div class="title-blc" style="position: absolute;top: 0;left: 0;">params：</div>
                <span style="margin-left: 89px;"><el-input type="textarea" v-model="sendMsgForm.param.params" rows="3" style="width: 400px"></el-input></span>
                <p style="line-height: 24px;color: red;">(参数值需要根据具体模板内容填写，规则是：如果模板内容里包含${xxx}之类的内容，则需要对应生成{"xxx":
                  ""}，格式为JSON。例：假设模板内容为" 欢迎注册，验证码为${code}，其他内容${content} "，则参数需要填写为{"code": "", "content": ""})</p>
              </div>
            </el-form-item>
            <el-form-item label="参数类型：" class="mgbt-5">
              <label>{{sendMsgForm.paramType}}</label>
            </el-form-item>
            <el-form-item label="预期返回：" class="mgbt-5">
              <div>{</div>
              <div style="line-height: 1.0">
                <p style="margin-left: 10px;line-height: 20px;">"msg" : "{{sendMsgForm.result}}"</p>
              </div>
              <div> }</div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="el-row mgtp-10">
        <el-button type="primary" size="small" v-show="active == 1" @click="active--">上一步</el-button>
        <el-button type="primary" size="small" v-show="active == 0" @click="active++">下一步</el-button>
        <el-button type="primary" size="small" v-show="active == 1" :loading="btnLoading" @click="implInvoke">调用接口</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {smsAPI, templateAPI} from "@/api/api";
  import {formatUtils, regUtils} from "@/utils/utils";

  export default {
    name: "implInvokeDesc",
    data() {
      return {
        dialogShow: false,
        btnLoading: false,
        active: 0,
        templateSelect: [],
        templateContent: '',
        getTokenForm: {
          implUrl: 'http://119.84.121.211:28080/api/sms/getToken',
          httpType: 'GET',
          param: {
            grant_type: 'password',
            client_id: '',
            client_secret: ''
          },
          paramType: 'JSON'
        },
        sendMsgForm: {
          implUrl: 'http://119.84.121.211:28080/api/sms/sendMessage',
          httpType: 'POST',
          param: {
            token: '',
            phoneNum: '',
            templeteId: '',
            params: ''
          },
          paramType: 'JSON',
          result: 'ok'
        }
      }
    },
    methods: {
      tryGetToken() {
        let vm = this;
        vm.btnLoading = true;
        smsAPI.getToken(vm.getTokenForm.param).then(res => {
          vm.btnLoading = false;
          vm.$message({message: 'token获取成功', type: 'success'});
          vm.sendMsgForm.param.token = res.access_token;
        }).catch(error => {
          vm.btnLoading = false;
        });
      },
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
      templateChange(val) {
        let vm = this, tplArr = vm.templateSelect;
        if (val) {
          for (let i = 0; i < tplArr.length; i++) {
            if (tplArr[i]['value'] == val) {
              vm.templateContent = tplArr[i]['content'];
              break;
            }
          }
          let regArr = (vm.templateContent).match(/\$\{[^\{\}]*?\}/g); //匹配${code}相似格式的内容，并生成参数
          let paramsStr = '{';
          for (let q = 0; q < regArr.length; q++) {
            regArr[q] = regArr[q].replace(/\$\{/g, '');
            regArr[q] = regArr[q].replace(/\}/g, '');
            paramsStr += '"' + regArr[q] + '": "",';
          }
          paramsStr = paramsStr.substring(0, paramsStr.length - 1);
          paramsStr += '}';
          vm.sendMsgForm.param.params = paramsStr;
        } else {
          vm.templateContent = '';
          vm.sendMsgForm.param.params = '';
        }
      },
      validateGetTokenForm() {
        let res = 1;
        if (this.sendMsgForm.param.token == '') {
          res = '请获取有效的token';
        } else if (this.sendMsgForm.param.phoneNum.length != 11 || !regUtils.tel(this.sendMsgForm.param.phoneNum)) {
          res = '请输入正确格式的手机号';
        } else if (this.sendMsgForm.param.templeteId == '') {
          res = '请选择模板';
        } else if (this.sendMsgForm.param.params == '') {
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
            JSON.parse(vm.sendMsgForm.param.params);
          } catch (e) {
            checkFlag = false;
            vm.$message({message: '参数不是一个合法JSON', type: 'error'});
          }
          if(checkFlag){
            vm.btnLoading = true;
            smsAPI.sendMessage(vm.sendMsgForm.param).then(res => {
              vm.btnLoading = false;
              if(res.msg == 'ok'){
                vm.$message({message: '接口调用成功', type: 'success'});
                vm.sendMsgForm.result = 'ok';
              }else{
                vm.$message({message: res.msg, type: 'error'});
                vm.sendMsgForm.result = res.msg;
              }
            }).catch(error => {vm.btnSubLoading = false;});
          }
        } else {
          vm.$message({message: flag, type: 'warning'});
        }
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>
  .step-content {
    margin: 10px 5px;
    padding: 10px 0;
    max-height: 550px;
    overflow: auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .desc-label {
    margin-left: 10px;
    color: red;
  }
  .title-blc{
    display: inline-block;
    width: 85px;
  }
  .mgbt-5 {
    margin-bottom: 5px;
  }
</style>
