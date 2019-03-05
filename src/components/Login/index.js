import React, { Component } from 'react'; // 引入了React
import styles from './index.less';
import configBase from '../../config';
import { connect } from 'dva';
import { captcha } from '../../common/api';
import { requestPost } from '../../common/request';
import { getPageQuery } from '../../common/utils'
import { Spin, Form, Input, Button, message, Tabs, Icon, Row, Col, Radio } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let isMounted = false; // 判断组件是否已经卸载，防止组件卸载后使用setState报Warning
@Form.create()
/* 以类的方式创建一个组件 */
@connect(({ login }) => ({
  login,
}))
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordDirty: false,
      loginBtnText: '登录',
      activeTabKey: '1',
      // 验证码
      showFlag: true,
      captchaSrc: '',
      codeKey: ''
    };
  }
  componentDidMount() {
    // let code = getPageQuery().code;
    // if (code) {
    //   this.props.dispatch({
    //     type: 'login/login',
    //     payload: {
    //       code,
    //       type: 'qrcode'
    //     },
    //   });
    // }
    // 初始化数据
    isMounted = false;
    // if (window.WwLogin) {
    //   window.WwLogin({
    //     "id": "wx_reg",
    //     "appid": "wwcfb3281893c3dd1e",
    //     "agentid": "1000019",
    //     "redirect_uri": 'http://127.0.0.1:8888',
    //     "state": "code",
    //     "href": "",
    //   });
    // }
    this.renderImg();
  }
  componentWillUnmount() {
    isMounted = true;
  }
  handleSubmit = (e) => { // 登录
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let loginParams = { // 登录参数
          username: values.username,
          password: values.password,
          captcha: values.captcha,
          loginMode: values.loginMode,
          codeKey: this.state.codeKey,
          type: 'account'
        };
        console.log(loginParams);
        await dispatch({
          type: 'login/login',
          payload: loginParams
        });
        if (!isMounted) {
          console.log('here');
          this.renderImg();
        }

      }
    });

  }
  tabChange = key => {
    this.setState({ activeTabKey: key });
  }
  renderImg = () => {
    requestPost(captcha, { width: 145, height: 40 }).then(res => {
      console.log(res);
      if (res && res.code == 1) {
        this.setState({ captchaSrc: res.data && res.data.captcha, codeKey: res.data && res.data.codeKey });
      }
    }).catch(err => {
      console.log(err);
    })
  }
  render() {
    const { captchaSrc, activeTabKey, showFlag } = this.state;
    const { form } = this.props;
    const getFieldDecorator = form.getFieldDecorator;
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <div className={styles.loginLogo}>
            <img src={configBase.logo} />
            {configBase.projectName}
          </div>
          <Tabs onChange={this.tabChange}>
            {/* <TabPane tab={<span><Icon type="qrcode" />二维码登录</span>} key="1">
              <div id='wx_reg' style={{ width: '300px', margin: '10px auto' }}></div>
            </TabPane> */}
            <TabPane tab={<span><Icon type="idcard" />账号登录</span>} key="2">
              <Form onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('username', { initialValue: '', rules: [{ required: true, message: '请输入用户名' }] })(
                    <Input size="large" placeholder="用户名" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', { rules: [{ required: true, message: '请输入密码' }] })(
                    <Input size="large" type="password" placeholder="密码" />
                  )}
                </FormItem>
                <Row>
                  <Col span={13}>
                    <FormItem>
                      {getFieldDecorator('captcha', { rules: [{ required: true, message: '请输入密码' }] })(
                        <Input size="large" placeholder="验证码" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={1}>
                  </Col>
                  <Col span={10}>
                    {showFlag && activeTabKey == '2' ? <img onClick={this.renderImg} style={{cursor:'pointer'}} src={'data:image/png;base64,' + captchaSrc} /> : (<div></div>)}
                  </Col>
                  {/* <Col span={24}>
                    <FormItem label="登录方式" style={{textAlign:"left"}} labelCol={{span:8}} wrapperCol={{span:16}} >
                      {getFieldDecorator('loginMode', { rules: [{ required: true, message: '请输入选择登录方式' }],initialValue:'ACCOUNT' })(
                        <RadioGroup>
                          <Radio value='ACCOUNT'>普通登录</Radio>
                          <Radio value='LDAP'>LDAP登录</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col> */}
                </Row>
                <FormItem>
                  <Button type="primary" htmlType="submit" size="large" >登录</Button>
                </FormItem>
                {/* <div className={styles.loginAccount}>
                  <span>账号：admin</span>
                  <span>密码：123456</span>
                </div> */}
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
