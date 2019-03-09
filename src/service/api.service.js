const config = require('../config.js')

const _request = (method, url, data, fromWp = false, callback, needLoading ='Loading') => {
  if(needLoading){
    wx.showLoading({
      title: needLoading === '1' ? 'Loading' : needLoading,
      mask: true
    })
  }
  let token = '';
  try {
    token = wx.getStorageSync('token');
  } catch (e) {
    console.log('获取token异常');
  }
  wx.request({
    url: config.hostUrl + url,
    method: method,
    data: data,
    header: {
      'authorization': 'Bearer ' + token,
      'content-type': 'application/json'
    },
    success: function(res) {
      _handleResponse(res, fromWp, callback);
      if(needLoading){
        wx.hideLoading()
      }
    },
    fail: function(res) {
      callback(res);
      if(needLoading){
        wx.hideLoading();
      }
    }
  });
}

const _handleResponse = (res, fromWp, callback) => {
  console.log('res', res)
  console.log('fromWp', fromWp)
  if (fromWp) {
    if (!res.data.data.code || res.data.errMsg === 'request:ok') {
      console.log('_handle', res.data.data);
      callback(null, res.data.data);
    } else {
      throw res.data.data.msg.error.message;
    }
  } else {
    if (res.data.code === 500) {
      throw res.data.msg;
    }
    callback(null, res.data)
  }
}

const postToWorkplace = (url, message, cb) => {
  wx.request({
    url: config.hostUrl + url,
    method: 'post',
    data: message,
    header: {
      'authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQd0MgTmV3IFZlbnR1cmVzIiwiaWF0IjoxNTQxNTc3MTE4LCJleHAiOjE2MDQ3MzU1MTgsImF1ZCI6InB3Yy5jb20iLCJzdWIiOiJQd0MgTmV3IFZlbnR1cmVzIHRlc3QgdG9rZW4iLCJjbGllbnROYW1lIjoiUHdDIE9uZUNoYXQifQ.d4_jlSqDndisproPjiy1zy1_aELwMYVLk_nQRwCGcTc',
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      cb(res)
    },
    fail: function(res) {
      cb(res)
    }
  })
}





const _post = ( url, data, fromWp, callback, needLoading=true) => {
  _request('post', url, data, fromWp, callback, needLoading);
};
const _get = function (url, fromWp, callback, needLoading=true) {
  _request('get', url, null, fromWp, callback,needLoading);
};



const insertUser = (user, cb, needLoading=true) => {
  return _post('/user/insertUser', user, false, cb, needLoading);
}
const getOpenid = (code, cb, needLoading=true) => {
  return _get('/mini/getOpenid?code=' + code, false, cb, needLoading);
}
const getUser = (cb, needLoading=true) => {
  return _post( '/user/getUser', {}, false, cb, needLoading);
}
const insertPost = (post, cb, needLoading=true) => {
  return _post( '/post/insertPost', post, false, cb, needLoading);
}
const getGroups = (cb, needLoading=true) => {
  return _get('/api/v1/wp/groups?fields=id,name,members', true, cb, needLoading);
}
const addGroup = (data, cb, needLoading=true) => {
  return _post('/user/insertGroup', data, false, cb, needLoading);
}
const addCommentOnPost = (postId, data, cb, needLoading=true) => {
  const requestUrl = '/api/v1/wp/' + postId + '/comments';
  return _post(requestUrl, data, true, cb, needLoading);
}
const replyComment = (commentId, data, cb, needLoading=true) => {
  const requestUrl = '/api/v1/wp/' + commentId + '/comments';
  return _post(requestUrl, data, true, cb, needLoading);
}
const sendMessage = (data,cb, needLoading = true) => {
  const requestUrl = '/proxy/v2.6/me/messages';
  return _post(requestUrl, data, false, cb, needLoading);
}
const getMember = (id, cb, needLoading = true) => {
  const requestUrl = '/proxy/' + id +'?fields=email,name,picture';
  return _get(requestUrl, true, cb, needLoading);
}

const postLists = (groupId, params, cb, needLoading=true) => {
  let url = 'fields=permalink_url,from,to,story,type,message,link,created_time,updated_time,likes,comments,picture';
  if(params){
    url = params;
  }
  const requestUrl = '/api/v1/wp/group/' + groupId + '/posts?' + url;
  return _get(requestUrl, true, cb, needLoading);
}



const getUserByOpenid = (openid, cb, needLoading=true) => {
  return _get('/user/getUser/' + openid, false, cb, needLoading);
}


const postToWorkplaceTxt = (groupid, message, cb) => {
  return postToWorkplace(`/api/v1/wp/group/${groupid}/post1`, message, cb);
}

const postToWorkplacePhoto = (groupid, message, cb) => {
  return postToWorkplace(`/api/v1/wp/group/${groupid}/image`, message, cb);
}
const groupNotJoin = (openid, cb, needLoading=true) => {
  return _get('/api/v1/wp/groupsNotJoinList/' + openid + '?fields=id,name,members', true, cb, needLoading);
}
const getGroupUsers = (groupid, cb, needLoading=true) => {
  return _get(`/api/v1/wp/group/${groupid}/users`, true, cb, needLoading)
}
const getAllUsers = (cb, needLoading=true) => {
  return _get(`/api/v1/wp/users?fields=picture,id,name`, true, cb, needLoading)
}


const getSingleComment = (commentId, cb, needLoading=true) => {
  const requestUrl = '/api/v1/wp/' + commentId;
  return _get(requestUrl, false, cb, needLoading);
}



const uploadPhoto = (filePath, openid, cb) => {
  console.log(filePath, openid);
  wx.uploadFile({
    url: config.hostUrl + '/file/upload',
    filePath: filePath,
    header: {
      'authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQd0MgTmV3IFZlbnR1cmVzIiwiaWF0IjoxNTQxNTc3MTE4LCJleHAiOjE2MDQ3MzU1MTgsImF1ZCI6InB3Yy5jb20iLCJzdWIiOiJQd0MgTmV3IFZlbnR1cmVzIHRlc3QgdG9rZW4iLCJjbGllbnROYW1lIjoiUHdDIE9uZUNoYXQifQ.d4_jlSqDndisproPjiy1zy1_aELwMYVLk_nQRwCGcTc',
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
  insertUser: insertUser,
  getOpenid: getOpenid,
  getUser: getUser,
  insertPost: insertPost,
  uploadPhoto: uploadPhoto,
  getGroups: getGroups,
  getUserByOpenid: getUserByOpenid,
  postToWorkplaceTxt,
  postToWorkplacePhoto,
  addGroup: addGroup,
  postLists: postLists,
  groupNotJoin: groupNotJoin,
  addCommentOnPost: addCommentOnPost,
  replyComment: replyComment,
  getGroupUsers,
  getSingleComment: getSingleComment,
  getAllUsers: getAllUsers,
  getMember: getMember,
  sendMessage: sendMessage
  
}