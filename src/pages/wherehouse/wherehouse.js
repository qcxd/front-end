// pages/wherehouse/wherehouse.js

const apiServicePro = require('../../service/api/api-promisify.service');
const {
  showModal,
} = require('../../utils/utils');

Page({
  data: {
    inputValue: '',
    _active: '1', // 1 店铺 0 汽车
    shopList: [],
    carList: [],
    currentPageShop: 1,
    currentPageCar: 1,
    totalShop: 0,
    totalCar: 0,
    pageSize: 10,
  },

  onLoad: function (options) {
  },

  tabSwitch(e) {
    const index =  e.currentTarget.dataset.index;
    this.setData({
      _active: index,
      inputValue: '',
    })
  },

  /**
   * 获取仓库店铺列表
   * @param {Object} params 
   */
  getWarehouseList(params) {
    apiServicePro.getWarehouseList(params).then((result) => {
      if (result.code === 200) {
        const totalShop = result.data.count;
        const dataList = result.data.rows;
        dataList.forEach((el) => {
          el.isOpen = false;
        })
        let shopList = this.data.shopList;
        if (params.id) {
          shopList = shopList.concat(dataList);
        } else {
          shopList = dataList;
        }
        this.setData({
          shopList,
          totalShop,
        })
      } else {
        showModal();
      }
    }).catch((err) => {
      showModal();
    })
  },

  /**
   * 获取仓库汽车列表
   * @param {Object} params 
   */
  getWarehouseCarList(params) {
    apiServicePro.getWarehouseCarList(params).then((result) => {
      if (result.code === 200) {
        const totalCar = result.data.count;
        let carList = this.data.carList;
        if (params.id) {
          carList = carList.concat(result.data.rows);
        } else {
          carList = result.data.rows;
        }
        this.setData({
          carList,
          totalCar
        });
      } else {
        showModal();
      }
    }).catch((err) => {
      showModal();
    })
  },

  goCarDetail(e) {
    wx.navigateTo({
      url: `../carDetail/carDetail?id=${e.currentTarget.dataset.id}`,
    })
  },

  /** 店铺首页 */
  goShop(e) {
    wx.navigateTo({
      url: `../shop/shop?id=${e.currentTarget.dataset.id}`,
    })
  },

  /** 搜索 */
  doSearch(e) {
    const _active = this.data._active;
    if (_active === '1') {
      const params = {
        name: e.detail.value
      }
      this.getWarehouseList(params);
    } else {
      const params = {
        brand: e.detail.value
      }
      this.getWarehouseCarList(params);
    }
  },

  /** 展开闭合汽车 */
  openCars(e) {
    const id = e.currentTarget.dataset.id;
    const shopList = this.data.shopList;
    shopList.forEach((el) => {
      if (el.id === id) {
        el.isOpen = !el.isOpen;
      }
    })
    this.setData({
      shopList,
    })
  },

  /** 取消关注 */
  unFollowShop(e) {
    const id = e.currentTarget.dataset.id;
    const shopList = this.data.shopList;
    shopList.forEach((el) => {
      if (el.id === id) {
        el.isFollowShop = false;
      }
    })
    this.setData({
      shopList,
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
    this.getWarehouseList({});
    this.getWarehouseCarList({});
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
    const _active = this.data._active;
    if (_active === '1') {
      this.getWarehouseList({});
    } else {
      this.getWarehouseCarList({});
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const _active = this.data._active;
    if (_active === '1') {
      let currentPageShop = this.data.currentPageShop;
      let totalShop = this.data.totalShop;
      let pageSize = this.data.pageSize;
      if (currentPageShop * pageSize  < totalShop ) {
        this.getWarehouseList({ currentPage: currentPageShop });
      }
    } else {
      let currentPageCar = this.data.currentPageCar;
      let totalCar = this.data.totalCar;
      let pageSize = this.data.pageSize;
      if (currentPageCar * pageSize < totalCar) {
        this.getWarehouseCarList({ currentPage: currentPageCar });
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})