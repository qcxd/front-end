// components/fixdFooter/fixedFooter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    carDetail: {
      type: Object,
      value: {}
    },
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
    phoneCall(e) {
      const myEventDetail = {
        e,
      } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('phonecall', myEventDetail, myEventOption)
    },
  }
})
