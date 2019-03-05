import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
// import Debounce from '../../../node_modules/lodash.debounce/deb';
import { Link } from 'dva/router';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    // this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  // @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser = {},
      collapsed,
      logo,
      onMenuClick,
    } = this.props;
    const menu = (
      <Menu className={styles.menu }selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          {currentUser.userName ? (
            <Dropdown overlay={menu}>
              <span className={styles.action+' '+styles.account}>
                <span className={styles.name}>欢迎你，{currentUser.userName}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}