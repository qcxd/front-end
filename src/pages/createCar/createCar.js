// pages/createCar/createCar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    uploadImgs: [],
    count: 9,
  },

  onSubmit(e) {
    let that = this;
    const value = e.detail.value;
    const openid = this.data.user.openid;
    const aliyunServerURL = env.uploadImageUrl;

    utils.validateEmpty(value.name, '请输入姓名');
    utils.validateEmpty(value.phone, '请输入手机号码');
    utils.validateImages(this.data.uploadImgs, '请上传汽车照片');
    utils.validateEmpty(value.shopName, '请输入店铺名');
    utils.validateEmpty(value.address, '请输详细地址');
    utils.validatePhone(value.phone, '请输入正确的手机号');

    for (let i = 0; i < that.data.uploadImgs.length; i++) {
      let filePath = that.data.uploadImgs[i];
      console.log(that.data.uploadImgs[i]);

      uploadImage(
        {
          filePath: filePath,
          dir: `${aliyunServerURL}/images/shop/${openid}/` + filePath.replace('http://tmp/', ''),
          success: function (res) {
            console.log('res', `${aliyunServerURL}/${res}`);
            that.setData({
              qrcode: `${aliyunServerURL}/${res}`,
            }, () => {
              that.doSubmit(e);
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
    }
  },

  /** 创建汽车 */
  doSubmit(e) {
    const params = e.detail.value;
    const region = this.data.region;
    const address = {
      province: region[0],
      city: region[1],
      area: region[2],
      qrcode: this.data.qrcode, // 汽车图片数组
    }
    apiServicePro.createShop(Object.assign(address, params)).then((result) => {
      if (result.code === 200) {
        // 成功到店铺还是添加一个成功结果页面？？？
        wx.navigateTo({
          url: `../shop/shop?id=${result.data.id}`,
          // url: `../shopSuccess/shopSuccess`,
        })
      }
    })
  },
  /** reset */
  formReset(e) {

  },

  /** 选择图片 */
  chooseImage: function (e) {
    const selectPictureNum = e.target.dataset.num;
    this.setData({
      count: 99 - selectPictureNum
    })
    const that = this;
    wx.chooseImage({
      count: that.data.count, // 默认99
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          filePath: res.tempFilePaths[0],
          images: that.data.images.concat(tempFilePaths),
          // images: tempFilePaths,
          uploadImgs: res.tempFilePaths
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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