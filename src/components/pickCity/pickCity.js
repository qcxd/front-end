// components/pickCity.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentCity: {
      type: String,
      value: ''
    },
    cityList: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentView: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    doSelsct(e) {
      let myEventDetail = { 
        id: e.currentTarget.dataset.id,
        name: e.currentTarget.dataset.name,
      }; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      this.triggerEvent('pickevent', myEventDetail, myEventOption)
    },

    jumpToView(e) {
      this.setData({
        currentView: e.currentTarget.dataset.code
      })
    }
  }
})
