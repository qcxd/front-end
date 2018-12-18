
const apiServicePro = require('../../service/api/api-promisify.service');
const Utils = require('../../utils/utils');

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
    // this.getShopList({});
  },
  
  /** 店铺首页 */
  goShop(e) {
    wx.navigateTo({
      url: `../shop/shop?id=${e.currentTarget.dataset.id}`,
    })
  },

  goCarDetail() {
    wx.navigateTo({
      url: `../car-detail/car-detail`,
    })
  },

  doSearch(e) {
    const params = {
      keywords: e.detail.value
    }
    this.getShopList(params);
  },

  /** 收藏店铺 */
  followShop(e) {
    const params = {
      id: e.detail.id,
      follow: e.detail.follow ? false : true
    };
    apiServicePro.followShop(params).then((result) => {
      if (result.code === 200) {
        let sList = this.data.shopList;
        sList.forEach(el => {
          if (el.id === e.detail.id) {
            el.follow = el.follow ? false : true
          }
        });
        this.setData({
          shopList: sList
        })
        if (e.detail.follow) {
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
        Utils.showModal();
      }
    }, (err) => {
      Utils.showModal();
    })
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
      if (result.code === 200) {
        let shopList = this.data.shopList;
        if (params.id) {
          shopList = shopList.concat(result.data);
        } else {
          shopList = result.data;
        }
        this.setData({
          shopList: shopList
        })
      } else {
        Utils.showModal();
      }
    }).catch((err) => {
      Utils.showModal();
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
    this.getShopList({});
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
    const shopList = this.data.shopList;
    console.log('shopList.length', shopList.length );
    if (shopList.length % 10 === 0) {
      this.getShopList({id: shopList[shopList.length - 1].id});
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})