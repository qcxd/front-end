const config = require('../index').config;
const rest = require('../rest-promisify');

// Group
const getGroups = () => rest.get({url:'/api/v1/wp/groups?fields=id,name,members'});

const addGroups = (data) => rest.post({url: '/user/insertGroup', data});

const groupNotJoin = (openid) => rest.get({url: `/api/v1/wp/groupsNotJoinList/${openid}/?fields=id,name,members`});

const getGroupUsers = (groupid) =>rest.get(`/api/v1/wp/group/${groupid}/users`);

module.exports = {
  getGroups,
  addGroups,
  groupNotJoin,
  getGroupUsers
}