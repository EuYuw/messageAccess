<template>
  <div class="bs-wp">
    <!--oper row-->
    <el-row>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">新增角色</el-button>
      <el-form :model="roleSrhForm" @submit.native.prevent class="fr">
        <el-input v-model="roleSrhForm.name" @keyup.native.enter="searchRoleList" size="small" maxlength="20"
                  prefix-icon="el-icon-search" placeholder="角色名称" class="oper-right-search"></el-input>
        <el-input v-model="roleSrhForm.code" @keyup.native.enter="searchRoleList" size="small" maxlength="20"
                  prefix-icon="el-icon-search" placeholder="角色编码" class="oper-right-search"></el-input>
      </el-form>
    </el-row>
    <!--list table row-->
    <el-row class="mgtp-10">
      <el-table :data="roleListData" v-loading="tabLoading" class="w100" max-height="580" border>
        <el-table-column prop="code" label="角色编码" width="280" :resizable="resizable"></el-table-column>
        <el-table-column prop="name" width="300" label="角色名称" :resizable="resizable"></el-table-column>
        <el-table-column prop="description" label="角色描述"  :resizable="resizable"></el-table-column>
        <el-table-column prop="createTime" width="180" label="创建时间"  :resizable="resizable"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="320" :resizable="resizable">
          <template slot-scope="scope">
              <el-button type="primary" size="mini" class="iconfont icon-accessory fs-12" @click="roleLinkFunc(scope)">添加功能</el-button>
              <el-button type="primary" size="mini" class="iconfont icon-brush fs-12" @click="roleEdit(scope)">编辑</el-button>
              <el-button type="danger" size="mini" class="iconfont icon-trash fs-12" @click="roleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--page row-->
    <el-row class="mgtp-10">
      <el-pagination class="fr"
                     @size-change="rolePSChange"
                     @current-change="rolePCChange"
                     :current-page.sync="rolePageCur"
                     :page-sizes="[10, 20, 50]"
                     :page-size="rolePageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="roleCount">
      </el-pagination>
    </el-row>
    <!-- role oper -->
    <el-row>
      <role-oper ref="refRoleOper" @refresh="searchRoleList"></role-oper>
    </el-row>
  </div>
</template>

<script>
  import {roleAPI} from "@/api/api";
  import roleOper from "./roleOper";

  export default {
    name: "roleIndex",
    data() {
      return {
        tabLoading: false,
        resizable: false,
        roleListData: [],
        roleCount: 0,
        rolePageSize: 10,
        rolePageCur: 1,
        roleSrhForm: {
          name: '',
          code: ''
        }
      }
    },
    components: {roleOper},
    mounted() {
      this.searchRoleList();
    },
    methods: {
      addRole() {
        this.$refs.refRoleOper.dialogShow = true;
      },
      searchRoleList() {
        let vm = this, pm = {
          pageSize: vm.rolePageSize,
          pageNum: vm.rolePageCur - 1
        };
        vm.tabLoading = true;
        roleAPI.search(pm).then(res => {
          vm.roleListData = res.datas;
          vm.roleCount = res.totalNum;
          vm.tabLoading = false;
        }).catch(error => {});
      },
      roleLinkFunc(scope) {

      },
      roleEdit(scope) {
        let refObj = this.$refs.refRoleOper;
        refObj.roleOperForm.id = scope.row.id;
        refObj.roleOperForm.code = scope.row.code;
        refObj.roleOperForm.name = scope.row.name;
        refObj.roleOperForm.description = scope.row.description;
        refObj.dialogShow = true;
      },
      roleDelete(scope) {
        let vm = this;
        vm.$confirm('确定删除吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonLoading: false,
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              roleAPI.del({id: scope.row.id}).then(res => {
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
          vm.searchRoleList();
        }).catch(() => {//取消
        });
      },
      rolePSChange(ps) {
        this.rolePageSize = ps;
      },
      rolePCChange(pc) {
        this.rolePageCur = pc;
      }
    }
  }
</script>

<style scoped>

</style>
