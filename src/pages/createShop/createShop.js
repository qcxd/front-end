// pages/createShop/createShop.js
const apiServicePro = require('../../service/api/api-promisify.service');
const uploadImage = require('../../utils/oss.js');
const utils = require('../../utils/utils.js');
const env = require('../../config.js');

Page({
  data: {
    shopDetail: {},
    user: {},
    name: '',
    phone: '',
    shopName: '',
    country: '',
    province: '',
    city: '',
    area: '',
    address: '',
    introduce: '',
    qrcode: '',
    tempFilePath: '',
    count: 9,
    region: [],
    customItem: '全部',
    popHidden: true,
    submitDisable: false,
  },

  onLoad: function (options) {
    let _this = this
    wx.getStorage({
      key: 'user',
      success: function(res) {
        _this.setData({
          user: res.data
        })
      },
    });
    if (options.shopId) {
      this.getShopDetail(options.shopId);
      this.setData({
        shopId: options.shopId 
      });
    }
  },

  /**
   * 听过店铺id获取信息
   */
  getShopDetail(id) {
    apiServicePro.getShopDetail(id).then((result) => {
      if (result.code === 200) {
        const shopDetail = result.data;
        this.setData({
          name: shopDetail.name,
          phone: shopDetail.phone,
          shopName: shopDetail.shopName,
          country: shopDetail.country,
          province: shopDetail.province,
          city: shopDetail.city,
          area: shopDetail.area,
          address: shopDetail.address,
          introduce: shopDetail.introduce,
          qrcode: shopDetail.qrcode,
          tempFilePath: shopDetail.qrcode,
          region: [shopDetail.province, shopDetail.city, shopDetail.area]
        })
      } else {
        utils.showModal();
      }
    }, (err) => {
    })
  },

  onSubmit(e) {
    let that = this;
    const value = e.detail.value;
    const openid = this.data.user.openid;
    const aliyunServerURL = env.uploadImageUrl;
    const tempFilePath = this.data.tempFilePath;

    if (!utils.validateEmpty(value.name, '请输入姓名') ||
        !utils.validateEmpty(value.phone, '请输入手机号码') ||
        !utils.validateEmpty(tempFilePath, '请上传微信二维码') ||
        !utils.validateEmpty(value.shopName, '请输入店铺名') ||
        !utils.validateEmpty(value.address, '请输详细地址') ||
        !utils.validatePhone(value.phone, '请输入正确的手机号')) {
      return false;
    }

    if (this.data.qrcode === '') {
      uploadImage({
        filePath: tempFilePath,
        dir: `${aliyunServerURL}/images/shop/${openid}/` + tempFilePath.replace('http://tmp/', ''),
        success: function (res) {
          console.log('res', `${aliyunServerURL}/${res}`);
          that.setData({
            qrcode: `${aliyunServerURL}/${res}`,
          }, () => {
            if (that.data.shopId) {
              that.updateShop(e, that.data.shopId);
            } else {
              that.doSubmit(e);
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else {
      if (that.data.shopId) {
        that.updateShop(e, that.data.shopId);
      } else {
        that.doSubmit(e);
      }
    }
  },

  /** 创建店铺 */
  doSubmit(e) {
    const params = e.detail.value;
    const region = this.data.region;
    const address = {
      province: region[0],
      city: region[1],
      area: region[2],
      qrcode: this.data.qrcode, // 微信二维码
    };
    this.setData({
      submitDisable: true
    });
    apiServicePro.createShop(Object.assign(address, params)).then((result) => {
      if (result.code === 200) {
        this.setData({
          submitDisable: false
        });
        wx.navigateTo({
          url: `../shop/shop?id=${result.data.id}&from=creatShopPage`,
        })
      }
    })
  },

  /** 更新店铺 */
  updateShop(e, shopId) {
    const params = e.detail.value;
    const region = this.data.region;
    const address = {
      province: region[0],
      city: region[1],
      area: region[2],
      qrcode: this.data.qrcode, // 微信二维码
    };
    this.setData({
      submitDisable: true
    });
    apiServicePro.updateShop(Object.assign(address, params, { id: shopId})).then((result) => {
      if (result.code === 200) {
        this.setData({
          submitDisable: false
        });
        wx.navigateTo({
          url: `../shop/shop?id=${result.data.id}&from=creatShopPage`,
        })
      }
    })
  },

  /** 删除上传照片 */
  delImage() {
    this.setData({
      tempFilePath: ''
    })
  },

  /** reset */
  formReset(e) {

  },

  /** 选择图片 */
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
        that.setData({
          tempFilePath: res.tempFilePaths[0],
          qrcode: '',
        })
      },
    })
  },

  pickEnsure() {
    this.setData({
      popHidden: true,
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  /** 导入微信地址 */
  chooseAddress() {
    let that = this;
    wx.chooseAddress({
      success: (res) => {
        const {
          provinceName,
          cityName,
          countyName,
          detailInfo,
        } = res;
        const region = [provinceName, cityName, countyName];
        that.setData({
          region,
          address: detailInfo,
        })
      },
      fail: function (err) {
        console.log(err)
      }
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