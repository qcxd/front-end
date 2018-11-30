const config = require('../index').config;
const rest = require('../rest-promisify');

// User
const insertUser = (user) => rest.post({url: '/user/insertUser', data:{user}});

const getOpenid = (code) => rest.get({url: '/mini/getOpenid?code='+code});

const getUser = () => rest.post({url: '/user/getUser'});

const getUserByOpenid = (openid) => rest.get({url: `/user/getUser/${openid}`});

const getAllUsers = () => rest.get(`/api/v1/wp/users?fields=picture,id,name`);


module.exports = {
  insertUser,
  getOpenid,
  getUser,
  getUserByOpenid,
  getAllUsers
}