// pages/shopSearch/shopSearch.js
Page({

  data: {
    id: '',
  },

  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
  },

  /**搜索 */
  doSearch(e) {

  },

  /** 取消 返回店铺首页 */
  cancel() {
    // const id = this.data.id;
    // wx.navigateTo({
    //   url: `../shop/shop?id=${id}`,
    // })
    delta: 1
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