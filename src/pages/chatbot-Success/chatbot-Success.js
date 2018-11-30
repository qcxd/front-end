// pages/chatbot-Success/chatbot-Success.js
Page({

  data: {
    user: {},
    group: {}
  },

  onLoad: function (options) {
    let self = this;
    const group = JSON.parse(options.group);
    self.setData({
      group: group
    })
    wx.setNavigationBarTitle({
      title: 'Chat Bot',
    })
    let user = wx.getStorageSync('user');
    self.setData({
      user: user
    });
  },

  goToChat: function(e) {
    console.log('Com');
    wx.navigateTo({
      url: '../join-groups/join-groups',
    })
 
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

  }
})