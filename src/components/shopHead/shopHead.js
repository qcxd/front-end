// components/shopHead/shopHead.js
const {
  phoneCall,
} = require('../../utils/utils');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopInfo: {
      type: Object,
      value: {}
    },
    shopIntro: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    followShop(e) {
      const myEventDetail = {
        id: e.currentTarget.dataset.id,
        follow: e.currentTarget.dataset.follow
      } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('followshop', myEventDetail, myEventOption)
    },

    popWechat(e) {
      this.triggerEvent('popWechat', {}, {})
    },

    phoneCall(e) {
      phoneCall(e);
    },

  }
})
