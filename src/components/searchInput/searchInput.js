// components/searchInput/searchInput.js
const sockerService = require('../../service/socket.service.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    notificationCount: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initSocket(){
      let socket = sockerService.getSocket();
      socket.on('notification', () => {
        console.log('get notification')
        let notificationCount = this.data.notificationCount + 1;
        this.setData({
          notificationCount: notificationCount
        })
      });
    },
    onNofitication(){
      
      this.triggerEvent('notification', {
        notificationCount: this.data.notificationCount
      });
      this.setData({
        notificationCount: 0
      })
    }
  },
  ready(){
    this.initSocket();
  }
})
