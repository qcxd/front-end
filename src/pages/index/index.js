// pages/index/index.js

const app = getApp()
const apiService = require('../../service/api.service.js')
const apiServicePro = require('../../service/api/api-promisify.service');

Page({
  data: {
    user: {},
    group: {},
    currentCity: '',
    selectValue: '',
    cityList: [],
    popHidden: true,
  },

  onLoad: function(options) {
    let user = wx.getStorageSync('user');
    if (user) {
      wx.switchTab({
        url: '../post/post',
      })
    } else {
      this.loginThroughWechat();
    }
    let that = this;
    if (app.globalData.userLocation) {
      wx.showLoading({
        title: '定位中',
      })
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          that.getLocalCity(res.latitude, res.longitude);
        }
      })
    }

    // 获取城市数据
    this.getCityList();
  },

  dealWithCity() {
    let that = this
    wx.authorize({
      scope: "scope.userLocation",
      success() {
        // 获取当前位置
        wx.showLoading({
          title: '定位中',
        })
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            app.globalData.userLocation = true;
            that.getLocalCity(res.latitude, res.longitude);
          },
          fail(res) {
            that.setData({
              currentCity: "定位失败"
            });
          }
        })
      }
    });
  },

  /**
   * 获取城市
   * @param latitude 经度
   * @param longitude 纬度
   */
  getLocalCity(latitude, longitude) {
    let that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=xsiYQN0VwrBHvxmf42BGdxFiTQgqBC4w&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res);
        let city = res.data.result.addressComponent.city;
        that.setData({
          currentCity: city
        });
        wx.hideLoading();
      },
      fail: function() {
        that.setData({
          currentCity: "定位失败"
        });
        wx.hideLoading();
      },
    })
  },

  // 控制picker
  popPicker() {
    let popHidden = this.data.popHidden;
    this.setData({
      popHidden: !popHidden,
    })
  },

  // 切换城市
  changeCity: function(e) {
    const val = e.detail.value
    this.setData({
      selectValue: this.data.provinceArray[val[0]].name + this.data.cityList[val[1]].name,
    })
    this.getCityList(this.data.provinceArray[val[0]].id);
  },

  // 开始
  goHome(e) {
    this.onGotUserInfo(e);
    // 跳转到广场tabBar页
    wx.switchTab({
      url: '../home/home',
    });
  },

  onGotUserInfo(e) {
    let userInfo = e.detail.userInfo;
    userInfo.openid = this.data.user.openid;
    app.globalData.userInfo = e.detail.userInfo;
    if (!userInfo.openid) {
      return;
    }
    apiServicePro.insertUser(userInfo).then((result) => {
      if (result.code === 200) {
        userInfo.token = result.data.token;
        wx.setStorage({
          key: "token",
          data: result.data.token
        })
      } else {
      }
    }).catch((err) => {
    });
  },

  loginThroughWechat() {
    let that = this;
    wx.login({
      success: function(data) {
        apiServicePro.getOpenid(data.code).then((result) => {
          if (result.code === 200) {
            that.dealWithCity()
            that.data.user.openid = result.data.openid;
            that.setData({
              user: that.data.user
            })
          } else {
          }
        }).catch((err) => {
        })
      },
      fail: function(err) {
        console.log('fail');
        console.log('wx.login failed', err)
      }
    })
  },

  getCityList() {
    apiServicePro.getCityList({}).then((result) => {
      if (result.code === 200) {
        this.setData({
          cityList: result.data,
        })
      } else {}
    }).catch((err) => {
      wx.showModal({
        title: '网络异常',
        content: '网络异常，请稍后再试',
      })
    })
  },

  popEnsure() {
    const selectValue = this.data.selectValue;
    this.setData({
      currentCity: selectValue,
    })
    let popHidden = this.data.popHidden;
    this.setData({
      popHidden: !popHidden,
    })
  },

  popCancle() {
    let popHidden = this.data.popHidden;
    this.setData({
      popHidden: !popHidden,
    })
  },

  /** 选择城市 */
  doSelect(e) {
    if (e.detail.name) {
      this.setData({
        popHidden: true,
        currentCity: e.detail.name
      })
    } else {  // 取消按钮
      this.setData({
        popHidden: true,
      })
    }
  },

  /** 取消选择城市 */
  doCancle() {
    this.setData({
      popHidden: true,
    })
  },

  onReady: function() {

  },

  onShow: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})