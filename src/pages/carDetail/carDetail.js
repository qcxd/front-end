// pages/carDetail/carDetail.js
const apiServicePro = require('../../service/api/api-promisify.service');
const {
  phoneCall,
  showModal,
} = require('../../utils/utils');

Page({

  data: {
    carDetail: {},
    imgUrls: [
      'https://test-buycarshop.oss-cn-beijing.aliyuncs.com/images/tmp/wxd69c8ff630f18b95.o6zAJs4dYanu890IXcPAeUhW4Ixc.HAm45WKvZ4z5830181c6b1af100ff1847db1277bf182.jpg',
      'https://test-buycarshop.oss-cn-beijing.aliyuncs.com/images/tmp/wxd69c8ff630f18b95.o6zAJs4dYanu890IXcPAeUhW4Ixc.QD0jvpmY6TFdb2541b054365b88b0bae5172f87fdcaf.jpg',
      'https://test-buycarshop.oss-cn-beijing.aliyuncs.com/images/tmp/wxd69c8ff630f18b95.o6zAJs4dYanu890IXcPAeUhW4Ixc.nh0BvXAlhxUee1a7296e6182e9e31591c468690d249a.jpg'
    ],
    currentQrcode: '',
    popWechat: false,
  },

  onLoad: function (options) {
    console.log(options);
    this.getCarDetail(options.id);
  },

  /** 汽车详情 */
  getCarDetail(id) {
    apiServicePro.getCarDetail(id).then((result) => {
      if (result) {
        this.setData({
          carDetail: result.data,
        })
      }
    })
  },

  phoneCall(e) {
    phoneCall(e);
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

  /** 加入仓库 */
  addWherehouse(e) {
    const params = {
      id: e.currentTarget.dataset.id,
      follow: e.currentTarget.dataset.follow ? false : true,
    };
    apiServicePro.joinWarehouse(params).then((result) => {
      if (result.code === 200) {
        const carDetail = this.data.carDetail;
        carDetail.isFollowCar = e.currentTarget.dataset.follow ? false : true;
        this.setData({
          carDetail,
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