// pages/nameCard/nameCard.js
const apiServicePro = require('../../service/api/api-promisify.service');
const {
  showModal,
} = require('../../utils/utils');

Page({
  data: {
    userInfo: {},
    shopName: '',
    addressInfo: '',
    user: {},
  },
  
  onLoad: function (options) {
    let _this = this
    wx.getStorage({
      key: 'user',
      success: function (res) {
        console.log(res);
        _this.setData({
          user: res.data
        })
      },
    });
    if (options.openid) {
      this.getCardInfo(options.openid);
    } else {
      this.getUserInfo();
    }
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
        console.log('shareMenu share success')
        console.log('分享', res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    })
  },
  
  onShareAppMessage: function () {
    return {
      title: `${shopName}`,
      path: `/pages/nameCard/nameCard?openid=${this.data.user.openid}`,
      success: function (res) {
        console.log(res.shareTickets[0])
        // console.log
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) { console.log(res) },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },

  /** 获取用户信息（店铺信息） */
  getUserInfo(openid) {
    apiServicePro.getUserInfo(openid, '0').then(result => {
      if (result) {
        const userInfo = result.data.Shop;
        const ads = result.data.Shop.addressInfo;
        this.setData({
          userInfo,
          shopName: result.data.Shop.shopName,
          addressInfo: `${ads.province.name}${ads.city.name}${ads.area.name}${ads.detail}`,
        });
      }
    });
  },

  getCardInfo() {
    apiServicePro.getCardInfo().then(result => {
      if (result) {
        const userInfo = result.data;
        const ads = userInfo.Shop;
        this.setData({
          userInfo,
          shopName: result.data.Shop.shopName,
          addressInfo: `${ads.province}${ads.city}${ads.area}${ads.address}`,
        });
      }
    });
  },

  /** 生成图片并保存 */
  save() {
    console.log('save');
    const _this = this;
    wx.canvasToTempFilePath({
      x: 5,
      y: 40,
      width: 320,
      height: 500,
      destWidth: 320,
      destHeight: 500,
      canvasId: 'nameCard',
      success(res) {
        console.log('save canvas');
        console.log(res.tempFilePath);
        _this.saveImg(res.tempFilePath);
      }
    })
  },

  saveImg(filePath) {
    console.log('save iamge');
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success(res) {
        console.log('res', res);
         wx.showToast({
          title: '已保存到系统相册',
        })
      },
      file(err) {
        console.log('err', err);
        showModal('保存文件失败，请重试');
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

    ctx.setFillStyle('#FFFFFF');
    ctx.fillRect(0, 0, 375, 600);
    ctx.drawImage(userInfo.Shop.qrcode, 32, 80, 128, 150);
    ctx.setFillStyle('#333333');
    ctx.setTextAlign('left');
    ctx.fillText(userInfo.Shop.shopName, 42, 250);

    ctx.drawImage('../../image/icon/icon_people.png', 32, 280, 14, 12);
    ctx.setFontSize(12);
    ctx.fillText(userInfo.Shop.name, 55, 285);
    ctx.drawImage('../../image/icon/icon_call.png', 32, 300, 14, 12);
    ctx.setFontSize(12);
    ctx.fillText(userInfo.Shop.phone, 55, 305);
    ctx.drawImage('../../image/icon/icon_address.png', 32, 320, 14, 12);
    ctx.setFontSize(12);
    ctx.fillText(address, 55, 325);

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

  }
})