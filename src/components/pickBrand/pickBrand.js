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
    hotBrandList: {
      type: Array,
      value: []
    }
  },

  data: {
    currentView: '',
    brand_id: '',
    brandName: '',
    brandDetailList: [],
    popBrandDetail: false,
  },

  methods: {
    /** 一级车系品牌 */
    doSelectBrand(e) {
      this.getCarBrandDetail(e.currentTarget.dataset.id);
      this.setData({
        brand_id: e.currentTarget.dataset.id,
        brandName: e.currentTarget.dataset.brand,
      });
    },

    /** 二级车系品牌 */
    doSelectBrandDetail(e) {
      this.setData({
        popBrandDetail: false
      });
      this.pickeventCallback(e.currentTarget.dataset.brand);
    },

    jumpToView(e) {
      this.setData({
        currentView: e.currentTarget.dataset.code
      })
    },

    /** 品牌二级车系品牌 */
    getCarBrandDetail(brand_id) {
      apiServicePro.getCarBrandDetail(brand_id, '0').then((result => {
        if (result.data.length > 0) {
          this.setData({
            brandDetailList: result.data,
            popBrandDetail: true,
          });
        } else {
          this.setData({
            popBrandDetail: false,
          });
          this.pickeventCallback('');
        }
      }));
    },

    pickeventCallback(brandDetail) {
      let myEventDetail = {
        id: this.data.brand_id,
        brand: this.data.brandName,
        brandDetail: brandDetail,
      }; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      this.triggerEvent('pickevent', myEventDetail, myEventOption);
    }
  }
})
