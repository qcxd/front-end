//app.js
App({
  onLaunch() {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getSetting({
      success: res => {
        // 获取地理位置授权信息
        this.globalData.userLocation = res.authSetting['scope.userLocation'];
        // 不再支持授权弹框
        // if (res.authSetting['scope.userInfo']) {
        //   wx.getUserInfo({
        //     success: res => {
        //       this.globalData.userInfo = res.userInfo
        //       if (this.userInfoReadyCallback) {
        //         this.userInfoReadyCallback(res)
        //       }
        //     }
        //   })
        // }
      }
    })

    // wx.getStorage({
    //   key: 'currentCity',
    //   success: function (res) {
    //     const currentCityId = _this.getCityId(res.data);
    //     _this.setData({
    //       currentCity: res.data,
    //       currentCityId,
    //     });
    //   },
    // })
  },

  globalData: {
    userInfo: null,
    userLocation: null,
    sysInfo: wx.getSystemInfoSync(),
    currentCity: '',
  }
})