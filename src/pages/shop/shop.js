// pages/shop/shop.js

const apiServicePro = require('../../service/api/api-promisify.service');
const {
  showModal,
} = require('../../utils/utils');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopDetail: {},
    _active: '1',
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

  tabSwitch(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      _active: index,
    })
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
        showModal();
      }
    }, (err) => {
    })
  },

  /**
   * 加入仓库
   */
  addWherehouse(e) {
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
        showModal();
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

  phoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: '1340000'
    })
  },

  goCarDetail() {
    wx.navigateTo({
      url: '../car-detail/car-detail',
    })
  },

  /** 收藏店铺 */
  followShop(e) {
    const params = {
      id: e.currentTarget.dataset.id,
      follow: e.currentTarget.dataset.isFollowShop ? false : true
    };
    apiServicePro.isFollowShopShop(params).then((result) => {
      if (result.code === 200) {
        const shopDetail = this.data.shopDetail;
        shopDetail.isFollowShop = e.currentTarget.dataset.isFollowShop ? false : true;
        this.setData({
          shopDetail,
        })
        if (e.currentTarget.dataset.isFollowShop) {
          wx.showToast({
            title: '已取消收藏',
            icon: 'succes'
          })
        } else {
          wx.showToast({
            title: '已收藏',
            icon: 'succes'
          })
        }
      } else {
        showModal();
      }
    }, (err) => {
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