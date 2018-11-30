// components/postItem/postItem.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avatar: {
      type: String,
      value: '/image/default_avatar.png'
    },
    from: {
      type: String,
      value: ''
    },
    to: {
      type: String,
      value: ''
    },
    time: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    images: {
      type: String,
      value: '/image/default_avatar.png'
    },
    comments: {
      type: Array,
      value: []
    },
    postid: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageStyle: '',
    user: {},
    sysInfo: {},
    message: '',
    isWriting: false,
    is_translated: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imgLoad(e) {
      let picture_style = `height: ${e.detail['height']}px; width: ${e.detail['width']}px;`;
      setTimeout(_ => {
        this.setData({
          imageStyle: picture_style
        });
      }, 100);
    },
    writeComment(e) {
      var text = e['detail']['value'];
      // 设置text的值等于textarea的value
      this.setData({
        message: text
      })
    },
    textareaBlur() {
      this.setData({
        isWriting: false
      })
    },
    addComment(){
      let m = this.data.message;
      this.setData({
        message: ''
      });
      // let user = this.data.user;
      // m = `[ From WeChat: ${user.nickName} ] ${m}`;
      let platform = this.data.sysInfo;
      let time = 0;
      if(platform != 'ios') {
        time = 50;
      }
      setTimeout(_ => {
        this.triggerEvent('send', {
          message: m,
          id: this.data.postid
        })
      }, time);
    },
    showWriteComment(e) {
      this.setData({
        isWriting: true
      })
    },
    translate(e) {
      if(this.data.is_translated) {
        this.setData({
          content: '很高兴在这里见到你。'
        })

      }else {
        this.setData({
          content: 'Glad to see you here.'
        })
      }
      this.data.is_translated = !this.data.is_translated;
    }
  },
  lifetimes: {
    ready(){
      let syso = app.globalData.sysInfo;
      this.setData({
        user: wx.getStorageSync('user'),
        sysInfo: syso
      })
    }
  }
})
