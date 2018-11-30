const apiService = require('../../service/api.service.js');
const apiServicePro = require('../../service/api/api-promisify.service');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwc_groups: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    const user = wx.getStorageSync('user');
    that.requestGroups(user.openid);
  },

  requestGroups: function(openid) {
    let self = this;

    apiServicePro.groupNotJoin(openid).then((res) => {
      const groups = res.data.map((group) => {
        group.joined = true;
        return group;
      })
      self.setData({
        pwc_groups: groups,
      })
    }).catch((error) => {
      console.log(error, '- - - join group');
    })

    // apiService.groupNotJoin(openid, function (error, res) {
    //   const groups = res.data.map((group) => {
    //     group.joined = true;
    //     return group;
    //   })
    //   self.setData({
    //     pwc_groups: groups,
    //   })
    // });
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

  },

  joinAll: function (event) {
    var that = this;
    that.data.pwc_groups.forEach(function (item, index) {
      console.log(item, index);
      that.setData({
        ['pwc_groups[' + index + '].joined']: true
      });
    });
  },


  selectGroup: function (e) {
    var that = this;
    //修改小图标的逻辑
    var index = e.currentTarget.dataset.index;
    var joined = 'pwc_groups[' + index + '].joined';
    that.setData({
      [joined]: !that.data.pwc_groups[index].joined
    })

    console.log(e, this);
  },

  chooseItem: function (index) {
    var that = this;
    var joined = 'pwc_groups[' + index + '].joined';
    that.setData({
      [joined]: true
    })
  },

  goToChat: function() {
    const user = wx.getStorageSync('user');
    let that = this;
    const group = that.data.pwc_groups.filter((group) => {
      return group.joined
    });
    console.log(group);
    console.log(user);
    const param = {
      openid: user.openid,
      groups: group
    }
    if (group.length > 0) {
      // apiService.addGroup(param, (err, res) => {
      //   wx.switchTab({
      //     url: '../post/post',
      //   })
      // })

      apiServicePro.addGroups(param).then(res => {
        wx.switchTab({
          url: '../post/post',
        })
      }).catch((error) => {
        console.log(error, '- - - addgroups')
      })
    } else {
      wx.switchTab({
        url: '../post/post',
      })
    }
    
  }
})