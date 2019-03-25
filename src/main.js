// MAIN
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import store from './store/store'
import router from './router/router'
import ElementUI from 'element-ui'
import {Message} from 'element-ui'
import es6Promise from 'es6-promise';//ie promise兼容
import axios from 'axios'
import {constant} from "./common/constant";
/*import NProgress from 'nprogress'
import 'nprogress/nprogress.css'*/
import 'element-ui/lib/theme-chalk/index.css'
import './style/common.css'
import './style/iconfont.css'
import './style/main.scss'

Vue.config.productionTip = false;
/*Vue.config.devtools = false;*/

es6Promise.polyfill();
Vue.prototype.$message = Message;
Vue.prototype.$axios = axios;
Vue.prototype.$constant = constant;
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  if(to.name === 'login' || to.name === 'loginFME'){
    next();
  }else{
    const userGet = store.getters.userCurrent;
    let sessionAuth = false;
    if(sessionStorage.getItem('routerAuth')){//当前路由path等于sessionStorage routerAuth, 说明是需要auth的
      let auth = JSON.parse(sessionStorage.getItem('routerAuth')).pathArr;
      sessionAuth = auth.indexOf(to.path) === -1 ? false : true;
    }
    if(to.meta.auth || sessionAuth){//如果存在meta auth
      if(userGet){//是否存在current login user
        if (store.getters.accessArr.length === 0) {//是否获取过权限列表
          store.dispatch('user/getAccess').then(res => {
            store.dispatch('permission/createNewRouter', res).then(() => {
              router.addRoutes(store.getters.willAddRouter);
              next(to.path); // hack
            });
          }).catch(error => {
            console.log(error);
          });
        } else {
          next();
        }
      }else{
        store.dispatch('user/getLoginUser').then(res => {//不存在current login user，则尝试去获取
          if(res){
            next(to.path);
          }else{
            if(sessionStorage.getItem('UT') == constant.manage){
              next({name: 'loginFME', params: {}});
            }else{
              next({name: 'login', params: {}});
            }
            sessionStorage.removeItem('UT');
          }
        }).catch(error => {
          console.log(error);
        });
      }
    }else{
      next();
    }
  }
});
router.afterEach((to) => {
  if(to.meta.hasOwnProperty('auth')){//动态路由刷新后 meta字段信息丢失，用sessionStorage存储
    if(sessionStorage.getItem('routerAuth')){
      let newPathJson = JSON.parse(sessionStorage.getItem('routerAuth'));
      if(newPathJson.pathArr.indexOf(to.path) === -1){
        newPathJson.pathArr.push(to.path);
        sessionStorage.setItem('routerAuth', JSON.stringify(newPathJson));
      }
    }else{
      let pathArr = [to.path];
      let pathArrJson = {
        pathArr: pathArr
      };
      sessionStorage.setItem('routerAuth', JSON.stringify(pathArrJson));
    }
  }
});

/* VUE APP START */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
