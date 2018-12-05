//app.js
App({
  onLaunch() {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.login({
      success: res => {
      }
    })
    wx.getSetting({
      success: res => {
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
  },
  globalData: {
    userInfo: null,
    userLocation: null,
    sysInfo: wx.getSystemInfoSync()
  }
})