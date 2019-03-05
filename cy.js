
export default {
  scene: [
    ["w-scene-react", {
      antd: true,
    }]
  ],
  entry: {
    app: './src/index.js'
  },
  html: {
    filename: './index.html',
    template : 'index.ejs',
    inject   : true,
    chunks: ['app']
  },
  outputPath: 'dist',//打包之后的目录
  chainWebpack(config, webpack) {
    
    
  },
  disableCSSModules: false,//默认false
  proxy: {
    // '/ops': {target: 'http://baidu.com', changeOrigin: true},
  },
  hash: true,
  dll: {
    switch: true,
    dllName: 'wangwei',
    pkg: ['react', 'react-dom', 'react-router-dom', 'react-loadable']
  },
  mock: true
}