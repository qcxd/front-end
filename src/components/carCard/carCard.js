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
    year: ''
  },

  methods: {
    clickEvent(e) {
      let myEventDetail = {
        id: e.currentTarget.dataset.id,
        follow: e.currentTarget.dataset.follow,
      }; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      this.triggerEvent('clickEvent', myEventDetail, myEventOption);
    },

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
