/**
 *   axios request API
 */

import {GET, POST, PUT, PATCH, DEL} from './http';

/**  user api **/
export const userAPI = {
  login: param => {//登录
    return POST('/api/user/login', param);
  },
  loginUser: () => {//获取登录用户
    return GET('/api/user/loginUser');
  },
  getListFun: () => {//获取权限集
    return GET('/api/user/listFunctions');
  },
  logout: () => {//注销退出
    return GET('/api/user/logout');
  },
  register: param => {//注册
    return POST('/api/user/register', param);
  },
  resetPassword: param => {//重置密码
    return PUT('/api/user/resetPassword', param);
  },
  getCode: param => {//获取验证码
    return GET('/api/user/sendSms/' + param.mobileTel);
  },
  add: param => {//新增
    return POST('/api/user/add', param);
  },
  search: param => {//查询user
    return GET('/api/user/search', param);
  },
  del: param => {//删除user
    return DEL('/api/user/delete/' + param.id);
  },
  update: param => {//编辑
    return PUT('/api/user/' + param.id, param);
  },
  disable: param => {//挂起
    return GET('/api/user/disable', param);
  },
  enable: param => {//启用
    return GET('/api/user/enable', param);
  }
};
/**  user api **/

/**  role api **/
export const roleAPI = {
  add: param =>{
    return POST('/api/role', param);
  },
  update: param => {
    return PUT('/api/role', param);
  },
  search: param => {
    return GET('/api/role/search', param);
  },
  del: param => {
    return DEL('/api/role/', param.id);
  },
  findCode: param => {
    return GET('/api/role/findByCode', param);
  }
}
/**  role api **/

/**  template api **/
export const templateAPI = {
  add: param => {//门户端申请Template
    return POST('/api/templete/add', param);
  },
  audit: param => {//审核template
    return POST('/api/templete/auditingApp', param);
  },
  del: param => {//template删除
    return DEL('/api/templete/delete/' + param.id);
  },
  search: param => {//template条件查询
    return GET('/api/templete/search', param);
  },
  searchCurrentUser: param => {//获取当前用户template
    return GET('/api/templete/fetchCurrentUserTempletes', param);
  },
  fetchCurrentUserEnableTempletes: param => {//获取当前用户 enable template
    return GET('/api/templete/fetchCurrentUserEnableTempletes', param);
  }
}
/**  template api **/

/**  templateLib api **/
export const tplLibAPI = {
  add: param => {
    return POST('/api/templeteExample/add', param);
  },
  del: param => {
    return DEL('/api/templeteExample/delete/' + param.id);
  },
  search: param => {
    return GET('/api/templeteExample/listAllContentByType', param);
  },
  mgSearch: param => {
    return GET('/api/templeteExample/search', param);
  }
}
/**  templateLib api **/

/**  application api **/
export const applicationAPI = {
  add: param => {//创建app
    return POST('/api/app/add', param);
  },
  audit: param => {//app审核
    return POST('/api/app/auditingApp', param);
  },
  del: param => {//app删除
    return DEL('/api/app/delete/' + param.id);
  },
  search: param => {//app条件查询
    return GET('/api/app/search', param);
  },
  searchCurrentUser: param => {//获取当前用户app
    return GET('/api/app/fetchCurrentUserApps', param);
  },
  fetchAppLast30SendCount: param => {//获取app最近30日短信发送数据
    return GET('/api/app/fetchAppLast30SendCount', param);
  },
  fetchCurrentUserAppLast30SendCount: () => {//获取当前用户所有app最近30日短信发送数据
    return GET('/api/app/fetchCurrentUserAppLast30SendCount');
  },
  searchSmsSendLog: param => {//短信发送Log查询
    return GET('/api/app/searchSmsSendLog', param);
  },
  update: param => {//修改审核未通过的app
    return POST('/api/app/update', param);
  }
}
/**  application api **/

/**  sms api  **/
export const smsAPI = {
  getToken: param => {
    return GET('/api/sms/getToken', param);
  },
  sendMessage: param => {
    return POST('/api/sms/sendMessage?token='+param.token+'&phoneNum='+param.phoneNum+'&templeteId=' + param.templeteId, JSON.parse(param.params));
  }
}
/**  sms api  **/
