
const apiServicePro = require('../../service/api/api-promisify.service');

// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopList({});
  },
  
  goShop() {
    wx.navigateTo({
      url: '../shop/shop',
    })
  },

  goCarDetail() {
    wx.navigateTo({
      url: '../car-detail/car-datail',
    })
  },

  doCollect() {
    wx.showToast({
      title: '已收藏',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },

  doSearch() {
    console.log('search');
  },

  selectSort() {

  },

  selectArea() {

  },
  
  /**
   * 获取店铺列表
   * @param {Object} params 
   */
  getShopList(params) {
    apiServicePro.getShopList(params).then((result) => {
      let shopList = this.data.shopList;
      if (params.id) {
        shopList = shopList.concat(result.data);
      } else {
        shopList = result.data;
      }
      this.setData({
        shopList: shopList
      })
    }).catch((err) => {
      wx.showModal({
        title: '网络异常',
        content: '网络异常，请稍后再试',
      })
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
    this.getShopList({});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getShopList({id: shopList[length - 1].id});
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})