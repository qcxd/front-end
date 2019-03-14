// pages/createCar/createCar.js
const apiServicePro = require('../../service/api/api-promisify.service');
const uploadImage = require('../../utils/oss.js');
const env = require('../../config.js');
const utils = require('../../utils/utils.js');

Page({
  data: {
    shopId: '',
    brand: '',            // 品牌
    brandDetail: '',      // 二级车系
    price: '',            // 价格
    dateCard: '',         // 上牌时间
    kilometer: '',        // 行驶里程
    transfersNumber: '',  // 过户次数
    introduce: '',        // 车况
    note: '',
    leftLenth: 300,
    oldImages: [],        // 跟新汽车图片
    uploadImgs: [],       // 图片
    count: 9,
    city: '',             // 上牌地点
    cityId: '',
    selectValue: '',
    cityList: [],
    popHidden: true,
    brandList: [],
    hotBrandList: [],
    dateNow: '',
    popHiddenBrand: true,
    submitDisable: false,
    introArray: [
      'A、优秀（车况好，没有任何事故）',
      'B、良好（有少量剐蹭或钣金）',
      'C、一般（有过前后轻碰撞事故）',
      'D、较差（有发生过伤及主体框架的碰撞或较重事故）']
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    let _this = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        _this.setData({
          user: res.data
        })
      },
    });
    wx.getStorage({
      key: 'cityList',
      success: function (res) {
        _this.setData({
          cityList: res.data,
        })
      },
    })  
    if (options.carId) {
      _this.getCarDetail(options.carId);
    }
    _this.setData({
      shopId: options.shopId,
      carId: options.carId || ''
    });
    this.getCarBrands();
    this.getHotCarBrands();
    this.setData({
      dateNow: this.getYMD(new Date())
    });
  },

  /** 汽车详情 */
  getCarDetail(id) {
    apiServicePro.getCarDetail(id).then((result) => {
      if (result) {
        this.setData({
          brand: result.data.brand,
          brandDetail: result.data.brandDetail,         // 二级车系
          city: result.data.city,
          price: result.data.price,                     // 价格
          dateCard: this.getYMD(result.data.dateCard),  // 上牌时间
          kilometer: result.data.kilometer,             // 行驶里程
          transfersNumber: result.data.transfersNumber, // 过户次数
          introduce: result.data.introduce,             // 车况
          note: result.data.note,                  // 补充
          oldImages: result.data.images,                // 图片
        })
      }
    })
  },

  getYMD(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month <= 9 ? `0${month}` : month;
    let day = date.getDate();
    day = day <= 9 ? `0${day}` : day;
    return `${year}-${month}-${day}`
  },

  /** 准备提交 */
  onSubmit(e) {
    let that = this;
    const value = e.detail.value;
    const openid = this.data.user.openid;
    const aliyunServerURL = env.uploadImageUrl;

    if (!utils.validateEmpty(value.brand, '请选择品牌车系') ||
        !utils.validateEmpty(value.dateCard, '请选择上牌日期') ||
        !utils.validateEmpty(value.kilometer, '请输入行驶里程') ||
        !utils.validateEmpty(value.city, '请输选择拍照所在地') ||
        !utils.validateEmpty(value.price, '请输入价格') ||
        !utils.validateEmpty(value.transfersNumber, '请输入过户次数') ||
        !utils.validateEmpty(value.introduce, '请选择车况') ||
        !utils.validateEmpty(value.note, '请输入补充') ||
        !utils.validateImages(this.data.oldImages.concat(this.data.uploadImgs), '请上传汽车照片')) {
      return false;
    }

    // var reg = new RegExp(/([1-9]\d{0,3}\.?\d{1,2})|(0\.\d{1}[1-9])/);
    // reg.test(value.price)
    // if (reg.test(value.price)) {

    // }

    let count = 0;
    let images = [];
    const uploadImgs = this.data.uploadImgs;
    wx.showLoading({
      title: '',
    })
    if (uploadImgs.length > 0) {
      for (let i = 0; i < uploadImgs.length; i++) {
        let filePath = uploadImgs[i];
        uploadImage({
          filePath: filePath,
          dir: `images/shop/${openid}/` + filePath.replace('http://tmp/', ''),
          success: function (res) {
            count++;
            images.push(`${aliyunServerURL}/${res}`);
            if (count === uploadImgs.length) {
              if (that.data.carId !== '') {
                images = images.concat(that.data.oldImages);
                that.updateCar(e, images, that.data.carId);
              } else {
                that.doSubmit(e, images);
              }
            } else {
              wx.hideLoading();
            }
          },
          fail: function (res) {
            wx.hideLoading();
          }
        });
      }
    } else {
      if (that.data.carId !== '') {
        images = images.concat(that.data.oldImages);  // 合并编辑之前的汽车图片
        that.updateCar(e, images, that.data.carId);
      } else {
        that.doSubmit(e, images);
      }
      wx.hideLoading();
    }
  },

  /** 创建汽车 */
  doSubmit(e, images) {
    const params = e.detail.value;
    this.setData({
      submitDisable: true
    });
    apiServicePro.createCar(Object.assign({ images }, params)).then((result) => {
      wx.hideLoading(); 
      this.setData({
        submitDisable: true
      });     
      if (result.code === 200) {
        wx.navigateTo({
          url: `../carDetail/carDetail?id=${result.data.id}&from=creatCarPage`,
        });
      } else if (result.code === 1202) {
        utils.showModal('信息校验不通过，请核对汽车信息');
      } else {
        utils.showModal();
      }
    })
  },

  /** 更新汽车 */
  updateCar(e, images, carId) {
    const value = e.detail.value;
    const params = Object.assign(value, {'id': carId});
    this.setData({
      submitDisable: true
    });
    apiServicePro.updateCar(Object.assign({ images }, params)).then((result) => {
      wx.hideLoading();
      this.setData({
        submitDisable: true
      });
      if (result.code === 200) {
        wx.navigateTo({
          url: `../carDetail/carDetail?id=${result.data.id}&from=creatCarPage`,
        });
      } else if (result.code === 1202) {
        utils.showModal('信息校验不通过，请核对汽车信息');
      } else {
        utils.showModal();
      }
    })
  },

  /** 删除上传照片 */
  delImage(e) {
    const array = e.currentTarget.dataset.array;
    const index = e.currentTarget.dataset.index;
    if (array === 'oldImages') {
      const oldImages = this.data.oldImages;
      oldImages.splice(index, 1);
      this.setData({
        oldImages
      });
    } else {
      const uploadImgs = this.data.uploadImgs;
      uploadImgs.splice(index, 1);
      this.setData({
        uploadImgs
      });
    }
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
        that.setData({
          filePath: res.tempFilePaths[0],
          uploadImgs: res.tempFilePaths
        });
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

  /** 选择城市 */
  doSelect(e) {
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
      });
    }));
  },

  /** 热门品牌列表 */
  getHotCarBrands() {
    apiServicePro.getCarBrands(true, '0').then((result => {
      this.setData({
        hotBrandList: result.data,
      });
    }));
  },

  /** 控制pickBrand */
  popBrand() {
    let popHiddenBrand = this.data.popHiddenBrand;
    this.setData({
      popHiddenBrand: !popHiddenBrand,
    });
  },

  /** 选择城市 */
  doSelectBrand(e) {
    if (e.detail.brand) {
      this.setData({
        popHiddenBrand: true,
        brand: e.detail.brand,
        brandDetail: e.detail.brandDetail,
      });
      wx.setStorage({
        key: 'brand',
        data: e.detail.brand,
      });
    } else {  // 取消按钮
      this.setData({
        popHiddenBrand: true,
      });
    }
  },

  /** 上牌时间 */
  bindDateChange(e) {
    this.setData({
      dateCard: e.detail.value
    })
  },

  /** 车况 */
  bindIntroChange(e) {
    const { introArray } = this.data
    this.setData({
      introduce: introArray[e.detail.value]
    })
  },

  inputNote(e) {
    const leftLenth = (300 - e.detail.value.length);
    this.setData({
      leftLenth: leftLenth > 0 ? leftLenth : 0
    });
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