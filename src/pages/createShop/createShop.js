// pages/createShop/createShop.js
Page({
  data: {
    name: '',
    tel: '',
    country: '',
    province: 25,
    city: 405,
    area: 2719,
    introduce: '',
    address: '',
    logo: '',
    filePath: "",
    images: [],
    uploadImgs: [],
    count: 9
  },

  onLoad: function (options) {

  },

  /** 创建店铺 */
  onSubmit(e) {
    console.log(e);
  },
  /**  reset */
  formReset(e) {

  },


  chooseImage: function (e) {
    var selectPictureNum = e.target.dataset.num;
    this.setData({
      count: 9 - selectPictureNum
    })
    var that = this;
    wx.chooseImage({
      count: that.data.count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          filePath: res.tempFilePaths[0],
          images: that.data.images.concat(tempFilePaths),
          uploadImgs: res.tempFilePaths
        })
      },
    })

  },

  uploadImg: function () {
    var that = this;
    console.log(JSON.stringify(that.data.uploadImgs))
    for (var i = 0; i < that.data.uploadImgs.length; i++) {
      var filePath = that.data.uploadImgs[i];

      uploadImage(
        {
          filePath: filePath,
          dir: "images/",
          success: function (res) {
            console.log("上传成功")
            console.log("上传成功" + JSON.stringify(res))
          },
          fail: function (res) {
            console.log("上传失败")
            console.log(res)
          }
        })
    }

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