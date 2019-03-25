<template>
  <el-dialog title="新增模板" :close-on-click-modal="!dialogShow"
             :visible.sync="dialogShow" :show-close="!btnSubLoading" width="900px" @opened="dialogOpen" @closed="dialogClosed">
    <el-form :model="tplOperForm">
      <table class="bs-table">
        <tbody>
          <tr>
            <td>*模板类型</td>
            <td>
              <el-radio-group v-model="tplOperForm.type" @change="tplOperForm.content = ''">
                <el-radio label="1">验证码</el-radio>
                <el-radio label="2">短信通知</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>*模板名称</td>
            <td><el-input v-model="tplOperForm.name" @blur="checkTplName" maxlength="20"></el-input></td>
          </tr>
          <tr>
            <td>*模板内容</td>
            <td>
              <el-input type="textarea" v-model="tplOperForm.content" rows="5" maxlength="500"></el-input>
              <div style="margin-top: 5px;line-height: 1.0;"><a href="javascript:void(0);" @click="getUsefulTemplate" style="color: #9b7fea;cursor: pointer;">使用常用模板</a></div>
            </td>
          </tr>
          <tr>
            <td>申请说明</td>
            <td><el-input type="textarea" v-model="tplOperForm.description" rows="5" maxlength="100"></el-input></td>
          </tr>
        </tbody>
      </table>
    </el-form>
    <template-example ref="refTplEg" @valTplExample="valTplExample"></template-example>
    <div slot="footer">
      <el-button type="primary" :loading="btnSubLoading" @click="subTplOperForm">保 存</el-button>
      <el-button type="danger" @click="dialogShow = false" v-show="!btnSubLoading">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {templateAPI} from "@/api/api";
  import {formatUtils} from "@/utils/utils";
  import templateExample from "./templateExample";

  export default {
    name: "templateOper",
    data() {
      return {
        dialogShow: false,
        btnSubLoading: false,
        tplNameArr: [],
        tplOperForm: {
          name: '',
          type: '1',
          content: '',
          description: ''
        }
      }
    },
    components: {templateExample},
    methods: {
      validateTplSubForm() {
        let res = 1;
        this.tplOperForm.name = (this.tplOperForm.name).trim();
        this.tplOperForm.content = (this.tplOperForm.content).trim();
        if (this.tplOperForm.name == '') {
          res = '模板名称不能为空';
        } else if (this.tplOperForm.content == '') {
          res = '模板内容不能为空';
        } else {
          res = 1;
        }
        return res;
      },
      subTplOperForm() {
        let vm = this, flag = vm.validateTplSubForm();
        if(flag === 1){
          vm.btnSubLoading = true;
          templateAPI.add(vm.tplOperForm).then(res => {
            vm.btnSubLoading = false;
            if(res.msg == 'ok'){
              vm.$message({message: '新增成功', type: 'success'});
              vm.dialogShow = false;
              vm.$emit('refreshList', {});
            }else{
              vm.$message({message: res.msg, type: 'error'});
            }
          }).catch(error => {vm.btnSubLoading = false;});
        }else{
          vm.$message({message: flag, type: 'warning'});
        }
      },
      getUsefulTemplate() {
        this.$refs.refTplEg.type = this.tplOperForm.type;
        this.$refs.refTplEg.dialogShow = true;
      },
      valTplExample(val) {
        this.tplOperForm.content = val.content;
      },
      replaceSpace() {
        this.tplOperForm.name = formatUtils.replaceSpace(this.tplOperForm.name);
      },
      checkTplName() {
        if((this.tplNameArr).indexOf(this.tplOperForm.name) != -1){
          this.tplOperForm.name = '';
          this.$message({message: '当前模板名称已经存在', type: 'warning'});
        }
      },
      dialogOpen() {
        let vm = this;
        templateAPI.searchCurrentUser({pageSize: 200, pageNum: 0}).then(res => {
          let datas = res.datas;
          for(let i = 0; i < datas.length; i++){
            vm.tplNameArr.push(datas[i]['name']);
          }
        }).catch(error => {});
      },
      dialogClosed() {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
</script>

<style scoped>

</style>
