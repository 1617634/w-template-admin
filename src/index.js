import dva from 'dva';
import createHistory from 'history/createHashHistory';
// import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';
import './index.less'
// hot-reload
if (module.hot) {
    module.hot.accept();
}
const app = dva({
    history: createHistory(),
});
// 3. Register global model
app.model(require('./models/global').default);
// 4. Router
app.router(require('./router').default);

app.start('#root');

export default app._store; // eslint-disable-line