const config = require('../index').config;
const rest = require('../rest-promisify');

const uploadPhoto = (filePath, openid) => {
  console.log(filePath, openid);

  wx.uploadFile({
    url: config.hostUrl + '/file/upload',
    filePath: filePath,
    header: {
      'authorization': 'Bearer ' + ''
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
  uploadPhoto
}