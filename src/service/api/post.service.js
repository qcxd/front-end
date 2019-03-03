const config = require('../index').config;
const rest = require('../rest-promisify');


// Post
const insertPost = (post) => rest.post({url: '/post/insertPost', data: post});

const addCommentOnPost = (postId, data) => rest.post({url: `/api/v1/wp/${postId}/comments`, data});

const replyComment = (commentId, data) => rest.post({url: `/api/v1/wp/${commentId}/comments`, data});

const postLists = (groupId, params) => rest.get({
  url: `/api/v1/wp/group/${groupId}/posts?${params?params:'fields=permalink_url,from,to,story,type,message,link,created_time,updated_time,likes,comments,picture'}`
});

const getSingleComment = (commentId) => rest.get({url: `/api/v1/wp/${commentId}`});

module.exports = {
  insertPost,
  addCommentOnPost,
  replyComment,
  postLists,
  getSingleComment
}