var app = getApp()

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getMessage(id, obj) {
  wx.request({
    url: app.globalData.ip + '/getMsg.php',
    data: {
      id: id
    },
    method: "POST",
    header: {
      'x-my-custom-header': 'some value'
    },
    success: function(res) {
      console.log(res)
      obj.setData({
        message: res.data
      })
    },
    fail: function(err) {
      console.log(err);
    }
  })
}

function getUser(obj) {
  obj.setData({
    hidden: false
  })
  // fetch(app.globalData.ip+'/getUser.php')  
  // .then(  
  //     function(response) {  
  //         if (response.status !== 200) {  
  //             console.log('错误码: ' +  
  //             response.status);  
  //             return;  
  //         }
  //         console.log(response)
  //         // Examine the text in the response  
  //         response.json().then(function(data) {  
  //             console.log(data);
  //             setTimeout(function(){
  //                 obj.setData({
  //                     list:data,
  //                     hidden: true,
  //                     toast1Hidden:false,
  //                     toastText:"拿到数据"
  //                 })
  //                 wx.stopPullDownRefresh()
  //             },3000) 
  //         });  
  //     }  
  // )  
  // .catch(function(err) {  
  //     obj.setData({
  //         hidden: true
  //     })
  //     console.log('Fetch Error :-S', err);  
  // });

  wx.request({
    url: "http://" + "localhost" + ":8022" + '/getUser.php',
    data: {},
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      console.log('res', res);
      setTimeout(function() {
        obj.setData({
          list: res.data,
          hidden: true,
          toast1Hidden: false,
          toastText: "get data"
        })
        wx.stopPullDownRefresh()
      }, 3000)

    },
    fail: function(err) {
      setTimeout(function() {
        obj.setData({
          hidden: true,
          toast1Hidden: false,
          toastText: "please check server"
        })
        wx.stopPullDownRefresh()
      }, 3000)
      console.log(err);
    }
  })
}

function getMoments(obj) {
  wx.request({
    url: "http://" + "localhost" + ":8022" + '/getMoments.php',
    data: {},
    header: {
      'Content-Type': 'application/json'
    },
    success: function(res) {
      obj.setData({
        moments: res.data
      })
    },
    fail: function(err) {
      console.log(err);
    }
  })
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getSessionId(data) {
  if (data.length !== 2) {
    throw 'params Error';
  } else {
    return data[0] > data[1] ? data[0] + '-' + data[1] : data[1] + '-' + data[0];
  }
}

module.exports = {
  formatTime: formatTime,
  getMessage: getMessage,
  getUser: getUser,
  getMoments: getMoments,
  getSessionId: getSessionId
}