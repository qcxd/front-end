// components/carCard/carCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    carDetail: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    year: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getYear(dateCard) {
      const date = new Date(dateCard);
      const year = date.getFullYear();
      this.setData({
        year: `${year}年`
      });
    }
  },

  lifetimes: {
    attached() {
      this.getYear(this.properties.carDetail.dateCard);
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})
