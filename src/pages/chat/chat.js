// pages/chat/chat.js

const socketService = require('../../service/socket.service.js')
const ApiService = require('../../service/api.service.js')
var util = require('../../utils/util.js');
let index, isConnected = false;
Page({

  data: {
    input: '',
    user: '',
    messages: [],
    to: '',
    lastMessage: '',
    sessionId: '',
    client: {}
  },

  onLoad: function(options) {
    const self = this;
    const user = wx.getStorageSync('user') || [];
    var sessionId = util.getSessionId([options.openid, user.openid]);
    console.log('sessionId', sessionId);
    var messages = wx.getStorageSync(sessionId) || [];
    ApiService.getMember(options.openid, (err, result) => {
      this.setData({
        client: result
      })
    })


    this.setData({
      messages,
      user,
      openid: options.openid,
      sessionId
    });
    index = messages.length;
    this.setData({
      messages
    });
    this.receiceMessage();
    this.pageScrollToBottom();
    wx.getNetworkType({
      success: this.setNetwork
    });
  },


  setNetwork({
    networkType
  }) {
    isConnected = networkType !== 'none';
  },
  // =============== mask event ================
  maskClick(e) {
    this.setData({
      popMask: false
    });
  },
  // ===========================================


  // ========== send&receive message ===========

  receiceMessage() {
    const that = this;
    const socket = socketService.getSocket();
    socket.on('receive-message', (message) => {
      console.log('receive-message', message, that.data.openid)
      if (message.sender.id == that.data.openid) {
        console.log('ok');
        that.generateReceiveMessage(message.message.text)
      }
    })
  },

  generateReceiveMessage(content) {
    let message = {
      nickName: this.data.client.name,
      from: this.data.openid,
      to: this.data.user.openid,
      avatarUrl: this.data.client.picture.data.url,
      type: 1, // voice
      content,
      sent: true
    };
    this.data.messages.push(message);
    this.setData({
      messages: this.data.messages
    })
    console.log('this.data.messages', this.data.messages)
    wx.setStorageSync(this.data.sessionId, this.data.messages);
  },


  resendMessage(e) {
    wx.showModal({
      title: 'Resend?',
      content: '',
      cancelText: 'No',
      confirmText: 'Yes',
      success: (res) => {
        if (res.confirm && isConnected) {
          const messages = [...this.data.messages];
          messages[e.currentTarget.id].sent = true;
          wx.setStorageSync('messages', messages);
          this.setData({
            messages
          });
        }
      },
    })
  },

  sendMessage(e) {
    if (this.data.input.length > 0) {
      const socket = socketService.getSocket();
      console.log('miniMessage');
      ApiService.sendMessage(this.generateWpMessage(1, this.data.input), (data) => {
        console.log('data', data);
      }, 'Sending');
      this.pushWpMessage(this.data.input);
      setTimeout(_=>{
        this.setData({
          input: ''
        });
      }, 0)
    }
  },
  generateWpMessage(messageType, text) {
    let message = {
      "recipient": {
        "ids": this.data.openid
      },
      "message": {
        "text": '[from wechat ' + this.data.user.nickName + '] ' + text
      },
    }
    return message;
  },

  pushWpMessage(content) {
    let message = {
      nickName: this.data.user.nickName,
      from: this.data.user.openid,
      to: this.data.openid,
      avatarUrl: this.data.user.avatarUrl,
      type: 1, // voice
      content,
      sent: true
    };
    this.data.messages.push(message);
    this.setData({
      messages: this.data.messages
    })
    wx.setStorageSync(this.data.sessionId, this.data.messages);
  },


  // ===========================================


  // ============== other message ==============

  onOtherClick(e) {
    this.setData({
      popMask: true
    });
  },
  onAlbumClick(e) {
    const self = this;
    this.setData({
      popMask: false
    });
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        for (let i = 0; i < tempFilePaths.length; i += 1) {
          self.pushMessage(self.generateLocalMessage(self.data.user.nickName, self.data.user.avatarUrl, 2, tempFilePaths[i]));
        }
      }
    });
  },

  // onCameraClick(e) {
  //   const self = this;
  //   this.setData({
  //     popMask: false
  //   });
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original'],
  //     sourceType: ['camera'],
  //     success: function(res) {
  //       const tempFilePaths = res.tempFilePaths
  //       for (let i = 0; i < tempFilePaths.length; i += 1) {
  //         self.pushMessage(self.generateLocalMessage(self.data.user.nickName, self.data.user.avatarUrl, 2, tempFilePaths[i]));
  //       }
  //     }
  //   });
  // },

  









  pageScrollToBottom: function() {
    const messages = [...this.data.messages];
    if (messages.length >= 1) {
      setTimeout(() => {
        this.setData({
          lastMessage: messages[messages.length - 1].id
        });
      }, 300);
    }
  },

  iptFocus: function() {},

  // ================= helper ==================

  iptInput(e) {
    this.setData({
      input: e.detail.value
    });
  },

  generateSocketMessage(type, content) {
    return {
      nickName: this.data.user.nickName,
      from: this.data.user.openid,
      to: this.data.openid,
      avatarUrl: this.data.user.avatarUrl,
      type, // voice
      content
    };
  },

  generateLocalMessage(nickName, avatarUrl, type, content, openid) {
    return {
      id: 'm' + index++,
      id2: '2',
      nickName,
      openid,
      avatarUrl,
      type, // voice
      content: content ? content : ' ',
      sent: isConnected
    };
  },





})