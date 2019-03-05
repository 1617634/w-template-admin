import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import store from '..';
import { obgParams, isPlainObject } from './utils';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const SERVE_HOME = 'http://10.0.12.25:13002';
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  if(response.status == 401){
    const {dispatch} = store;
    dispatch(routerRedux.push('/user/login'));
  }
  throw error;
}
import {debounce} from './utils';
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // const serve = SERVE_HOME+url;
  const serve = url;
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  console.log((newOptions.body instanceof FormData))
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        loginName: localStorage.getItem('username') || '',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  } else {
    newOptions.headers = {
      Accept: 'application/json',
      loginName: localStorage.getItem('username') || '',
      ...newOptions.headers,
    };
  }
  return fetch(serve, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    }).then(res => {
      const { dispatch } = store;
      if (res.code == -1) {
        debounce(() => { message.error(res.desc) }, 500, true)();
        localStorage.clear();
        dispatch(routerRedux.push('/user/login'));
        return false
      }
      return res
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        // dispatch({
        //   type: 'login/logout',
        // });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      // if (status >= 404 && status < 422) {
      //   dispatch(routerRedux.push('/exception/404'));
      // }
    });
}
export function requestGet(url, body) {
  url = body ? obgParams(url, body) : url
  return request(url, { method: 'GET' })
}
export function requestDelete(url, body) {
  return request(url, { method: 'DELETE', body })
}
export function requestPost(url, body) {
  var s = {}
  if (isPlainObject(body)) {
    for (let i in body) {
      if (body[i] !== '') {
        s[i] = body[i]
      }
    }
  } else {
    s = body
  }

  // let newBody = body ? deleteObgEntry(body):{};
  return request(url, { method: 'POST', body: s })
}
export function requestPatch(url, body) {
  return request(url, { method: 'PATCH', body })
}
export function requestPut(url, body) {
  return request(url, { method: 'PUT', body })
}