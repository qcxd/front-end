const app = getApp();
const apiServicePro = require('../../service/api/api-promisify.service');
const {
  cityReplace,
  showModal,
} = require('../../utils/utils');

// pages/shop/shop.js
Page({
  data: {
    shopList: [],
    currentCity: '',
    currentCityId: '',
    selectValue: '',
    cityList: [],
    currentQrcode: '',
    phone: '',
    popHidden: true,
    pageLoaded: false,
    popWechat: false,
  },

  onLoad: function (options) {
    let _this = this;
    wx.getStorage({
      key: 'currentCity',
      success: function(res) {
        const currentCityId = _this.getCityId(res.data);
        _this.setData({
          currentCity: res.data,
          currentCityId,
        });
      },
    })
    wx.getStorage({
      key: 'cityList',
      success: function (res) {
        _this.setData({
          cityList: res.data,
        })
      },
    })
    this.getShopList({});
    this.setData({
      pageLoaded: true,
    })
  },
  
  /** 店铺首页 */
  goShop(e) {
    wx.navigateTo({
      url: `../shop/shop?id=${e.currentTarget.dataset.id}`,
    })
  },

 /** 汽车详情 */
  goCarDetail(e) {
    wx.navigateTo({
      url: `../carDetail/carDetail?id=${e.currentTarget.dataset.id}`,
    })
  },

  /** 搜索 */
  doSearch(e) {    
    const params = {
      keyword: e.detail.value,
      city: this.data.currentCityId,
    }
    this.getShopList(params);
  },

  /**
   * 获取店铺列表
   * @param {Object} params 
   */
  getShopList(params) {
    apiServicePro.getShopList(params, '0').then((result) => {
      if (result.code === 200) {
        let shopList = this.data.shopList;
        if (params.id) {
          shopList = shopList.concat(result.data.rows);
        } else {
          shopList = result.data.rows;
        }
        this.setData({
          shopList: shopList
        })
      } else {
        showModal();
      }
    }).catch((err) => {
      showModal();
    })
  },

  /** 收藏店铺 */
  followShop(e) {
    const params = {
      id: e.detail.id,
      follow: e.detail.follow ? false : true
    };
    apiServicePro.followShop(params).then((result) => {
      if (result.code === 200) {
        let sList = this.data.shopList;
        sList.forEach(el => {
          if (el.id === e.detail.id) {
            el.isFollowShop = el.isFollowShop ? false : true
          }
        });
        this.setData({
          shopList: sList
        })
        if (e.detail.follow) {
          wx.showToast({
            title: '已取消收藏',
            icon: 'succes'
          })
        } else {
          wx.showToast({
            title: '已收藏',
            icon: 'succes'
          })
        }
      } else {
        showModal();
      }
    }, (err) => {
      showModal();
    })
  },

  /** 控制picker */
  popPicker() {
    let popHidden = this.data.popHidden;
    this.setData({
      popHidden: !popHidden,
    })
  },

  /** 选择城市 */
  doSelect(e) {
    if (e.detail.name) {
      const currentCityId = this.getCityId(e.detail.name);
      this.setData({
        popHidden: true,
        currentCity: e.detail.name,
        currentCityId,
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

  getCityId(currentCity) {
    const cityList = this.data.cityList;
    let id = 0;
    cityList.forEach(e => {
      e.data.forEach(item => {
        if (item.name.indexOf(currentCity) >= 0) {
          id = item.id;
        }
      });
    });
    return id;
  },

  selectSort() {
  },

  selectArea() {
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

  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { pageLoaded } = this.data;
    if (pageLoaded) {
      this.getShopList({}, '0');
    }
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
    this.getShopList({});
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const shopList = this.data.shopList;
    console.log('shopList.length', shopList.length );
    if (shopList.length % 10 === 0) {
      this.getShopList({id: shopList[shopList.length - 1].id});
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})