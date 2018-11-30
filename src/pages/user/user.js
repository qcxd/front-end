// pages/user/user.js
const app = getApp()
const apiService = require('../../service/api.service.js')
const apiServicePro = require('../../service/api/api-promisify.service')

Page({

  /**
   * Page initial data
   */
  data: {
    user: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let that = this;
    let user = {
        "province": "",
        "country": "China",
        "openid": "ab1cb22747345ce083089823f69814f4b88d569029c2ee53c4463c1b6c43ed9d",
        "language": "zh_CN",
        "avatarUrl": "//thirdwx.qlogo.cn/mmopen/u3mh9zcpXdD2yUQTt69quU1vUBmzW7q82HQq9XdTyNDZlXRs7A56iatuHSjEXRXf9MuiaryVA6DuMicUiaeyOHVvEriaVYN5uGp0t/132",
        "nickName": "A、double"
    }
    wx.setStorage({
      key: 'user',
      data: user,
      success(res) {
        console.log(res);
      }
    });

    wx.getStorage({
      key: 'user',
      success(res) {
        console.log(res.data);
        if (res.openid) {
          wx.redirectTo({
            url: '../chatbot-Success',
          });
        } else {
          wechatLogin();
        }
      },
      fail(error) {
        console.log(error);

      }
    })

  },

  wechatLogin() {
    let that = this;
    wx.login({
      success: function(data) {
        apiServicePro.getOpenid(data.code).then(result => {
          console.log('result', result);
          if (result.code === 200) {
            console.log(' result.data.openid', result.data.openid);
            that.data.user.openid = result.data.openid;
            that.setData({
              user: that.data.user
            })
          }
        }).catch(err => {
          console.log(err, 'user wechatlogin err');
        })

        // apiService.getOpenid(data.code, (err, result) => {
        //   console.log('result', result);
        //   if (result.code === 200) {
        //     console.log(' result.data.openid', result.data.openid);
        //     that.data.user.openid = result.data.openid;
        //     that.setData({
        //       user: that.data.user
        //     })
        //
        //   }
        // })
      },
      fail: function(err) {
        console.log('wx.login failed', err)
        callback(err)
      }
    })
  },
  getUserInfo(e) {
    let userInfo = e.detail.userInfo;
    console.log('userInfo', userInfo);
    userInfo.openid = this.data.user.openid;

    apiServicePro.insertUser(userInfo).then(result => {
      console.log('err', err);
      console.log('result', result);
      if (result.code === 200) {
        wx.setStorage({
          key: 'user',
          data: that.data.user,
        })
      } else {

      }
    }).catch(err => {
      console.log(err, 'user err insertUser');
    });

    // apiService.insertUser(userInfo, (err, result) => {
    //   console.log('err', err);
    //   console.log('result', result);
    //   if (result.code === 200) {
    //     wx.setStorage({
    //       key: 'user',
    //       data: that.data.user,
    //     })
    //   } else {
    //
    //   }
    // })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})