
const app = getApp();
const apiServicePro = require('../../service/api/api-promisify.service');
const {
  cityReplace,
  showModal,
} = require('../../utils/utils.js');

Page({
  data: {
    user: {},
    group: {},
    currentCity: '',
    selectValue: '',
    cityList: [],
    popHidden: true,
  },

  onLoad: function (options) {
    setTimeout(() => {
      wx.switchTab({
        url: '../home/home',
      })
    }, 3000)
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})