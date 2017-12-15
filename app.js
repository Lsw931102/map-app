//app.js
// 服务器地址配置
let url_prefix = 'https://app.fast.wangziqing.cc'; // 线上环境
if (wx.getSystemInfoSync().platform == "devtools") {
  url_prefix = 'https://app.fast.wangziqing.cc'; // 开发环境
}
const Loading = require('utils/loading');
const oauth = require('utils/oauth');
oauth.url_prefix = url_prefix;
App({
  onLaunch: function () {
    
  },
  // 调取接口方法封装
  request: function (obj, mark) {
    // obj为传入参数，mark为loading是否显示
    oauth.request(obj, mark);
  },
  globalData: {
    userInfo: null,
    steps: [] // 线路详情
  }
})