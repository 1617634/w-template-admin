import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Breadcrumb, Tabs,message } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import globalConfig from '../../config'
function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`;
  });
}
const { TabPane } = Tabs;
export function getBreadcrumb(breadcrumbNameMap, url) {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
}

@connect(({ global }) => ({
  tab: global.tab,
}))
export default class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    breadcrumb: null,
  };

  componentDidMount() {
    console.log(this.props);
    this.getBreadcrumbDom();
  }

  componentDidUpdate(preProps) {
    const { tabActiveKey } = this.props;
    if (preProps.tabActiveKey !== tabActiveKey) {
      this.getBreadcrumbDom();
    }
  }

  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };
  // tab 模式
  onTabChange = key => {
    const { dispatch, tab: {  tabList } } = this.props;
    dispatch({
      type: 'global/fetchSetTab',
      payload: { currentKey: key, tabList }
    });
    dispatch(routerRedux.push(key));
  };
  /**
  * 关闭tab时的回调
  */
  onTabRemove = (targetKey) => {
    const { dispatch, tab: { currentKey, tabList } } = this.props;
    // 如果关闭的是当前tab, 要激活哪个tab?
    // 首先尝试激活左边的, 再尝试激活右边的
    let nextTabKey = currentKey;
    if (currentKey === targetKey) {
      let currentTabIndex = -1;
      tabList.forEach((tab, i) => {
        if (tab.key === targetKey) {
          currentTabIndex = i;
        }
      });

      // 如果当前tab左边还有tab, 就激活左边的
      if (currentTabIndex > 0) {
        nextTabKey = tabList[currentTabIndex - 1].key;
      }
      // 否则就激活右边的tab
      else if (currentTabIndex === 0 && tabList.length > 1) {
        nextTabKey = tabList[currentTabIndex + 1].key;
      }
      // 只剩最后一个tab,跳转到首页 
    }

    // 过滤panes
    let newTabList = tabList.filter(tab => tab.key !== targetKey);
    if(newTabList.length === 0) {
      message.error('请至少保留一个tab')
      return;
    }
    if(currentKey === targetKey){
      this.onTabChange(nextTabKey);
    }
    dispatch({
      type: 'global/fetchSetTab',
      payload: { currentKey:nextTabKey, tabList:newTabList }
    });
  };

  getBreadcrumbProps = () => {
    const { routes, params, location, breadcrumbNameMap } = this.props;
    const {
      routes: croutes,
      params: cparams,
      location: clocation,
      breadcrumbNameMap: cbreadcrumbNameMap,
    } = this.context;
    return {
      routes: routes || croutes,
      params: params || cparams,
      routerLocation: location || clocation,
      breadcrumbNameMap: breadcrumbNameMap || cbreadcrumbNameMap,
    };
  };

  getBreadcrumbDom = () => {
    const breadcrumb = this.conversionBreadcrumbList();
    this.setState({
      breadcrumb,
    });
  };

  // Generated according to props
  conversionFromProps = () => {
    const { breadcrumbList, breadcrumbSeparator, linkElement = 'a' } = this.props;
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => (
          <Breadcrumb.Item key={item.title}>
            {item.href
              ? createElement(
                linkElement,
                {
                  [linkElement === 'a' ? 'href' : 'to']: item.href,
                },
                item.title
              )
              : item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { breadcrumbSeparator, linkElement = 'a' } = this.props;
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            { [linkElement === 'a' ? 'href' : 'to']: url },
            currentBreadcrumb.name
          )}
        </Breadcrumb.Item>
      ) : null;
    });
    // Add home breadcrumbs to your head
    extraBreadcrumbItems.unshift(
      <Breadcrumb.Item key="home">
        {createElement(
          linkElement,
          {
            [linkElement === 'a' ? 'href' : 'to']: '/',
          },
          '首页'
        )}
      </Breadcrumb.Item>
    );
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  };

  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    console.log(this.props);
    console.log(this.getBreadcrumbProps());
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className={styles.breadcrumb}
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  };

  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
        createElement(
          linkElement,
          {
            href: paths.join('/') || '/',
            to: paths.join('/') || '/',
          },
          route.breadcrumbName
        )
      );
  };

  render() {
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      tab, // tab模式参数
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
      rightContent
    } = this.props;
    const { breadcrumb } = this.state;
    const clsString = classNames(styles.pageHeader, className);
    const activeKeyProps = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }
    return globalConfig.tabMode.enable ? (<div className={clsString}>
      {tab && tab.tabList &&
        tab.tabList.length && (
          <Tabs type="editable-card"
            className={styles.tabs}
            activeKey={tab.currentKey}
            onChange={this.onTabChange}
            onEdit={this.onTabRemove}
            hideAdd={true}
          >
            {tab.tabList.map(item => <TabPane tab={item.tab} key={item.key} />)}
          </Tabs>
        )}
    </div>) : (
        <div className={clsString}>
          {breadcrumb}
          <div className={styles.detail}>
            {logo && <div className={styles.logo}>{logo}</div>}
            <div className={styles.main}>
              <div className={styles.row}>
                {title && <h1 className={styles.title}>{title}</h1>}
                {action && <div className={styles.action}>{action}</div>}
                {rightContent && <div className={styles.rightContent}>{rightContent}</div>}
              </div>
              <div className={styles.row}>
                {content && <div className={styles.content}>{content}</div>}
                {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
              </div>
            </div>
          </div>
          {tabList &&
            tabList.length && (
              <Tabs
                className={styles.tabs}
                {...activeKeyProps}
                onChange={this.onChange}
                tabBarExtraContent={tabBarExtraContent}
              >
                {tabList.map(item => <TabPane tab={item.tab} key={item.key} />)}
              </Tabs>
            )}
        </div>
      )
  }
}
