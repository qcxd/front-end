// pages/wherehouse/wherehouse.js

const apiServicePro = require('../../service/api/api-promisify.service');
const {
  showModal,
} = require('../../utils/utils');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    _active: '1', // 1 店铺 2 汽车
    shopList: [],
    carList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getWarehouseList({});
  },

  tabSwitch(e) {
    const index =  e.currentTarget.dataset.index;
    this.setData({
      _active: index
    })
  },

  /**
   * 获取仓库列表
   * @param {Object} params 
   */
  getWarehouseList(params) {
    apiServicePro.getWarehouseList(params).then((result) => {
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
        showModal();
      }
    }).catch((err) => {
      showModal();
    })
  },

  goCarDetail() {
    wx.navigateTo({
      url: '../car-detail/car-detail',
    })
  },

  phoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: '1340000'
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
    this.getWarehouseList({});
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
    this.getWarehouseList({});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const shopList = this.data.shopList;
    console.log('shopList.length', shopList.length );
    if (shopList.length % 10 === 0) {
      this.getWarehouseList({id: shopList[shopList.length - 1].id});
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})