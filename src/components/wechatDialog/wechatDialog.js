// components/wechatDialog/wechatDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    qrcode: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  methods: {
    closeWechat() {
      this.triggerEvent('closeWechat', {}, {})
    },

    /**  保存微信二维码 */
    saveWechat() {
      const _this = this;
      const qrcode = _this.properties.qrcode;
      wx.downloadFile({
        url: qrcode,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            _this.saveImg(res.tempFilePath);
          }
        }
      })
    },

    /** 保存临时文件 */
    saveImg(filePath) {
      wx.saveImageToPhotosAlbum({
        filePath: filePath, // 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径
        success(res) {
           wx.showToast({
            title: '已保存到系统相册',
          })
        },
        file(err) {
          showModal();
        }
      })
    },
  }
})
