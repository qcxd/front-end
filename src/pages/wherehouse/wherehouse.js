// pages/wherehouse/wherehouse.js

const apiServicePro = require('../../service/api/api-promisify.service');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getShopList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopList();
  },

  getShopList() {
    apiServicePro.getShopList({}).then((result) => {
      this.setData({
        shopList: result.data,
      })
    }).catch((err) => {
      wx.showModal({
        title: '网络异常',
        content: '网络异常，请稍后再试',
      })
    })
  },

  goCarDetail() {
    wx.navigateTo({
      url: '../car-detail/car-detail',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onpulldown************');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉触底事件的处理函数************');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})