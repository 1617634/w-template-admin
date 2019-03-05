import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Breadcrumb, Icon } from 'antd';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import './BasicLayout.less';
import { connect } from 'dva';
import SiderMenu from '../components/SideMenu';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter'
import config from '../config';
import { getMenuData } from '../config/menu';
import { getRoutes } from '../common/utils';
import Authorized from '../common/Authorized';
const { Header, Content, Footer } = Layout;
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};
@connect(({ login }) => ({
  currentUser: login.user,
}))
export default class BasicLayout extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    collapsed: false,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
  componentWillMount() {
    // this.props.dispatch()
    // if (!localStorage.getItem('token')) {
    //   this.props.dispatch({
    //     type: 'login/logout',
    //   });
    // }

    if(!localStorage.permissions){
      localStorage.setItem("permissions", JSON.stringify([
        {
          "name":"商城管理",
          "code":"goods-manager",
          "menuVo":[
            {
              "name":"商品",
              "path":"goods",
              "children":[
                {
                  "name":"商品列表",
                  "path":"goods-list",
                },
                {
                  "name":"分类管理",
                  "path":"classify",
                },
                {
                  "name":"价格模板",
                  "path":"price-tmpl",
                },
                {
                  "name":"运费模板",
                  "path":"fare-tmpl",
                },
                {
                  "name":"服务标签",
                  "path":"service-label",
                },
                {
                  "name":"批量修改",
                  "path":"batch-modify",
                },
              ],
            },
            {
              "name":"优惠",
              "path":"discount",
              "children":[
                {
                  "name":"优惠劵",
                  "path":"coupon",
                },
                {
                  "name":"满件促销",
                  "path":"sales-promotion",
                },
                {
                  "name":"限时特价",
                  "path":"activity",
                }
              ]
            },
          ]
        },
        {
          "name":"平台管理",
          "code":"platform-manager",
          "menuVo":[
            {
              "name":"运营",
              "path":"operate",
              "children":[
                {
                  "name":"banner",
                  "path":"banner",
                },
                {
                  "name":"入口",
                  "path":"entry",
                },
                {
                  "name":"商品专题",
                  "path":"special",
                },
                {
                  "name":"商城图片组合",
                  "path":"group",
                },
                {
                  "name":"H5商品列表",
                  "path":"h5-url",
                },
              ],
            },
            {
              "name":"设置",
              "path":"setting",
              "children":[
                {
                  "name":"商城模块设置",
                  "path":"module",
                },
                {
                  "name":"基础设置",
                  "path":"basics",
                }
              ],
            },
          ]
        }
      ]))
      location.reload()
    }
  }
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };
  render = () => {
    const user = JSON.parse(localStorage.getItem("user")) || { realName: '请登录' };
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SiderMenu
          collapsible
          collapsed={this.state.collapsed}
          location={this.props.location}
          onCollapse={this.onCollapse}
          menuData={getMenuData()}
          Authorized={Authorized}
          logo={config.logo}
        />
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <GlobalHeader
              logo={config.logo}
              currentUser={{ userName: user.realName }}
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(this.props.match.path, this.props.routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                // authority={item.authority}
                // redirectPath="/exception/403"
                />
              ))}
              {/* <Redirect exact from="/" to={bashRedirect} /> */}
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <GlobalFooter
              links={[
                {
                  key: '文档',
                  title: '文档',
                  href: 'http://ant.design',
                  blankTarget: true,
                },
                {
                  key: 'ww',
                  title: 'ww',
                  href: 'https://www.baidu.com',
                  blankTarget: true,
                },
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2018 {config.projectName}
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
