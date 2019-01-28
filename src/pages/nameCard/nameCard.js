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
        const userInfo = result.data;
        const addressInfo = userInfo.Shop.addressInfo;
        this.setData({
          userInfo,
          addressInfo,
        }, () => {
            this.createCanvas();
        });
      }
    });
  },

  /** 生成图片并保存 */
  save() {
    console.log('save');
    wx.canvasToTempFilePath({
      x: 0,
      y: 40,
      width: 375,
      height: 600,
      destWidth: 300,
      destHeight: 500,
      canvasId: 'nameCard',
      success(res) {
        console.log('save canvas');
        console.log(res.tempFilePath)
      }
    })
  },

  /** 绘制canvas */
  createCanvas() {
    const {
      userInfo
    } = this.data;
    const province = userInfo.Shop.addressInfo.province.name;
    const city = userInfo.Shop.addressInfo.city.name;
    const area = userInfo.Shop.addressInfo.area.name;
    const detail = userInfo.Shop.addressInfo.detail;
    const address = `${province} ${city} ${area} ${detail}`;
    console.log('canvas');
    const ctx = wx.createCanvasContext('nameCard');
    ctx.drawImage(userInfo.Shop.qrcode, 132, 80, 128, 150);
    
    ctx.setFillStyle('#333333');
    ctx.setTextAlign('left');
    ctx.fillText(userInfo.Shop.shopName, 142, 250);

    ctx.drawImage('../../image/icon/icon_people.png', 32, 300, 16, 15);
    ctx.setFontSize(14);
    ctx.fillText(userInfo.Shop.name, 55, 313);
    ctx.drawImage('../../image/icon/icon_call.png', 32, 320, 16, 15);
    ctx.setFontSize(14);
    ctx.fillText(userInfo.Shop.phone, 55, 333);
    ctx.drawImage('../../image/icon/icon_address.png', 32, 340, 16, 15);
    ctx.setFontSize(14);
    ctx.fillText(address, 55, 353);

    ctx.draw(); // 必须添加才能绘制
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