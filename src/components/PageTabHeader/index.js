import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './index.less';
const { TabPane } = Tabs;
@connect(({ global }) => ({
  tab:global.tab,
}))
export default class PageTabHeader extends PureComponent {
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
    console.log(this.getBreadcrumbProps());
  }

  componentDidUpdate(preProps) {
    const { tabActiveKey } = this.props;
  }

  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
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

  render() {
    console.log(location);
    const {
      tabList,
      className,
      tabActiveKey
    } = this.props;
    const clsString = classNames(styles.pageHeader, className);
    console.log(tabActiveKey);
    return (
      <div className={clsString}>
        {tabList &&
          tabList.length && (
            <Tabs type="editable-card"
              className={styles.tabs}
              activeKey={tabActiveKey}
              onChange={this.onChange}
              onEdit={this.handleTabRemove}
              hideAdd = {true}
            >
              {tabList.map(item => <TabPane tab={item.tab} key={item.key} />)}
            </Tabs>
          )}
      </div>
    );
  }
}