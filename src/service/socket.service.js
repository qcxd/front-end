let socket
const host = require('../config').socket
const io = require('../lib/weapp.socket.io.js');
let token = wx.getStorageSync('user').token;
console.log('token...', token);
socket = io(host, {
    path:'/notification',
  query: {
    token,
    // fromSource: "mini"
  }
})
socket.on('connect', function() {
  console.log('connect....')
});


exports.sendMessage = (msg) => {
  console.log('send message',msg);
  if (msg.content.trim() !== '') {
    socket.emit('miniMessage', msg);
  }
}
 
exports.getSocket = () => {
  return socket
}