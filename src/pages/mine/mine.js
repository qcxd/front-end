var app = getApp()
Page({
  data: {
    userInfo: {},
    list: [
      {
        list_tool: [
          {
            img: "../../image/photo.png",
            name: "My Posts"
          },
          {
            img: "../../image/sc_2.png",
            name: "Favorites",
            url: "../upload/upload"
          }
        ]
      },
      {
        list_tool: [
          {
            img: "../../image/money.png",
            name: "Wallet",
            url: "../audio/audio"
          },
          {
            img: "../../image/card.png",
            name: "Cards & Offers",
            url: "../picker/picker"
          }
        ]
      },
      {
        list_tool: [
          {
            img: "../../image/bq_2.png",
            name: "Sticker Gallery"
          },
          {
            img: "../../image/setting.png",
            name: "Settings",
            url: "../info/info"
          }
        ]
      },
    ]
  },
  goPage: function (event) {
    console.log(event.currentTarget.dataset.log);
    wx.navigateTo({
      url: event.currentTarget.dataset.url
    })
  },
  onLoad: function () {
    // wx.showNavigationBarLoading();
    var that = this
    this.get
    that.setData({
      userInfo: wx.getStorageSync('user')
    })
  }
})
