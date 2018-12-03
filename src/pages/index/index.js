const app = getApp()
const apiService = require('../../service/api.service.js')
const apiServicePro = require('../../service/api/api-promisify.service');

// pages/index/index.js
Page({
  data: {
    user: {},
    group: {},
    currentCity: '',
    cityArray: ['美国', '中国', '巴西', '日本'],
    popHidden: true,
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
    let that = this;
    wx.getSetting({
      success(res) {
        console.log('getSetting');        
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: "scope.userLocation",
            success() {
              console.log('首次允许，获取地理位置');              
              // 获取当前位置
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  console.log('获取地理位置成功'); 
                  that.getLocalCiry(res.latitude, res.longitude);
                }
              })
            }
          });          
        } else if (res.authSetting['scope.userLocation'] === true) {
          console.log('已允许，获取地理位置');
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              console.log('获取地理位置成功'); 
              that.getLocalCiry(res.latitude, res.longitude);
            }
          })
        }
      }
    })
  },
  
  /**
   * 获取城市
   * @param latitude 经度
   * @param longitude 纬度
   */
  getLocalCiry(latitude, longitude) {
    let that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=xsiYQN0VwrBHvxmf42BGdxFiTQgqBC4w&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) { 
        console.log('获取百度城市地理位置成功'); 
        console.log(res);
        let city = res.data.result.addressComponent.city;
        that.setData({ currentCity: city });
      },
      fail: function () {
        page.setData({ currentCity: "定位失败" });
      },
    })
  },
 
  // 
  popPicker() {
    let popHidden = this.data.popHidden;
    this.setData({
      popHidden: !popHidden,
    })
  },

  // 切换城市
  changeCity: function (e) {
    this.setData({
      currentCity: this.data.cityArray[e.detail.value],
    })
  },

  // 开始
  goHome(e) {
    this.onGotUserInfo(e);
    // 跳转到广场tabBar页
    wx.switchTab({
      url: '../home/home',
    })
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