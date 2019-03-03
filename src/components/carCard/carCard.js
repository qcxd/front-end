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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    addWherehouse(e) {
      let myEventDetail = {
        id: e.currentTarget.dataset.id,
        follow: e.currentTarget.dataset.follow,
      }; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      this.triggerEvent('addWherehouse', myEventDetail, myEventOption);
    }
  }
})
