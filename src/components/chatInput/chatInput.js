// components/chatInput/chatInput.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isText: true,
    isIOS: false,
    needFocus: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e){
      this.setData({
        content: e.detail.value
      })
      this.triggerEvent('input',{
        value: e.detail.value,
        cursor: e.detail.cursor
      })
    },
    hanldeBlur(e){
      const needFocus = e.detail.value.length?true:false;
      this.setData({
        needFocus
      })
    },
    switchIsText(){
      let isText = !this.data.isText;
      this.setData({
        isText
      })
    },
    handleComplete(){
      let ct = this.data.content;
      let time = 0;
      if(this.data.isIOS){
        time = 0;
      }else {
        time = 50;
      }
      setTimeout(()=>{
        this.setData({
          content: ''
        });
        this.triggerEvent('complete',{
          value: ct
        })
      }, time);
    },
    handleOther(){
      this.triggerEvent('other');
    }
  },
  lifetimes: {
    attached(){
      const sysInfo = app.globalData.sysInfo;
      if(sysInfo.platform == 'ios'){
        this.setData({
          isIOS: true
        })
      }else{
        this.setData({
          isIOS: false
        })
      }
    }
  }
})
