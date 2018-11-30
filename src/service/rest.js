const config = require('index').config;
const loading = require('./loading');

const header_pre = {
  'authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQd0MgTmV3IFZlbnR1cmVzIiwiaWF0IjoxNTQxNTc3MTE4LCJleHAiOjE2MDQ3MzU1MTgsImF1ZCI6InB3Yy5jb20iLCJzdWIiOiJQd0MgTmV3IFZlbnR1cmVzIHRlc3QgdG9rZW4iLCJjbGllbnROYW1lIjoiUHdDIE9uZUNoYXQifQ.d4_jlSqDndisproPjiy1zy1_aELwMYVLk_nQRwCGcTc',
  'content-type': 'application/json'
};

// const header_form = Object.assign({}, header, {'content-type': 'application/x-www-form-urlencoded'});


const _handleResponse = (res, {url, fromWp = false, success, fail}) => {

  console.log('res', res)
  console.log('fromWp', fromWp, url)
  if (fromWp) {
    if (!res.data.data.code || res.data.errMsg === 'request:ok') {
      console.log('_handle', res.data.data);
      success(res.data.data);
    } else {
      throw res.data.data.msg.error.message;
    }
  } else {
    if (res.data.code === 500) {
      throw res.data.msg;
    }

    success(res.data);
    // if (res.data.code === 200) {
    //   success(res.data);
    // } else {
    //
    // }
  }
}


// const _request = (method, url, data, fromWp = false, callback, needLoading = 'Loading') => {
// common request need promisify
// TODO options
// method: 'GET/POST' url: 'url', data: payloads, fromWp: 'is from workplace',
// callback: cb after request needLoading: is need loading
const _request = (...argus) => {
  // let options be the first argument
  let options = argus[0];
  let {
    method = 'GET',
    url,
    data = {},
    header = Object.assign({}, header_pre, header),
    success = function () { console.log('default success func') },
    fail = function () { console.log('default fail func') },
    fromWp = false,
    // needLoading = 'Loading'
  } = options;

  console.log(`== onechat ${method} api ==:`, url, '== options ==:', options);


  loading.show();
  wx.request({
    url: config.hostUrl + url,
    method: method,
    data: data,
    header: header,
    success: function (res) {
      console.log(`== res ==:`, res);

      _handleResponse(res, options);
      // status code == 200
      // if (res.statusCode == 200) {
      //   if (success) {
      //     success(res.data)
      //   }
      //
      // }
      // else {
      //   if (fail) {
      //     fail(res)
      //   }
      // }
    },
    fail: function (res) {
      console.log(res)
      if (fail) {
        fail(res)
      }
    },
    complete: function (dt) {
      loading.hide();
      console.log(dt, `- - - - - - --  this is dt`)
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


