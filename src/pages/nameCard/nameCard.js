// pages/nameCard/nameCard.js
const apiServicePro = require('../../service/api/api-promisify.service');

Page({
  data: {
    userInfo: {},
  },

  onLoad: function (options) {
    this.getUserInfo();
  },

  /** 获取用户信息（店铺信息） */
  getUserInfo() {
    apiServicePro.getUserInfo().then(result => {
      if (result) {
        const qrcode = result.data.Shop.qrcode;
        const userInfo = result.data;
        userInfo.Shop.qrcode = `http://${qrcode}`;
        const addressInfo = userInfo.Shop.addressInfo;
        this.setData({
          userInfo,
          addressInfo,
        });
        console.log(userInfo);
      }
    });
  },

  /** 生成图片并保存 */
  save() {
    
  },

  /** 绘制canvas */
  createCanvas() {
    const ctx = wx.createCanvasContext('nameCard');
    ctx.drawImage(userInfo.Shop.qrcode, 140, 25, 128, 34);
    ctx.setTextAlign('left');
    ctx.setFillStyle('#bbbbbb')
    ctx.fillText(userInfo.Shop.shopName, 70, 270);
  },

  /** 分享页面 */
  share() {

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