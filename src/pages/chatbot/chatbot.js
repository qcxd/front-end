const app = getApp()
const apiService = require('../../service/api.service.js')
const apiServicePro = require('../../service/api/api-promisify.service');

// pages/chatbot/chatbot.js
Page({


  data: {
    user: {},
    group: {},
  },



  onLoad: function(options) {
    let user = wx.getStorageSync('user');
    if (user) {
      wx.switchTab({
        url: '../post/post',
      })
    } else {
      this.loginThroughWechat();
    }
  },


  loginThroughWechat() {
    let that = this;
    wx.login({
      success: function (data) {
        apiServicePro.getOpenid(data.code).then((result) => {
          console.log('getOpenid - --  - promisify', result);
            if (result.code === 200) {
              console.log(' result.data.openid', result.data.openid);
              that.data.user.openid = result.data.openid;
              that.setData({
                user: that.data.user
              })
            } else {
              console.log('openid error', result);
            }
        }).catch((err) => {
          console.log(err, 'getOpenId err');
        })

        // apiService.getOpenid(data.code, (err, result) => {
        //   console.log('getOpenid', result);
        //   if (result.code === 200) {
        //     console.log(' result.data.openid', result.data.openid);
        //     that.data.user.openid = result.data.openid;
        //     that.setData({
        //       user: that.data.user
        //     })
        //   } else {
        //     console.log('openid error', result);
        //   }
        // })
      },
      fail: function (err) {
        console.log('fail');
        console.log('wx.login failed', err)
        // callback(err)
      }
    })
  },

  onGotUserInfo(e) {
    let userInfo = e.detail.userInfo;
    let self = this;
    console.log('userInfo', userInfo);
    userInfo.openid = this.data.user.openid;
    if (!userInfo.openid) {
      //return error to handle
      return;
    }

    apiServicePro.insertUser(userInfo).then((result) => {
      console.log('result', result);
      if (result.code === 200) {
        let token = result.data.token;
        console.log('token',token);
        userInfo.token = token;
        self.addDeafaultGroup(userInfo);

      } else {
        console.log('insert user', result);
      }
    }).catch((err) => {
      console.log('err', err);
    });

    // apiService.insertUser(userInfo, (err, result) => {
    //   console.log('err', err);
    //   console.log('result', result);
    //   let that = this;
    //   if (result.code === 200) {
    //     let token = result.data.token;
    //     console.log('token',token);
    //     userInfo.token = token;
    //     that.addDeafaultGroup(userInfo);
    //
    //   } else {
    //     console.log('insert user', result);
    //   }
    // })
  },

  addDeafaultGroup: function (userInfo) {
    let that = this;
    const param = {
      openid: userInfo.openid,
      groups: [that.data.group]
    }

    apiServicePro.addGroups(param).then((res) => {
      console.log('addGroup', res);
      if (res.code === 200) {
        that.getWeChatUserInfo(userInfo.token);
      }
    });

    // apiService.addGroup(param, (err, res) => {
    //   console.log('addGroup', res);
    //   if (res.code === 200) {
    //     that.getWeChatUserInfo(userInfo.token);
    //   }
    // })
  },

  getWeChatUserInfo: function (token) {
    let that = this;
    apiServicePro.getUserByOpenid(this.data.user.openid).then((res) => {
      res.data.token = token;
      wx.setStorageSync('user', res.data);
      wx.navigateTo({
        url: '../chatbot-Success/chatbot-Success?group=' + JSON.stringify(that.data.group),
      });
    });

    // apiService.getUserByOpenid( this.data.user.openid, (err, res) => {
    //   res.data.token = token;
    //   wx.setStorageSync('user', res.data);
    //   wx.navigateTo({
    //     url: '../chatbot-Success/chatbot-Success?group=' + JSON.stringify(that.data.group),
    //   })
    // })
  },

  getLatestUserInfo: function () {
    // apiService.get
  },

  onReady: function() {

  },

  onShow: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})