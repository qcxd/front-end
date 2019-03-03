// pages/shop/shop.js

const apiServicePro = require('../../service/api/api-promisify.service');
const {
  showModal,
  phoneCall,
} = require('../../utils/utils');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopDetail: {},
    _active: '1',
    popWechat: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopDetail(options.id);
  },
 
  /** 搜索页 */
  doSearch() {
    wx.navigateTo({
      url: '../shopSearch/shopSearch',
    })
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

  /** 加入仓库 åå*/
  addWherehouse(e) {
    const params = {
      id: e.currentTarget.dataset.id,
      follow: e.currentTarget.dataset.follow ? false : true,
    };
    apiServicePro.joinWarehouse(params).then((result) => {
      if (result.code === 200) {
        const shopDetail = this.data.shopDetail;
        shopDetail.Cars.forEach(item => {
          if (item.id === e.currentTarget.dataset.id) {
            item.isFollowCar = e.currentTarget.dataset.follow ? false : true;
          }
        })
        this.setData({
          shopDetail,
        })
        if (e.currentTarget.dataset.follow) {
          wx.showToast({
            title: '已取消',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        } else {
          wx.showToast({
            title: '已添加',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
      } else {
        showModal();
      }
    }, (err) => {
    })
  },

  phoneCall(e) {
    phoneCall(e);
  },

  goCarDetail(e) {
    wx.navigateTo({
      url: `../carDetail/carDetail?id=${e.currentTarget.dataset.id}`,
    })
  },

  /** 收藏店铺 */
  followShop(e) {
    const params = {
      id: e.currentTarget.dataset.id,
      follow: e.currentTarget.dataset.follow ? false : true
    };
    apiServicePro.followShop(params).then((result) => {
      if (result.code === 200) {
        const shopDetail = this.data.shopDetail;
        shopDetail.isFollowShop = e.currentTarget.dataset.follow ? false : true;
        this.setData({
          shopDetail,
        })
        if (e.currentTarget.dataset.follow) {
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

  /** 打开微信二维码弹框 */
  popWechat(e) {
    const currentQrcode = e.currentTarget.dataset.qrcode;
    this.setData({
      currentQrcode,
      popWechat: true
    })
  },

  /** 关闭微信二维码弹框 */
  closeWechat() {
    this.setData({
      popWechat: false
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