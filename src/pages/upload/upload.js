// pages/upload/upload.js
let index, isConnected;
Page({

  data: {
    isConnect: false,
    user: {}
  },

  
  onLoad: function (options) {
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({ user: res.userInfo });
      }
    })
    isConnected = options.isConnected;
    index = options.index;
  },

  onReady: function () {
  
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  },
  
  uploaded: function (e) {
    console.log(e);
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    prePage.pushMessage({
      id: 'm' + index++,
      type: 4, // voice
      nickName: this.data.user.nickName,
      avatarUrl: this.data.user.avatarUrl,
      content: e.detail.data[0],
      sent: isConnected
    });
  },

})