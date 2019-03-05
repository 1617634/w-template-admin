import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '../common/Authorized';
import { setAuthority } from '../common/authority';
import { message } from 'antd';
import {login} from '../common/api';
import {requestPost} from '../common/request'
import {loginRedirectUrl} from '../config/index'
export default {
  namespace: 'login',

  state: {
    user: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log(payload);
      let params;
      if(payload&&payload.type==='account') {
        params = {
          env: "DEV",
          username: payload.username,
          password: payload.password,
          captcha: payload.captcha,               
          codeKey: payload.codeKey,
          loginMode: payload.loginMode,
          appCode: "commonAdmin"
        }
      }else{
        params = {
          "env": "DEV",
          "username": payload.code,
          "password": "commonAdmin",
          "codeKey": "commonAdmin",
          "loginMode": "WORK_WE_CHAT",
          "appCode": "commonAdmin"
        }
      }
      const response = yield call(requestPost, login, params);
      console.log(response)
      if(response.code === '1'){
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("user",JSON.stringify(response.data.user));
        localStorage.setItem("permissions",JSON.stringify(response.data.permissions))
        window.location.replace(loginRedirectUrl)
      }else{
        message.error(response.desc);
        // yield put(routerRedux.push('/user/login'));
      }
    },
    *logout({ payload }, { call, put }) {
      localStorage.clear();
      // reloadAuthorized();
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
  },
};