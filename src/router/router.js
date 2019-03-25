import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import {constant} from "../common/constant";
/** 基础 **/
const layout = () => import('../view/layout/layout')
const home = () => import('../view/layout/home')
const loginForME = () => import('../view/login/loginForME')
const login = () => import('../view/login/login')
const page404 = () => import('../view/error/page404')
/** 系统管理 **/
const dept = () => import('../view/system/dept/index')
const resource = () => import('../view/system/resource/index')
const role = () => import('../view/system/role/index')
const user = () => import('../view/system/user/index')
/**  门户 模板管理**/
const plTemplate = () => import('../view/plTemplate/index')
/**  门户 应用管理**/
const plApplication = () => import('../view/plApplication/index')
const plCount = () => import('../view/plCount/index')
/**  管理 模板管理**/
const mgTemplate = () => import('../view/mgTemplate/index')
const mgTemplateLib = () => import('../view/mgTemplateLib/index')
const mgCount = () => import('../view/mgCount/index')
/**  管理 应用管理**/
const mgApplication = () => import('../view/mgApplication/index')

Vue.use(Router);
/** base router* */
export const constRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/dxjrptLoginForME',
    name: 'loginFME',
    component: loginForME
  },
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/home',
    component: layout,
    children: [
      {
        path: '',
        component: home,
        meta: {
          auth: true
        }
      }
    ]
  }
];
/** manager async router **/
export const managerRouter = [
  {
    path: '/mgTemplate',
    code: 'mgTemplate',
    component: layout,
    name: '模板管理',
    icon: 'iconfont icon-document',
    show: true,
    children: [
      {
        path: 'index',
        name: '模板审核',
        code: 'mgTemplate_index',
        component: mgTemplate,
        icon: 'iconfont icon-document',
        meta: {
          auth: true
        }
      },
      {
        path: 'example',
        name: '常用模板库',
        code: 'mgTemplate_example',
        component: mgTemplateLib,
        icon: 'iconfont icon-changjingguanli',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/mgApplication',
    code: 'mgApplication',
    component: layout,
    name: '应用管理',
    icon: 'iconfont icon-zidingyi',
    show: true,
    children: [
      {
        path: 'index',
        name: '应用审核',
        code: 'mgApplication_index',
        component: mgApplication,
        icon: 'iconfont icon-zidingyi',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/mgCount',
    code: 'mgCount',
    component: layout,
    name: '统计管理',
    icon: 'iconfont icon-shujukanban',
    show: true,
    children: [
      {
        path: 'index',
        name: '数据统计',
        code: 'mgCount_index',
        component: mgCount,
        icon: 'iconfont icon-zhexiantu',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/system',
    name: '系统管理',
    code: 'system',
    component: layout,
    icon: 'iconfont icon-icon_yingyongguanli',
    show: true,
    children: [
      {
        path: 'dept',
        name: '部门管理',
        code: 'system_dept',
        component: dept,
        icon: 'iconfont icon-group',
        meta: {
          auth: true
        }
      },
      {
        path: 'user',
        name: '用户管理',
        code: 'system_user',
        component: user,
        icon: 'iconfont icon-people',
        meta: {
          auth: true
        }
      },
      {
        path: 'role',
        name: '角色管理',
        code: 'system_role',
        component: role,
        icon: 'iconfont icon-addressbook',
        meta: {
          auth: true
        }
      },
      {
        path: 'resource',
        name: '资源管理',
        code: 'system_resource',
        component: resource,
        icon: 'iconfont icon-manage',
        meta: {
          auth: true
        }
      }
    ]
  }
];
/** portal async router **/
export const portalRouter = [
  {
    path: '/plTemplate',
    code: 'plTemplate',
    component: layout,
    show: true,
    children: [
      {
        path: 'index',
        name: '模板申请',
        code: 'plTemplate_index',
        component: plTemplate,
        icon: 'iconfont icon-document',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/plApplication',
    code: 'plApplication',
    component: layout,
    show: true,
    children: [
      {
        path: 'index',
        name: '应用申请',
        code: 'plApplication_index',
        component: plApplication,
        icon: 'iconfont icon-zidingyi',
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/count',
    code: 'count',
    component: layout,
    show: true,
    children: [
      {
        path: 'index',
        name: '数据统计',
        code: 'count_index',
        component: plCount,
        icon: 'iconfont icon-tubiao-zhexiantu',
        meta: {
          auth: true
        }
      }
    ]
  }
];
export default new Router({
  routes: constRouterMap,
  scrollBehavior: () => ({ y: 0 })
});



