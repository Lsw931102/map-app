const Loading = require('./loading');

var globalData = {
  reconsume: 5,
  userInfo: null,
  oauth: {
    sign: null,
    token: null
  }
}
var oauthData = wx.getStorageSync('oauth')

if (oauthData) {
  globalData.oauth = oauthData;
}


function check(res, cb, fail) {
  if ((res.data.code === 1000000016 || res.data.code == 1000000051 ||
    res.data.code === 1000000054 || res.data.code === 1000000051) && globalData.reconsume > 0) {
    typeof cb == "function" && cb(res);
  } else {
    typeof fail == "function" && fail(res);
  }
}


var exports = module.exports = {
  url_prefix:'',
  request: function (obj, mark) {

    if (!obj.notShowLoad) {
      Loading.perform();
    }
    exports.oauth((data) => {
      var header = obj.header ? obj.header : {};
      console.log(encodeURI(data.sign.rawData))
      header.rawData = encodeURI(data.sign.rawData);
      header.signature = data.sign.signature;
      header.accessToken = data.token.accessToken
      wx.request({
        url: `${exports.url_prefix}${obj.url}`,
        data: obj.data,
        method: obj.method,
        header: header,
        success: function (res) {
          if (res.statusCode === 400) {
            check(res, function () {
              wx.removeStorageSync('oauth')
              globalData.oauth.token = null;
              globalData.oauth.sign = null;
              globalData.reconsume--;
              obj.notShowLoad = true;
              exports.request(obj, true);
            }, function () {
              if (!obj.notShowLoad || mark) {
                Loading.cancel();
              }
              wx.showToast({
                title: res.data.message,
                image: '/common/error.png',
                mask: true,
                duration: 2000
              })
            })
          } else {
            if (!obj.notShowLoad || mark) {
              Loading.cancel();
            }
            typeof obj.success == "function" && obj.success(res);
          }
        },
        fail: function () {
          if (!obj.notShowLoad) {
            Loading.cancel();
          }
        }
      })
    }, () => {
      if (!obj.notShowLoad) {
        Loading.cancel();
      }
    })
  },

  oauth: function (cb, fail) {
    wx.checkSession({
      success: function () {
        if (globalData.oauth.token && globalData.oauth.sign) {
          var currentTime = new Date().getTime()
          if (currentTime >= globalData.oauth.token.expiredAt - 1000 * 60 * 2) {
            wx.removeStorageSync('oauth')
            globalData.oauth.token = null;
            globalData.oauth.sign = null;

            exports.login(cb, fail);
          } else {
          
            typeof cb == "function" && cb(globalData.oauth);
          }
        } else {
          exports.login(cb, fail);
        }
      },
      fail: function () {
        exports.login(cb, fail);
      }
    })
  },
  getUserInfo: function (cb, fail) {
    if (globalData.userInfo && globalData.oauth.sign) {
      typeof cb == "function" && cb(globalData.userInfo, globalData.oauth.sign)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          globalData.userInfo = res.userInfo
          globalData.oauth.sign = {
            encryptedData: res.encryptedData,
            rawData: res.rawData,
            signature: res.signature,
            iv: res.iv
          };
          typeof cb == "function" && cb(globalData.userInfo, globalData.oauth.sign)
        },
        fail: function () {
          typeof fail == "function" && fail();
        }
      })
    }
  },

  login: function (cb, fail) {
    wx.login({
      success: function (loginRes) {
        if (loginRes.code) {
          exports.getUserInfo(function (userInfo, sign) {
            wx.request({
              url: `${exports.url_prefix}/oauth/access_token`,
              method: 'POST',
              data: {
                code: loginRes.code,
                encryptedData: sign.encryptedData,
                iv: sign.iv
              },

              success: function (res) {
                if (res.statusCode === 400) {
                  check(res, function () {
                    wx.removeStorageSync('oauth')
                    globalData.oauth.token = null;
                    globalData.oauth.sign = null;
                    globalData.reconsume--;
                    login(cb, fail)
                  }, function () {
                    wx.showToast({
                      title: res.data.message,
                      image: '/common/error.png',
                      mask: true,
                      duration: 2000
                    })
                  })

                } else {
                  globalData.oauth.token = res.data;
                  console.log(globalData.oauth);
                  wx.setStorageSync('oauth', globalData.oauth)
                  typeof cb == "function" && cb(globalData.oauth);
                }
              },
              fail: function (x) {
                typeof fail == "function" && fail();
              }
            })
          }, function () {
            typeof fail == "function" && fail();
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
          typeof fail == "function" && fail();
        }
      },
      fail: function () {
        console.log('login fail');
        typeof fail == "function" && fail();
      }
    });
  },
}

