const rest = require('./rest');
// const promisify = require('../promisify');

const promisify = (api) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
    });
  }
}

module.exports = {
  get: promisify(rest.get),
  post: promisify(rest.post),
  post_form: promisify(rest.post_form)
}


