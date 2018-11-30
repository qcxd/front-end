// pages/menu/menus.js
const apiService = require('../../service/api.service.js');
const apiServicePro = require('../../service/api/api-promisify.service');
Page({

  /**
   * Page initial data
   */
  data: {
    pwc_groups: [
      {
        id: "1919398498151419",
        members: {
          data: [{
            id: "100029874908285",
            name: "Jeremy Minhua Bao",
            administrator: true
          }]
        },
        name: "",
        choosed: false
      },
      {
        id: "1",
        members: {
          data: [{

          }]
        },
        name: "",
        choosed: false
      }
    ],
    suggestGroups: [
    ],
    user: {},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let user = wx.getStorageSync('user');
    this.getJoinGroupList(user.openid);
    this.requestGroups(user.openid);
  },

  //get groups from user info
  getJoinGroupList: function(openid) {
    let that = this;    
    return new Promise(function (resolve, reject) {
      apiServicePro.getUserByOpenid(openid).then(res => {
        console.log('getGroups', res);
        wx.setStorageSync('user', res.data);
        that.setData({
          user: res.data,
          pwc_groups: res.data.groups
        })
          return resolve(res.data.groups);
      }).catch(err => {
        return reject(err);
      })

      // apiService.getUserByOpenid(openid, (err, res) => {
      //   console.log('getGroups', res);
      //   wx.setStorageSync('user', res.data);
      //   that.setData({
      //     user: res.data,
      //     pwc_groups: res.data.groups
      //   })
      //   if (!err) {
      //     return resolve(res.data.groups);
      //   } else {
      //     return reject(err);
      //   }
      // })
    });
  },

  selectSuggestGroup: function (e) {
    var that = this;
    console.log('---selectGroup', e.currentTarget.dataset);
    var index = e.currentTarget.dataset.index;
    var joined = 'suggestGroups[' + index + '].joined';
    console.log(joined);
    //加入组
    const group = that.data.suggestGroups[index];
    let groups = [];
    groups.push(group);
    const param = {
      openid: that.data.user.openid,
      groups: groups
    }

    apiServicePro.addGroups(param).then(result => {
      that.data.pwc_groups.push(group);
      that.data.suggestGroups.splice(index, 1);
      that.setData({
        pwc_groups: that.data.pwc_groups,
        suggestGroups: that.data.suggestGroups
      })
    }).catch(err => {
      console.log(err, ' - - - menu err addGroups');
    })

    // apiService.addGroup(param, (err, result) => {
    //   that.data.pwc_groups.push(group);
    //   that.data.suggestGroups.splice(index, 1);
    //   that.setData({
    //     pwc_groups: that.data.pwc_groups,
    //     suggestGroups: that.data.suggestGroups
    //   })
    // })

    console.log(e, this);
  },

  requestGroups: function (openid) {
    let self = this;

    apiServicePro.groupNotJoin(openid).then(res => {
      const groups = res.data.map((group) => {
        group.joined = false;
        return group;
      })
      console.log('request group', groups);
      self.setData({
        suggestGroups: groups,
      })
    }).catch(err => {
      console.log(err, 'err request groups menu')
    });

    // apiService.groupNotJoin(openid, function (error, res) {
    //   const groups = res.data.map((group) => {
    //     group.joined = false;
    //     return group;
    //   })
    //   console.log('request group', groups);
    //   self.setData({
    //     suggestGroups: groups,
    //   })
    // });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})