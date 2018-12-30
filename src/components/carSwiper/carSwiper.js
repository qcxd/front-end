// components/carDetail/carDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    carDetail: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: [
      'https://test-buycarshop.oss-cn-beijing.aliyuncs.com/images/tmp/wxd69c8ff630f18b95.o6zAJs4dYanu890IXcPAeUhW4Ixc.HAm45WKvZ4z5830181c6b1af100ff1847db1277bf182.jpg',
      'https://test-buycarshop.oss-cn-beijing.aliyuncs.com/images/tmp/wxd69c8ff630f18b95.o6zAJs4dYanu890IXcPAeUhW4Ixc.QD0jvpmY6TFdb2541b054365b88b0bae5172f87fdcaf.jpg',
      'https://test-buycarshop.oss-cn-beijing.aliyuncs.com/images/tmp/wxd69c8ff630f18b95.o6zAJs4dYanu890IXcPAeUhW4Ixc.nh0BvXAlhxUee1a7296e6182e9e31591c468690d249a.jpg'
    ],

    // images: this.carDetail.images.split(','),
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
