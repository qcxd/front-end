
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
    hasStorage: false,
  },

  onLoad: function (options) {
    let _this = this;
    wx.getStorageInfo({
      success(res) {
        if (res.keys.indexOf('user') !== -1 &&
          res.keys.indexOf('currentCity') !== -1) {
          // wx.navigateTo({
          //   url: '../loading/loading',
          // })
          _this.setData({
            hasStorage: true
          })
          setTimeout(() => {
            wx.switchTab({
              url: '../home/home',
            })
          }, 2000);
        } else {
          _this.getOpenid();
          _this.getCityList();
          if (app.globalData.userLocation) {
            wx.showLoading({
              title: '定位中',
            })
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                _this.getLocalCity(res.latitude, res.longitude);
              }
            })
          } else {
            _this.getWeChatCity();
          }
        }
      }
    })
  },

  getOpenid() {
    let _this = this;
    wx.login({
      success: function (data) {
        apiServicePro.getOpenid(data.code).then((result) => {
          if (result.code === 200) {
            _this.data.user.openid = result.data.openid;
            _this.setData({
              user: _this.data.user
            });
          } else {
          }
        }).catch((err) => {
        })
      },
      fail: function (err) {
        console.log('wx.login failed', err)
      }
    })
  },

  /** 获取城市列表 */
  getCityList() {
    apiServicePro.getCityList({}).then((result) => {
      if (result.code === 200) {
        const cityList = result.data;
        cityList.forEach((e) => {
          e.data.forEach((city) => {
            city.name = cityReplace(city.name);
          })
        });
        this.setData({
          cityList: result.data,
        })
      } else { }
    }).catch((err) => {
      showModal();
    })
  },

  /** 获取定位 */
  getWeChatCity() {
    let _this = this
    wx.authorize({
      scope: "scope.userLocation",
      success() {
        wx.showLoading({
          title: '定位中',
        })
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            app.globalData.userLocation = true;
            _this.getLocalCity(res.latitude, res.longitude);
          },
          fail(res) {
            _this.setData({
              currentCity: "定位失败"
            });
          }
        })
      }
    });
  },

  /**
   * 获取定位城市
   * @param latitude 经度
   * @param longitude 纬度
   */
  getLocalCity(latitude, longitude) {
    let _this = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=xsiYQN0VwrBHvxmf42BGdxFiTQgqBC4w&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        let city = res.data.result.addressComponent.city;
        city = cityReplace(city);
        _this.setData({
          currentCity: city
        });
        wx.setStorage({
          key: 'currentCity',
          data: city,
        });
        wx.hideLoading();
      },
      fail: function () {
        _this.setData({
          currentCity: "---"
        });
        wx.hideLoading();
      },
    })
  },

  /** 控制picker */
  popPicker() {
    let popHidden = this.data.popHidden;
    this.setData({
      popHidden: !popHidden,
    })
  },

  /** 跳转广场tabBar页，同时获取用户信息 */
  goHome(e) {
    this.getUser(e);
  },

  /** 获取用户信息 */
  getUser(e) {
    let userInfo = e.detail.userInfo;
    userInfo.openid = this.data.user.openid;
    if (!userInfo.openid) {
      return;
    }
    apiServicePro.insertUser(userInfo).then((result) => {
      if (result.code === 200) {
        userInfo.token = result.data.token;
        wx.setStorage({
          key: "user",
          data: userInfo
        });
        wx.switchTab({
          url: `../home/home`,
        });
      } else {

      }
    }).catch((err) => {
    });
  },

  /** 选择城市 */
  doSelect(e) {
    if (e.detail.name) {
      this.setData({
        popHidden: true,
        currentCity: e.detail.name,
      })
      wx.setStorage({
        key: 'currentCity',
        data: e.detail.name,
      });
    } else {  // 取消按钮
      this.setData({
        popHidden: true,
      })
    }
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