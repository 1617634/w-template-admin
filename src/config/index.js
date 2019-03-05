/**
 * 定义整个项目的全局配置
 */

'use strict';
// 约定优于配置
// 我可以提供尽量多的配置, 但尽量不要太个性化, 接口的路径/名称/格式之类的
// 遵循统一的规范, 好维护, 交给其他人也比较简单
import logo from "../assets/1.png";
module.exports = {
  projectName: '管理后台',  // 项目的名字
  debug: true, //debug模式
  logo: logo, // 项目logo
  tabMode: {  // tab模式相关配置
    enable: false,  // 是否开启tab模式
  },
  loginRedirectUrl:'/#/home'
};