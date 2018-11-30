// const utils = require('../../utils/utils.js')
const apiService = require('../../service/api.service.js');
const app = getApp();
const apiServicePro = require('../../service/api/api-promisify.service');

Page({
  data: {
    user: {},
    groups: [],
    currentGroupId: '',
    posts: [],
    paging: {},
    pancelLeft: '586rpx',
    pancelTop: '80%',
    sysInfo: {},
    scrollSettings: {
      scrollTop: 0,
      top: 0,
      position: 'fixed'
    },
    reachedBottom: false,
    // reachedTop: false,
    reachedBottomTimer: 0,
    // reachedTopTimer: 0
  },

  onLoad(options) {

    console.log('onload')
    console.log(options);
    if(options.groupid){
      // add post back to here
      this.initBackData(options.groupid);
    }else {
      this.initData();
    }
    
  },
  onPageScroll(e){
    
    let scrollTop = e.scrollTop;
    let lastScrollTop = this.data.scrollSettings.scrollTop;
    let delta = scrollTop - lastScrollTop;
    let top = this.data.scrollSettings.top;
    if(this.data.reachedBottom){
      return;
    }
    top -= delta;
    if(top>=0){
      top = 0
    }
    if(top<=-142){
      top=-142
    }
    let temp = {
      scrollSettings: {
        position: 'fixed'
      }
    }
    if(scrollTop<=0){
      top = 0;
      scrollTop = 0;
      temp = {
        scrollSettings: {
          position: 'static',
          top
        }
      };
    }else {
      temp.scrollSettings = {
        top,
        position: 'fixed'
      }
    }
    this.setData(temp)
    this.data.scrollSettings.scrollTop = scrollTop;
    this.data.scrollSettings.top = top;
  },
  onReachBottom() {
    this.data.reachedBottom = true;
    let groupid = this.data.currentGroupId;
    let paging = this.data.paging;
    if(paging&&paging.next){
      this.refreshData(groupid, paging.next);
    }else{
      wx.showToast({
        title: 'No More Data',
        mask: true,
        icon: 'none'
      })
      clearTimeout(this.data.reachedBottomTimer);
      this.data.reachedBottomTimer = setTimeout(_ => {
        this.data.reachedBottom = false;
      }, 300)
    }
  },
  onPullDownRefresh() {
    let groupid = this.data.currentGroupId;
    this.setData({
      scrollSettings: {
        scrollTop: 0,
        top: 0,
        position: 'static'
      },
    })
    this.refreshData(groupid);
  },
  init(){
    this.data.groups = [];
    this.data.currentGroupId = '';
    this.data.posts = [];
    this.data.paging = {};
    let sysInfo = app.globalData.sysInfo;
    this.setData({
      scrollSettings: {
        scrollTop: 0,
        top: 0,
        position: 'static'
      },
      sysInfo: sysInfo
    });
  },
  initData(){
    
    this.init();
    let user = wx.getStorageSync('user');
    this.getGroupsByOpenid(user.openid).then(res => {
      let data = res.data;
      data.groups.ss = -1;
      this.setData({
        groups: data.groups,
        user: data,
      })
      if(!this.data.groups.length){
        // no groups
        return;
      }
      let groupid = this.data.groups[0].id;
      this.refreshData(groupid);
    })
  },
  initBackData(groupId){
    this.init();
    this.data.currentGroupId = groupId;
    let user = wx.getStorageSync('user');
    if(!user){
      return;
    }
    this.getGroupsByOpenid(user.openid).then(res => {
      let data = res.data;
      this.setData({
        user: data,
        groups: data.groups,
        currentGroupId: groupId
      })
      if(!this.data.groups.length){
        // no groups
        return;
      }
      
      this.refreshData(groupId);
    })
  },
  handleDataFormat(posts){
    for(let i=0; i<posts.length; i++){
      let random = '#' + Math.random();
      posts[i].from.avatar += random;
      if(posts[i].picture){
        posts[i].picture += random;
      }
    }
    return posts;
  },
  
  refreshData(groupid, params=null){
    // pull down refresh: params==null
    // pull up refresh: params!=null
    let posts = [];
    if(params != null){
      posts = this.data.posts;
    }
    this.getPosts(groupid, params).then(res => {
      wx.stopPullDownRefresh();
      if(!res.data.length){
        wx.showToast({
          title: 'No More Data',
          mask: true,
          icon: 'none'
        })
        this.data.reachedBottom = false;
        return;
      }
      posts = [...posts, ...res.data];
      let temp = {
        posts,
        paging: res.paging,
        currentGroupId: groupid,
        reachedBottom: false
      }
      this.setData(temp);
    })
  },
  formatPagingData(paging){
    let pre = paging.previous || null;
    let next = paging.next || null;
    if(pre!=null){
      let index = pre.indexOf('?');
      pre = pre.substr(index+1);
    }
    if(next!=null){
      let index = next.indexOf('?');
      next = next.substr(index+1);
    }
    paging.previous = pre;
    paging.next = next;
    return paging;
  },

  clearNotification(e) {
    if(e.detail.notificationCount == 0) {
      return wx.showToast({
        title: "No Notices.",
        mask: true,
        icon: 'none'
      });
    }else {
      let groupid = this.data.currentGroupId;
      this.refreshData(groupid);
    }
  },
  getGroupsByOpenid(openid) {
    return new Promise((resolve, reject) => {
      apiServicePro.getUserByOpenid(openid).then(res => {
        if(res.paging){
          res.paging = this.formatPagingData(res.paging);
        }
        return resolve(res);
      }).catch((err) => {
        return reject(err);
      })

      // apiService.getUserByOpenid(openid, (err, res) => {
      //   if (!err) {
      //     if(res.paging){
      //       res.paging = this.formatPagingData(res.paging);
      //     }
      //     return resolve(res);
      //   } else {
      //     return reject(err);
      //   }
      // })
    });
  },
  getPosts(groupId, params=null) {
    return new Promise((resolve, reject) => {
      apiServicePro.postLists(groupId, params).then(res => {
        if(res.paging){
          res.paging = this.formatPagingData(res.paging);
        }
        if(res.data){
          res.data = this.handleDataFormat(res.data);
        }
        return resolve(res);
      }).catch((err) => {
        return reject(err);
      })


      // apiService.postLists(groupId, params, (err, res) => {
      //   if (!err) {
      //     if(res.paging){
      //       res.paging = this.formatPagingData(res.paging);
      //     }
      //     if(res.data){
      //       res.data = this.handleDataFormat(res.data);
      //     }
      //     return resolve(res);
      //   } else {
      //     return reject(err);
      //   }
      // })
    });
  },
  addCommentByPostid(postId, message) {
    const data = {
      message: message
    }
    return new Promise(function(resolve, reject) {

      apiServicePro.addCommentOnPost(postId, data).then(res => {
        console.log('--addComment--- in promise', res);
        return resolve(res);
      }).catch((err) => {
        return reject(err);
      });
      // apiService.addCommentOnPost(postId, data, function(err, res) {
      //   console.log('--addComment--- in promise', res);
      //   if (!err) {
      //     return resolve(res);
      //   } else {
      //     return reject(err);
      //   }
      // })
    });
  },

  selectGroup: function(e) {
    let groupid = e.detail.id;
    console.log('select group', groupid);
    this.setData({
      currentGroupId: groupid
    })
    this.getPosts(groupid).then(res => {
      this.setData({
        posts: res.data,
        paging: res.paging
      })
    })
  },
 
  findPostByPostId(postid){
    let posts = this.data.posts;
    for(let i=0; i<posts.length; i++){
      if(posts[i].id == postid){
        return i;
      }
    }
    return false;
  },

  addComment(e) {
    console.log(e);
    let postid = e.detail.id;
    let user = this.data.user;
    let nativeMessage = e.detail.message;
    if(!postid||!nativeMessage.trim()){
      return;
    }
    let message = `[ From WeChat: ${user.nickName} ] ${nativeMessage}`;
    this.addCommentByPostid(postid, message).then(res => {
      console.log('comment response', res.id)
      let id = res.id;
      let comment = {
        id,
        message: nativeMessage,
        from: {
          name: this.data.user.nickName,
          avatar: this.data.user.avatarUrl
        }
      };
      let index = this.findPostByPostId(postid);
      let post = this.data.posts[index];
      if(!post.comments){
        post.comments = {
          data: []
        }
      }
      post.comments.data.push(comment);
      this.setData({
        [`posts[${index}]`]: post
      })
    })
  },


  goToPostAdd() {
    wx.navigateTo({
      url: '/pages/post-Add/post-Add',
    })
  },
  handleMove(e) {
    let query = wx.createSelectorQuery().in(this);
    query.select('#pancel').boundingClientRect().exec(res => {
      const w = res[0].width / 2;
      const h = res[0].height / 2;
      const sysInfo = this.data.sysInfo;
      const maxTop = sysInfo.windowHeight - res[0].top - res[0].height;
      const maxLeft = sysInfo.windowWidth - res[0].left - res[0].width;
      if (maxTop <= 0 || res[0].top <= 0 || res[0].left <= 0 || maxLeft <= 0) {
        return;
      }
      this.setData({
        pancelLeft: `${e.touches[0].clientX - w}px`,
        pancelTop: `${e.touches[0].clientY - h}px`
      })
    })
  },
  handleMoveEnd() {
    let query = wx.createSelectorQuery().in(this);
    query.select('#pancel').boundingClientRect().exec(res => {
      const w = res[0].width / 2;
      const h = res[0].height / 2;
      const sysInfo = this.data.sysInfo;
      const maxHeight = sysInfo.windowHeight - res[0].top - res[0].height;
      const maxLeft = sysInfo.windowWidth - res[0].left - res[0].width;
      if (maxHeight <= 0) {
        this.setData({
          pancelTop: `${sysInfo.windowHeight - h*2 - 1}px`
        })
      }
      if (res[0].top <= 0) {
        this.setData({
          pancelTop: `1px`
        })
      }
      if (res[0].left <= 0) {
        this.setData({
          pancelLeft: `1px`,
        })
      }
      if (maxLeft <= 0) {
        this.setData({
          pancelLeft: `${sysInfo.windowWidth - w*2 - 1}px`
        })
      }
    })
  },



})