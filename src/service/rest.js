const config = require('index').config;
const loading = require('./loading');

let token = '';
try {
  token = wx.getStorageSync('token');
  console.log('token***' , token);
} catch (e) {
  console.log('获取token异常');
}
const header_pre = {
  'authorization': 'Bearer ' + token,
  'content-type': 'application/json'
};

const _handleResponse = (res, {url, success, fail}) => {
  if (res.data.code === 500) {
    throw res.data.msg;
  }
  success(res.data);
}

const _request = (...argus) => {
  console.log(header_pre);
  let options = argus[0];
  let {
    method = 'GET',
    url,
    data = {},
    header = Object.assign({}, header_pre, header),
    success = function () { console.log('default success func') },
    fail = function () { console.log('default fail func') },
    // needLoading = 'Loading'
  } = options;
  loading.show();
  wx.request({
    url: config.hostUrl + url,
    method: method,
    data: data,
    header: header,
    success: function (res) {
      _handleResponse(res, options);
    },
    fail: function (res) {
      if (fail) {
        fail(res)
      }
    },
    complete: function (dt) {
      loading.hide();
    }
  });
};

const _get = (...argus) => _request(Object.assign({}, argus[0], {method: 'GET'}));
const _post = (...argus) => _request(Object.assign({}, argus[0], {method: 'POST'}));
const _post_form = (...argus) => _request(
  Object.assign({},
    argus[0],
    {
      method: 'POST',
      header: {
        'authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQd0MgTmV3IFZlbnR1cmVzIiwiaWF0IjoxNTQxNTc3MTE4LCJleHAiOjE2MDQ3MzU1MTgsImF1ZCI6InB3Yy5jb20iLCJzdWIiOiJQd0MgTmV3IFZlbnR1cmVzIHRlc3QgdG9rZW4iLCJjbGllbnROYW1lIjoiUHdDIE9uZUNoYXQifQ.d4_jlSqDndisproPjiy1zy1_aELwMYVLk_nQRwCGcTc',
        'content-type': 'application/x-www-form-urlencoded'
      }
    }));

let rest = {
  get: _get,
  post: _post,
  post_form: _post_form
};

module.exports = rest;


