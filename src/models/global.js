
export default {
  namespace: 'global',

  state: {
    collapsed: false,
    tab:{
      currentKey:'',
      tabList:[{key:'/home',tab:'首页'}]
    }
  },

  effects: {
    *fetchSetTab({ payload }, { call, put }) {
      yield put({
        type: 'setTab',
        payload: payload,
      });
    }
  },

  reducers: {
    setTab(state,action) {
      return {
        ...state,
        tab: action.payload,
      };
    }
  },

  subscriptions: {
    setup({ history }) {
      console.log(history);
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
