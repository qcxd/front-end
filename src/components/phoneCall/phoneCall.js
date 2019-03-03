// components/phoneCall/phoneCall.js
const {
  phoneCall,
} = require('../../utils/utils');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone: {
      type: String,
      value: ''
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
    closePhoneCall() {
      this.triggerEvent('closePhoneCall', {}, {})
    },

    phoneCall(e) {
      phoneCall(e);
    },
  }
})
