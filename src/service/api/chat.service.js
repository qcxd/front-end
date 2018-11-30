const config = require('../index').config;
const rest = require('../rest-promisify');

// Chat
const sendMessage = (data) => rest.post({url: '/proxy/v2.6/me/message', data});

const getMessage = (id) => rest.get({url: `/proxy/${id}?field=email,name,picture`});

module.exports = {
  sendMessage,
  getMessage
}