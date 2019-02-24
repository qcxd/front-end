


var host = "14592619.qcloud.la"
// var socket = "http://localhost:3002"
var socket = "https://www.peajs.top"
// var hostUrl = "http://localhost:3002"
var hostUrl = "https://www.peajs.top/qcxd"
// var hostUrl = "http://localhost:8002"

var fileHost = "http://test-buycarshop.oss-cn-beijing.aliyuncs.com"

var config = {

  host,
  hostUrl,

  loginUrl: `https://${host}/login`,

  requestUrl: `https://${host}/testRequest`,

  openIdUrl: `https://${host}/openid`,

  tunnelUrl: `https://${host}/tunnel`,

  paymentUrl: `https://${host}/payment`,

  templateMessageUrl: `https://${host}/templateMessage`,

  uploadFileUrl: `https://${host}/upload`,

  downloadExampleUrl: `https://${host}/static/weapp.jpg`,

  socket,

  // aliyun OSS config
  uploadImageUrl: `${fileHost}`, // 默认存在根目录，可根据需求改
  AccessKeySecret: 'QaucOO51i55dLUBolkJgs7p2qBn7oC',
  OSSAccessKeyId: 'LTAIvWyXwy6LwMKi',
  timeout: 87600 // 这个是上传文件时Policy的失效时间
};

module.exports = config
