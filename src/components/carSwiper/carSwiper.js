// components/carDetail/carDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    carDetail: {
      type: Object,
      value: {},
    },
    imgUrls: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
