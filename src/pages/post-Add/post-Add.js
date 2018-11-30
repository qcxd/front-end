
// pages/post-Add/post-Add.js
var app = getApp();
const apiService = require('../../service/api.service.js');
const apiServicePro = require('../../service/api/api-promisify.service');
const config = require('../../config');

Page({

  data: {
    userInfo: {},
    images:[], // images need to upload
    upload:[], // images uploaded url
    texts: '', // post content
    groupSelected: { // which group to post
      groupNumber: '',
      groupName: ''
    },
    isTriangleUp: false, // choose group status
    userGroups: [ // the groups that user added
      // {name: 'OnechatTest', id: '1919398498151419', privacy: 'CLOSED|OPEN'},
    ],
    // showAt: false, // show who need to at when enter @ key
    groupUsers: [ // the users in group that you choosed
      // { check: false, id:"100029874908285", name:"Jeremy Minhua Bao1" },
    ],
    // selectedUser: [], // the user need to be @
    // selectedUserid: [], // the user id need to be @
    canShare: false, // the status that shows the post can share or not
    isIOS: true
  },

  onLoad: function (options) {
    const sysInfo = app.globalData.sysInfo;
    if (sysInfo.platform == 'ios') {
      this.setData({
        isIOS: true
      })
    } else {
      this.setData({
        isIOS: false
      })
    }
    this.setData({
      userInfo: wx.getStorageSync('user'),
    })
    wx.showLoading({
      title: 'Loading',
      mask: true
    })

    apiServicePro.getUserByOpenid(this.data.userInfo.openid).then(res => {
      if(res.code == 200) {
        this.setData({
          userInfo:res.data,
          userGroups: res.data.groups
        })
      }
    }).then(err => {
      console.log(err, ' - - - getUserByOpenid post-Add');
    })

    // apiService.getUserByOpenid(this.data.userInfo.openid, (err, res)=>{
    //   // get user info and user groups
    //   if(!err&&res.code==200){
    //     this.setData({
    //       userInfo:res.data,
    //       userGroups: res.data.groups
    //     })
    //   }
    //   wx.hideLoading();
    // }, false)
  },

  selectPhoto() {
    // select the photo, not upload
    console.log('takePhoto');
      const self = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success:(res) => {
          const tempFilePaths = res.tempFilePaths;
          let images = [...this.data.images];
          for(let i=0;i<tempFilePaths.length;i++){
            let temp = {
              url: tempFilePaths[i]
            }
            images.push(temp);
          }
          
          this.setData({'images': images});
          if(this.data.images.length){
            this.setData({'canShare': true});
          }
        }
      });

  },
  cancleImage(e){
    // click the X and delete the will upload image
    let index = e.currentTarget.dataset.index;
    let images = this.data.images;
    images.splice(index,1);
    this.setData({images:images});
    if(!this.data.images.length){
      this.setData({'canShare': false});
    }
  },
  handleInput(e){
    // handle the input, check the content
    let text = e.detail.value;
    let canShare = this.checkContentData(text);
    // if(text.lastIndexOf('@')!=-1 && text.lastIndexOf('@') == text.length-1){
    //   this.setData({
    //     showAt: true
    //   })
    // }
    // text = this.clearChooseUser(text);
    this.setData({
      texts: text,
      canShare: canShare
    })
  },
  clearChooseUser(text){
    // clear the full @ like @[1234567] when delete it 
    let selectedUserid = this.data.selectedUserid;
    let selectedUser = this.data.selectedUser;
    let groupUsers = this.data.groupUsers;
    for(let i=0; i<selectedUserid.length; i++){
      let cal = text.length - text.lastIndexOf(selectedUserid[i]) - selectedUserid[i].length;
      console.log(cal);
      if(cal <= 0){
        text = text.replace(selectedUserid[i], '');
        for(let j=0;j<groupUsers.length;j++){
          let regexp = new RegExp(groupUsers[j].id);
          if(regexp.test(selectedUserid[i])){
            groupUsers[j].check = false;
          }
        }
        selectedUserid[i] = '';
        selectedUser.splice(i,1);
      }
    }
    selectedUserid = selectedUserid.filter(item => item!='');
    
    this.setData({
      selectedUserid,
      selectedUser,
      groupUsers
    })
    console.log(text)
    return text;
  },

  handleShare(){
    // share the post
    let text = this.data.texts;
    let image = this.data.images;
    let canShare = this.checkContentData(text);
    if(!canShare){
      return ;
    }
    
    let post = {
      groupNumber: this.data.groupSelected.groupNumber,
      posterId: this.data.userInfo.openid,
      posterAvatar: this.data.userInfo.avatarUrl,
      nickName: this.data.userInfo.nickName,
      groupName: this.data.groupSelected.groupName,
      context: text
    }
    console.log(post);
    let len = 0;
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    if(image.length){
      for (let i = 0; i < image.length; i += 1) {
        // upload all the images you choose

        apiService.uploadPhoto(image[i].url, this.data.userInfo.openid, (res)=>{
          if(res.statusCode == 200){
            len++;
            let upload = this.data.upload;
            upload.push({
              url: JSON.parse(res.data).data[0]
            })
            this.setData({upload: upload});
            console.log(res);
            if(len == image.length){
              post.images = upload;
              this.uploadInsertPost(post);
            }
          }
        });
      }
    }else{
      this.uploadInsertPost(post);
    }
  },
  uploadInsertPost(post){
    // share the post to server and workplace using different share link

    apiServicePro.insertPost(post).then(data => {
      console.log( data)
      if(data.code==200){
        let groupid = this.data.groupSelected.groupNumber;
        if(data.data.images.length){
          let image = config.imageHost + data.data.images[0].url;
          console.log('image', image);
          let message = `caption=[ From WeChat: ${post.nickName} ] ${post.context}&url=${image}`;
          console.log(message);
          this.insertPhotoToWP(groupid, message);
        }else{
          let message = `message=[ From WeChat: ${post.nickName} ] ${post.context}`;
          this.insertTextToWP(groupid, message);
        }

      }else{
        wx.showToast({
          title: 'share failed!',
          icon: 'none'
        })
        console.log('share post failed', data.msg)
      }
    }).catch((err) => {
      wx.showToast({
        title: 'share failed!',
        icon: 'none'
      })
      console.log('share post failed', err);
    });

    // apiService.insertPost(post,(err, data)=>{
    //   console.log(err, data)
    //   if(!err && data.code==200){
    //     let groupid = this.data.groupSelected.groupNumber;
    //     if(data.data.images.length){
    //       let image = config.imageHost + data.data.images[0].url;
    //       console.log('image', image);
    //       let message = `caption=[ From WeChat: ${post.nickName} ] ${post.context}&url=${image}`;
    //       console.log(message);
    //       this.insertPhotoToWP(groupid, message);
    //     }else{
    //       let message = `message=[ From WeChat: ${post.nickName} ] ${post.context}`;
    //       this.insertTextToWP(groupid, message);
    //     }
    //
    //   }else{
    //     wx.showToast({
    //       title: 'share failed!',
    //       icon: 'none'
    //     })
    //     console.log('share post failed', data.msg)
    //   }
    // }, false)
  },
  insertTextToWP(groupid, message){
    // share the plan text to workplace
    apiServicePro.postToWorkplaceTxt(groupid, message).then(res => {
      console.log('post to wp text')
      wx.hideLoading();
      wx.showToast({
        title: 'Send',
        icon: 'success'
      });
      wx.reLaunch({
        url: '/pages/post/post?groupid=' + groupid
      });
    }).catch((err) => {
      console.log(err);
    })

    // apiService.postToWorkplaceTxt(groupid, message, (res)=>{
    //   console.log('post to wp text')
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: 'Send',
    //     icon: 'success'
    //   });
    //   wx.reLaunch({
    //     url: '/pages/post/post?groupid=' + groupid
    //   });
    // })
  },
  insertPhotoToWP(groupid, message){

    apiServicePro.postToWorkplacePhoto(groupid, message).then(res => {
      console.log('photos:::',res);
      wx.hideLoading();
      wx.showToast({
        title: 'share success!',
        icon: 'none'
      });
      wx.reLaunch({
        url: '/pages/post/post?groupid=' + groupid
      });
    }).catch(err => {
      console.log(err, 'insertTextToWP');
    })

    // share the content including one photo to workplace
    // apiService.postToWorkplacePhoto(groupid, message, (res)=>{
    //   console.log('photos:::',res);
    //   wx.hideLoading();
    //   wx.showToast({
    //     title: 'share success!',
    //     icon: 'none'
    //   });
    //   wx.reLaunch({
    //     url: '/pages/post/post?groupid=' + groupid
    //   });
    // })
  },
  handleGrpupTriangle(){
    let temp = !this.data.isTriangleUp;
    this.setData({isTriangleUp: temp});
  },
  handleFocusGroup(){
    this.setData({isTriangleUp: true});
  },
  handleBlurGroup(){
    this.setData({isTriangleUp: false});
  },
  chooseGroup(e){
    const group = e.currentTarget.dataset.group;
    this.setData({
      groupSelected: {
        groupName: group.name,
        groupNumber: group.id
      }
    })
    this.getGroupUsers();
  },
  getGroupUsers(){
    // get all users in one group
    wx.showLoading({
      title: 'Loading',
      mask: true
    })

    apiServicePro.getGroupUsers(this.data.groupSelected.groupNumber)
      .then(res => {
        for(let i=0;i< res.data.length; i++){
          res.data[i].check = false;
        }
        this.setData({
          groupUsers: res.data
        })
        wx.hideLoading();
      }).catch(err => {
        console.log(err, 'getGroupUsers err');
    })

    // apiService.getGroupUsers(this.data.groupSelected.groupNumber, (err, res)=>{
    //   if(!err){
    //     for(let i=0;i< res.data.length; i++){
    //       res.data[i].check = false;
    //     }
    //     this.setData({
    //       groupUsers: res.data
    //     })
    //   }
    //   wx.hideLoading();
    // }, false)
  },
  handleCancelPerson(){
    let text = this.data.texts;
    text = text.substring(0, text.length-1);
    this.setData({
      showAt: false,
      selectedUser: [],
      texts: text
    })
  },
  handlePersonChange(e){
    let tempUser = [];
    let values = e.detail.value;
    let groupUsers = this.data.groupUsers;
    for(let i=0; i<groupUsers.length; i++){
      groupUsers[i].check = false;
    }
    for(let i=0; i<values.length; i++){
      let index = values[i];
      groupUsers[index].check = true;
      tempUser.push(groupUsers[index]);
    }
    this.setData({
      selectedUser: tempUser,
      groupUsers: groupUsers
    })
  },
  handleChoosePerson(){
    let str = '';
    let userid = []
    for(let i=0; i<this.data.selectedUser.length; i++){
      let groupid = this.data.selectedUser[i].id;
      str += ` @[${groupid}]`
      userid.push(` @[${groupid}`)
    }
    let text = this.data.texts.substring(0, this.data.texts.length-1) + str + ' ';
    this.setData({
      texts: text,
      showAt: false,
      selectedUserid: userid
    })

  },
  checkContentData(text){
    let canShare = false;
    if(text.length){
      canShare = true;
    }else{
      canShare = false;
    }
    let noSpace = /\S/g;
    if(!noSpace.test(text)){
      canShare = false;
    }
    if(this.data.images.length){
      canShare = true;
    }
    return canShare;
  }

})
