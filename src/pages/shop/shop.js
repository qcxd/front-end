// pages/shop/shop.js

const apiServicePro = require('../../service/api/api-promisify.service');
const Utils = require('../../utils/utils');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopDetail(options.id);
  },

  doSearch() {
    console.log('search');
  },

  /**
   * 听过店铺id获取信息
   */
  getShopDetail(id) {
    apiServicePro.getShopDetail(id).then((result) => {
      if (result.code === 200) {
        this.setData({
          shopDetail: result.data
        })
      } else {
        Utils.showModal();
      }
    }, (err) => {
    })
  },

  /**
   * 加入仓库
   */
  addWherehouse(e) {
    console.log(e);
    const params = {
      id: e.currentTarget.dataset.id
    };
    apiServicePro.joinWarehouse(params).then((result) => {
      if (result.code === 200) {
        wx.showToast({
          title: '已添加',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      } else {
        Utils.showModal();
      }
    }, (err) => {
    })
  },

  /**
   * 取消加入仓库
   */
  doCancle() {
    wx.showToast({
      title: '已取消',
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