// pages/createCar/createCar.js
const apiServicePro = require('../../service/api/api-promisify.service');
const env = require('../../config.js');
const utils = require('../../utils/utils.js');

Page({
  data: {
    shopId: '',
    brand: '',
    brandDetail: '',
    price: '',
    images: [],
    uploadImgs: [],
    count: 9,
    city: '',
    cityId: '',
    selectValue: '',
    cityList: [],
    popHidden: true,
    brandList: [],
    popHiddenBrand: true,
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    let _this = this
    wx.getStorage({
      key: 'user',
      success: function (res) {
        _this.setData({
          user: res.data
        })
      },
    });
    this.setData({
      shopId: options.shopId,
    })
    console.log(options);
    this.getCityList();
    this.getCarBrands();
  },

  onSubmit(e) {
    let that = this;
    const value = e.detail.value;
    const openid = this.data.user.openid;
    const aliyunServerURL = env.uploadImageUrl;

    utils.validateEmpty(value.brand, '请选择品牌车系');
    utils.validateEmpty(value.price, '请输入价格');
    utils.validateImages(this.data.uploadImgs, '请上传汽车照片');
    utils.validateEmpty(value.shopName, '请输入店铺名');
    utils.validateEmpty(value.address, '请输详细地址');
    utils.validatePhone(value.phone, '请输入正确的手机号');

    for (let i = 0; i < that.data.uploadImgs.length; i++) {
      let filePath = that.data.uploadImgs[i];
      console.log(that.data.uploadImgs[i]);

      uploadImage(
        {
          filePath: filePath,
          dir: `${aliyunServerURL}/images/shop/${openid}/` + filePath.replace('http://tmp/', ''),
          success: function (res) {
            console.log('res', `${aliyunServerURL}/${res}`);
            that.setData({
              qrcode: `${aliyunServerURL}/${res}`,
            }, () => {
              that.doSubmit(e);
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
    }
  },

  /** 创建汽车 */
  doSubmit(e) {
    const params = e.detail.value;
    const images = this.data.images; // 汽车图片数组
    apiServicePro.createShop(Object.assign({ images }, params)).then((result) => {
      if (result.code === 200) {
        // 成功到店铺还是添加一个成功结果页面？？？
        wx.navigateTo({
          url: `../carDetail/carDetail?id=${result.data.id}`,
          // url: `../shopSuccess/shopSuccess`,
        })
      }
    })
  },

  /** reset */
  formReset(e) {

  },

  /** 选择图片 */
  chooseImage: function (e) {
    const selectPictureNum = e.target.dataset.num;
    this.setData({
      count: 99 - selectPictureNum
    })
    const that = this;
    wx.chooseImage({
      count: that.data.count, // 默认99
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          filePath: res.tempFilePaths[0],
          images: that.data.images.concat(tempFilePaths),
          // images: tempFilePaths,
          uploadImgs: res.tempFilePaths
        })
      },
    })
  },

  /** 控制pickerCity */
  popPicker() {
    let popHidden = this.data.popHidden;
    this.setData({
      popHidden: !popHidden,
    })
  },

  /** 获取城市列表 */
  getCityList() {
    apiServicePro.getCityList({}, '0').then((result) => {
      if (result.code === 200) {
        const cityList = result.data;
        cityList.forEach((e) => {
          e.data.forEach((city) => {
            city.name = utils.cityReplace(city.name);
          })
        });
        this.setData({
          cityList: result.data,
        })
      } else { }
    }).catch((err) => {
      utils.showModal();
    })
  },

  /** 选择城市 */
  doSelect(e) {
    console.log(e);
    if (e.detail.name) {
      const cityId = this.getCityId(e.detail.name);
      this.setData({
        popHidden: true,
        city: e.detail.name,
        cityId,
      })
      wx.setStorage({
        key: 'city',
        data: e.detail.name,
      });
    } else {  // 取消按钮
      this.setData({
        popHidden: true,
      })
    }
  },

  getCityId(city) {
    const cityList = this.data.cityList;
    let id = 0;
    cityList.forEach(e => {
      e.data.forEach(item => {
        if (item.name.indexOf(city) >= 0) {
          id = item.id;
        }
      });
    });
    return id;
  },

  /** 品牌列表 */
  getCarBrands() {
    apiServicePro.getCarBrands(false, '0').then((result => {
      this.setData({
        brandList: result.data,
      })
      console.log('result.data[0].data[0].id: ', result.data[0].data[0].id);
      this.getCarBrandDetail(result.data[0].data[0].id);
    }));
  },

  /**  控制pickBrand */
  popBrand() {
    let popHiddenBrand = this.data.popHiddenBrand;
    this.setData({
      popHiddenBrand: !popHiddenBrand,
    })
  },

  /** 选择城市 */
  doSelectBrand(e) {
    console.log(e);
    if (e.detail.brand) {
      // const cityId = this.getCityId(e.detail.brand);
      this.setData({
        popHiddenBrand: true,
        brand: e.detail.brand,
        brandDetail: e.detail.brandDetail,
        // cityId,
      })
      wx.setStorage({
        key: 'brand',
        data: e.detail.brand,
      });
    } else {  // 取消按钮
      this.setData({
        popHiddenBrand: true,
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