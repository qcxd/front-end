const rest = require('./rest');
const promisify = require('../utils/promisify');

module.exports = {
  get: promisify(rest.get),
  post: promisify(rest.post),
  post_form: promisify(rest.post_form)
}