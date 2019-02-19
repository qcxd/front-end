const apiServicePro = require('../../service/api/api-promisify.service');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentBrand: {
      type: String,
      value: ''
    },
    brandList: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentView: '',
    brand_id: '',
    brandName: '',
    brandDetailList: [],
    popBrandDetail: false,
  },

  /**
   * 组件的方法列表
   * 
   */
  methods: {
    doSelectBrand(e) {
      this.getCarBrandDetail(e.currentTarget.dataset.id);
      this.setData({
        brand_id: e.currentTarget.dataset.id,
        brandName: e.currentTarget.dataset.brand,
        popBrandDetail: true,
      });
    },

    doSelectBrandDetail(e) {
      let myEventDetail = {
        id: this.data.brand_id,
        brand: this.data.brandName,
        brandDetail: e.currentTarget.dataset.brand,
      }; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      this.triggerEvent('pickevent', myEventDetail, myEventOption)
    },

    jumpToView(e) {
      this.setData({
        currentView: e.currentTarget.dataset.code
      })
    },

    /** 某个品牌详细信息 */
    getCarBrandDetail(brand_id) {
      apiServicePro.getCarBrandDetail(brand_id, '0').then((result => {
        this.setData({
          brandDetailList: result.data,
        })
      }));
    },
  }
})
