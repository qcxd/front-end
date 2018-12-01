const config = require('../index').config;
const rest = require('../rest-promisify');


// Workplace
const postToWorkplace = (url, message) => rest.post_form({url, data: message});

const postToWorkplaceTxt = (groupid, message) => postToWorkplace(`/api/v1/wp/group/${groupid}/post1`, message);

const postToWorkplacePhoto = (groupid, message) =>postToWorkplace(`/api/v1/wp/group/${groupid}/image`, message);


// User
const insertUser = (user) => rest.post({url: '/user/insertUser', data: user});

const getOpenid = (code) => rest.get({url: '/mini/getOpenid?code='+code});

const getUser = () => rest.post({url: '/user/getUser'});

const getUserByOpenid = (openid) => rest.get({url: `/user/getUser/${openid}`});

const getAllUsers = () => rest.get({url: `/api/v1/wp/users?fields=picture,id,name`, fromWp: true});


// Post
const insertPost = (post) => rest.post({url: '/post/insertPost', data: post});

const addCommentOnPost = (postId, data) => rest.post({url: `/api/v1/wp/${postId}/comments`, data, fromWp: true});

const replyComment = (commentId, data) => rest.post({url: `/api/v1/wp/${commentId}/comments`, data, fromWp: true});

const postLists = (groupId, params) => rest.get({
  url: `/api/v1/wp/group/${groupId}/posts?${params?params:'fields=permalink_url,from,to,story,type,message,link,created_time,updated_time,likes,comments,picture'}`,
  fromWp: true
});

const getSingleComment = (commentId) => rest.get({url: `/api/v1/wp/${commentId}`});


// Chat
const sendMessage = (data) => rest.post({url: '/proxy/v2.6/me/message', data});

const getMember = (id) => rest.get({url: `/proxy/${id}?field=email,name,picture`, fromWp: true});


// Group
const getGroups = () => rest.get({url:'/api/v1/wp/groups?fields=id,name,members', fromWp: true});

const addGroups = (data) => rest.post({url: '/user/insertGroup', data});

const groupNotJoin = (openid) => rest.get({url: `/api/v1/wp/groupsNotJoinList/${openid}/?fields=id,name,members`, fromWp: true});

const getGroupUsers = (groupid) =>rest.get({url: `/api/v1/wp/group/${groupid}/users`, fromWp: true});



// wx functions use old api examples
// upload photo
const uploadPhoto = (filePath, openid) => {
  console.log(filePath, openid);

  wx.uploadFile({
    url: config.hostUrl + '/file/upload',
    filePath: filePath,
    header: {
      'authorization': 'Bearer ' + ''
    },
    name: 'file',
    formData: {
      'openid': openid
    },
    success(res) {
      cb(res);
    }
  })
}

module.exports = {
  // Workplace
  postToWorkplaceTxt,
  postToWorkplacePhoto,
  // User
  insertUser,
  getOpenid,
  getUser,
  getUserByOpenid,
  getAllUsers,
  // Post & Comment
  insertPost,
  addCommentOnPost,
  replyComment,
  postLists,
  getSingleComment,
  // Chat
  sendMessage,
  getMember,
  // Group
  getGroups,
  addGroups,
  groupNotJoin,
  getGroupUsers,
  // WX Func
  uploadPhoto
}
