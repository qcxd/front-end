var app = getApp()
var util = require('../../utils/util')
const apiService = require('../../service/api.service.js')
const apiServicePro = require('../../service/api/api-promisify.service')

// console.log(JSON)
Page({
  data: {
    list: null,
    modalHidden: true,
    hidden: true,
    toast1Hidden: true,
    notificationCount: 1
  },
  onReady: function () {
    let that = this;
    apiServicePro.getAllUsers().then((result) => {
      console.log('result', result);
      that.setData({ list: result.data})
    }).catch(err => {
      console.log(err, 'chatlist err getAllUsers')
    })
    // apiService.getAllUsers( (err, result) => {
    //   console.log('err', err);
    //   console.log('result', result);
    //   this.setData({ list: result.data})
    // })
  },
  modalTap: function (e) {
    this.setData({
      modalHidden: false
    })
  },
  goToChat: function (e) {
    console.log('hello world',e);
    wx.navigateTo({
      url: '../chat/chat?openid=' + e.currentTarget.dataset.id,
    })
  },
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },
  goPage: function (e) {
    console.log(e)
    var _self = this;
    var newlist = _self.data.list
    var index = e.currentTarget.dataset.index
    newlist[index].count = 0;
    _self.setData({
      list: newlist
    })
    // console.log(e.currentTarget.dataset.index)
    // console.log(e.target.dataset.name)
    wx.navigateTo({
      url: '../message/message?name=' + e.currentTarget.dataset.name + "&id=" + e.currentTarget.dataset.id
    })
    // console.log(test);
  },
  toast1Change: function () {
    this.setData({
      toast1Hidden: true
    })
  },
  onPullDownRefresh: function () {

    util.getUser(this);

  }
})
