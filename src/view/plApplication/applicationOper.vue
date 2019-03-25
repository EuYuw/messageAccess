<template>
  <el-dialog :title="submitType == 1 ? '新增应用' : '编辑应用'" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="1000px" @closed="dialogClosed">
    <el-form :model="appOperForm" label-width="120px">
      <table class="bs-table">
        <tbody>
          <tr>
            <td>*应用名称</td>
            <td><el-input v-model="appOperForm.name" maxlength="12"></el-input></td>
          </tr>
          <tr>
            <td>*三证合一</td>
            <td>
              <el-radio-group v-model="appOperForm.licenseType">
                <el-radio label="1">是</el-radio>
                <el-radio label="2">否</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>*证明文件</td>
            <td>
              <el-upload v-show="appOperForm.licenseType == 1"
                         class="avatar-uploader"
                         action=""
                         accept="image/png, image/jpeg, image/jpg"
                         :show-file-list="false"
                         :before-upload="threeInOneUpSucc">
                <img v-if="threeInOneImgUrl" :src="threeInOneImgUrl" class="avatar">
                <el-row v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="tip-div">签名归属方的三证合一</div>
                  <div class="tip-div" style="top: 120px;">（.png，.jpg，.jpeg）</div>
                </el-row>
              </el-upload>
              <el-upload v-show="appOperForm.licenseType == 2"
                         class="avatar-uploader"
                         action=""
                         accept="image/png, image/jpeg, image/jpg"
                         :show-file-list="false"
                         :before-upload="businessUpSucc">
                <img v-if="busImgUrl" :src="busImgUrl" class="avatar">
                <el-row v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="tip-div">营业执照</div>
                  <div class="tip-div" style="top: 120px;">（.png，.jpg，.jpeg）</div>
                </el-row>
              </el-upload>
              <el-upload v-show="appOperForm.licenseType == 2"
                         class="avatar-uploader"
                         action=""
                         accept="image/png, image/jpeg, image/jpg"
                         :show-file-list="false"
                         :before-upload="organUpSucc">
                <img v-if="organImgUrl" :src="organImgUrl" class="avatar">
                <el-row v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="tip-div">组织机构代码证</div>
                  <div class="tip-div" style="top: 120px;">（.png，.jpg，.jpeg）</div>
                </el-row>
              </el-upload>
              <el-upload v-show="appOperForm.licenseType == 2"
                         class="avatar-uploader"
                         action=""
                         accept="image/png, image/jpeg, image/jpg"
                         :show-file-list="false"
                         :before-upload="taxUpSucc">
                <img v-if="taxImgUrl" :src="taxImgUrl" class="avatar">
                <el-row v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="tip-div">税务登记证</div>
                  <div class="tip-div" style="top: 120px;">（.png，.jpg，.jpeg）</div>
                </el-row>
              </el-upload>
              <el-upload
                class="avatar-uploader"
                action=""
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                :show-file-list="false"
                :before-upload="authorUpSucc">
                <div v-if="authorImgUrl" class="avatar"><p style="text-align: left">文件：{{authorImgUrl}}</p></div>
                <el-row v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="tip-div">授权委托书</div>
                  <div class="tip-div" style="top: 120px;">（.doc，.docx）</div>
                </el-row>
              </el-upload>
              <div style="line-height: 1.5;">word模板下载：<a
                href="http://119.84.121.211:28080/%E6%8E%88%E6%9D%83%E5%A7%94%E6%89%98%E4%B9%A6%E6%A8%A1%E7%89%88.doc"
                style="color: #9b7fea;">授权委托书</a></div>
            </td>
          </tr>
          <tr>
            <td>申请说明</td>
            <td>
              <el-input type="textarea" v-model="appOperForm.description" rows="5" maxlength="100"></el-input>
            </td>
          </tr>
        </tbody>
      </table>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="btnSubLoading" @click="subAppOperForm">保 存</el-button>
      <el-button type="danger" @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {applicationAPI} from "@/api/api";

  export default {
    name: "applicationOper",
    data() {
      return {
        submitType: 1,
        appDataId: null,//数据id
        dialogShow: false,
        btnSubLoading: false,
        threeInOneImgUrl: '',
        threeInOneFile: '',
        busImgUrl: '',
        busImgFile: '',
        organImgUrl: '',
        organImgFile: '',
        taxImgUrl: '',
        taxImgFile: '',
        authorImgUrl: '',
        authorImgFile: '',
        appOperForm: {
          name: '',
          licenseType: '1',
          description: ''
        }
      }
    },
    methods: {
      validateAppOperForm() {
        let res = 1;
        if (this.appOperForm.name == '') {
          res = '请输入应用名称';
        } else if (this.appOperForm.licenseType == '1') {
          if (this.threeInOneFile == '') {
            res = '请上传三证合一证件';
          } else if (this.authorImgFile == '') {
            res = '请上传授权委托书'
          }
        } else if (this.appOperForm.licenseType == '2') {
          if (this.busImgFile == '') {
            res = '请上传营业执照';
          } else if (this.organImgFile == '') {
            res = '请上传组织机构代码证';
          } else if (this.taxImgFile == '') {
            res = '请上传税务登记证';
          } else if (this.authorImgFile == '') {
            res = '请上传授权委托书';
          }
        }
        return res;
      },
      subAppOperForm() {
        let vm = this, flag = vm.validateAppOperForm(), pm = new FormData();
        if (flag === 1) {
          pm.append('name', vm.appOperForm.name);
          pm.append('licenseType', vm.appOperForm.licenseType);
          pm.append('description', vm.appOperForm.description);
          if (vm.appOperForm.licenseType == '1') {
            pm.append('file1', vm.threeInOneFile);
            pm.append('file2', vm.authorImgFile);
          } else if (vm.appOperForm.licenseType == '2') {
            pm.append('file1', vm.busImgFile);
            pm.append('file2', vm.organImgFile);
            pm.append('file3', vm.taxImgFile);
            pm.append('file4', vm.authorImgFile);
          }
          vm.btnSubLoading = true;
          if(vm.submitType === 1){//add
            applicationAPI.add(pm).then(res => {
              vm.btnSubLoading = false;
              if (res.msg == 'ok') {
                vm.$message({message: '新增成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshList', {});
              } else {
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {
              if(error.response.data.msg){
                vm.$message({message: error.response.data.msg, type: 'error'});
              }
              vm.btnSubLoading = false;
            });
          }
          if(vm.submitType === 2){//edit
            pm.append('id', vm.appDataId);
            applicationAPI.update(pm).then(res => {
              vm.btnSubLoading = false;
              if (res.msg == 'ok') {
                vm.$message({message: '编辑成功', type: 'success'});
                vm.dialogShow = false;
                vm.$emit('refreshList', {});
              } else {
                vm.$message({message: res.msg, type: 'error'});
              }
            }).catch(error => {
              vm.btnSubLoading = false;
            });
          }
        } else {
          vm.$message({message: flag, type: 'warning'});
        }
      },
      threeInOneUpSucc(file) {//三证合一
        let fileNameArr = (file.name).split(".");
        let fileType = fileNameArr[fileNameArr.length - 1];
        if(fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg'){
          this.threeInOneFile = file;
          this.threeInOneImgUrl = URL.createObjectURL(file);
        }else{
          this.$message({message: '请上传正确格式的三证合一', type: 'error'});
          this.threeInOneFile = '';
          this.threeInOneFile = '';
        }
      },
      businessUpSucc(file) {//营业
        let fileNameArr = (file.name).split(".");
        let fileType = fileNameArr[fileNameArr.length - 1];
        if(fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg'){
          this.busImgFile = file;
          this.busImgUrl = URL.createObjectURL(file);
        }else{
          this.$message({message: '请上传正确格式的营业执照', type: 'error'});
          this.busImgFile = '';
          this.busImgUrl = '';
        }
      },
      organUpSucc(file) {//组织
        let fileNameArr = (file.name).split(".");
        let fileType = fileNameArr[fileNameArr.length - 1];
        if(fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg'){
          this.organImgFile = file;
          this.organImgUrl = URL.createObjectURL(file);
        }else{
          this.$message({message: '请上传正确格式的组织机构代码证', type: 'error'});
          this.organImgFile = '';
          this.organImgUrl = '';
        }
      },
      taxUpSucc(file) {//税务
        let fileNameArr = (file.name).split(".");
        let fileType = fileNameArr[fileNameArr.length - 1];
        if(fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg'){
          this.taxImgFile = file;
          this.taxImgUrl = URL.createObjectURL(file);
        }else{
          this.$message({message: '请上传正确格式的税务登记证', type: 'error'});
          this.taxImgFile = '';
          this.taxImgUrl = '';
        }
      },
      authorUpSucc(file) {//授权
        let fileNameArr = (file.name).split(".");
        let fileType = fileNameArr[fileNameArr.length - 1];
        if(fileType == 'doc' || fileType == 'docx'){
          this.authorImgFile = file;
          this.authorImgUrl = file.name;
        }else{
          this.$message({message: '请上传正确格式的授权委托书', type: 'error'});
          this.authorImgFile = '';
          this.authorImgUrl = '';
        }
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader {
    display: inline-block;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .tip-div {
    position: absolute;
    width: 100%;
    top: 100px;
    text-align: center;
  }
</style>
