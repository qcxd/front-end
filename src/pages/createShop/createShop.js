// pages/createShop/createShop.js
const apiServicePro = require('../../service/api/api-promisify.service');
const uploadImage = require('../../utils/oss.js');

Page({
  data: {
    name: '',
    phone: '',
    shopName: '',
    country: '',
    province: 0,
    city: 0,
    area: 0,
    addressInfo: '',
    introduce: '',
    address: '',
    logo: '',
    filePath: "",
    images: [],
    uploadImgs: [],
    count: 9,
    districtList: [],
    cityList: [],
    areaList: [],
    popHidden: true,
  },

  onLoad: function (options) {
    // 省市区数据
    this.getAllDistrict();
  },

  /** 创建店铺 */
  doSubmit(e) {
    // this.uploadImg();
    const params = e.detail.value
    const address = {
      province: this.data.province,
      city: this.data.city,
      area: this.data.area,
      logo: this.data.logo,
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

  onSubmit(e) {
    let that = this;
    console.log(JSON.stringify(that.data.uploadImgs))
    for (let i = 0; i < that.data.uploadImgs.length; i++) {
      let filePath = that.data.uploadImgs[i];

      uploadImage(
        {
          filePath: filePath,
          dir: "images/",
          success: function (res) {
            console.log("上传成功" + JSON.stringify(res))
            that.setData({
              logo: res,
            }, () => {
              that.doSubmit(e);
            })
          },
          fail: function (res) {
            console.log("上传失败")
            console.log(res)
          }
        })
    }

  },

  popAddress() {
    this.setData({
      popHidden: false,
    })
  },

  bindChange(e) {
    const val = e.detail.value
    const province = this.data.districtList[val[0]].data[0].id;
    const city = this.data.cityList[val[1]].data[0].id;
    const area = this.data.areaList[val[2]].data[0].id;
    const provinceName = this.data.districtList[val[0]].data[0].name;
    const cityName = this.data.cityList[val[1]].data[0].name;
    const areaName = this.data.areaList[val[2]].data[0].name;
    this.setData({
      province,
      city,
      area,
      addressInfo: `${provinceName}${cityName}${areaName}`,
    })
  },

  pickEnsure() {
    this.setData({
      popHidden: true,
    })
  },

  /** 获取城市列表
   * id 可选 可传空字符？？
   */
  getAllDistrict() {
    const params = {
      type: 'all',
    };
    apiServicePro.getAllDistrict(params).then((result) => {
      if (result.code === 200) {
        const districtList = result.data;
        this.setData({
          districtList,
        });
      }
    }).catch((err) => {
      showModal();
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