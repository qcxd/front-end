// pages/myHome/myHome.js
const app = getApp();
const apiServicePro = require('../../service/api/api-promisify.service');
const {
  cityReplace,
  showModal,
} = require('../../utils/utils.js');

Page({
  data: {
    user: {},
    userInfo: {},
    userStatistics: {},
    pageLoaded: false,
  },

  onLoad: function (options) {
    let _this = this
    wx.getStorage({
      key: 'user',
      success: function(res) {
        _this.setData({
          user: res.data
        })
      },
    });
    this.getUserInfo();
    this.setData({
      pageLoaded: true,
    })
  },

  /** 获取用户信息（店铺信息） */
  getUserInfo() {
    apiServicePro.getUserInfo().then(result => {
      if (result) {
        const userInfo = result.data;
        this.setData({
          userInfo,
          userStatistics: userInfo.statistics,
        });
      }
    });
  },

  /** 创建店铺 */
  createShop() {
    wx.navigateTo({
      url: '../createShop/createShop',
    })
  },

  /** 创建汽车 */
  createCar() {
    const id = this.data.userInfo.Shop.id;
    wx.navigateTo({
      url: `../createCar/createCar?shopId=${id}`,
    })
  },

  /** 查看店铺 */
  goShop() {
    const id = this.data.userInfo.Shop.id;
    wx.navigateTo({
      url: `../shop/shop?id=${id}`,
    })
  },

  /** 名片 */
  goNamecard() {
    wx.navigateTo({
      url: '../nameCard/nameCard',
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
    const { pageLoaded } = this.data;
    if (pageLoaded) {
      this.getUserInfo();
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})