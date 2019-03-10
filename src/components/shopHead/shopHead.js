// components/shopHead/shopHead.js
const apiServicePro = require('../../service/api/api-promisify.service');
const {
  phoneCall,
} = require('../../utils/utils');

Component({
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

  data: {
    userInfo: {},
  },

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

    /** 获取用户信息（店铺信息） */
    getUserInfo() {
      apiServicePro.getUserInfo().then(result => {
        if (result) {
          const userInfo = result.data;
          this.setData({
            userInfo,
          });
        }
      });
    },
  },

  lifetimes: {
    attached() {
      this.getUserInfo();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})
