


var host = "14592619.qcloud.la"
// var socket = "http://localhost:3002"
var socket = "https://www.peajs.top"
// var hostUrl = "http://localhost:3002"
// var hostUrl = "https://www.peajs.top/onechat"
var hostUrl = "http://localhost:8002"

var imageHost = "https://www.peajs.top"

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
  imageHost
};

module.exports = config
