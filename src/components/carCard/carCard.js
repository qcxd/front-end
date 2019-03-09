// components/carCard/carCard.js
Component({
  properties: {
    carDetail: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: ''
    }
  },

  data: {
  },

  methods: {
    clickEvent(e) {
      let myEventDetail = {
        id: e.currentTarget.dataset.id,
        follow: e.currentTarget.dataset.follow,
      }; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      this.triggerEvent('clickEvent', myEventDetail, myEventOption);
    }
  }
})
