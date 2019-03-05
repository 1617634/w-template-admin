import moment from 'moment';
import { parse, stringify } from 'qs';


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export function isUrl(path) {
  return reg.test(path);
}
export function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`;
  });
}
// 
function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

 /**
 * 检测传进来的是否是一个object
 * @param {Object} obj 
 */
export function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}

export function obgParams(url, params) {
  var s = '';
  for (var key in params) {
    if (params[key] !== '') {
      s += "&" + key + "=" + encodeURIComponent(params[key]);
    }
  };
  return url.indexOf('?') >= 0 ? url + s : `${url}?${s.substr(1)}`;
}


// 函数防抖
var timer = null;
var context, args, result, timestamp;
export function debounce(func, wait, immediate) {
  var later = function () {
    var oDate = new Date();
    var last = oDate.getTime() - timestamp; // 计算第一次时间戳与当前时间戳的差值。

    if (last < wait && last >= 0) { // 在等待时间内触发此函数，重新计时。
      timer = setTimeout(later, wait - last);
    } else {
      timer = null;
      if (!immediate) { // 限制immediate 为true时，执行回调函数。
        result = func.apply(context, args);
        if (!timer) context = args = null;
      }
    }
  }
  // console.log(timestamp);
  return function () {
    // console.log('timestamp----------------eee--->', timestamp);
    var oDate = new Date();
    var callNow = immediate && !timer; // 代表第一次调用立即执行。

    timestamp = oDate.getTime(); // 记录下当前时间戳
    context = this; // 保存上下文
    args = arguments;

    if (!timer) { // 第一次触发时，timer为空，进入此分支
      timer = setTimeout(later, wait);
    }

    if (callNow) { // 第一次触发且immediate为true，进入此分支
      // console.log('第一次触发且immediate为true，进入此分支dsd');
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  }
}

export function obj2params(obj) {
  var result = '';
  var item;
  for (item in obj) {
    result += '&' + item + '=' +  (typeof obj[item] === 'object'? encodeURIComponent(JSON.stringify(obj[item])) : encodeURIComponent(obj[item]))  ;
  }
  return result ? result.slice(1) : result;
}