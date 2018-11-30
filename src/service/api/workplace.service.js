const rest = require('../rest-promisify');

// Workplace
const postToWorkplace = (url, message) => rest.post_form({url, data: message});

const postToWorkplaceTxt = (groupid, message) => postToWorkplace(`/api/v1/wp/group/${groupid}/post1`, message);

const postToWorkplacePhoto = (groupid, message) =>postToWorkplace(`/api/v1/wp/group/${groupid}/image`, message);

module.exports = {
  postToWorkplaceTxt,
  postToWorkplacePhoto
};

