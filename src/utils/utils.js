let formatDate = (nDate, date) => {
  if (isNaN(nDate.getTime())) {
    return '--'
  }
  let o = {
    'M+': nDate.getMonth() + 1,
    'd+': nDate.getDate(),
    'h+': nDate.getHours(),
    'm+': nDate.getMinutes(),
    's+': nDate.getSeconds(),
    'q+': Math.floor((nDate.getMonth() + 3) / 3),
    'S': nDate.getMilliseconds()
  }
  if (/(y+)/.test(date)) {
    date = date.replace(RegExp.$1, (nDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(date)) {
      date = date.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return date
}

let isValidMobile = (phone) => {
  let telReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[135678]|18[0-9]|14[579])[0-9]{8}$/
  if (telReg.test(phone.replace(/\s+/g, ''))) {
    return true
  }
  return false
}

let isEmptyObject = (obj) => {
  for (let i in obj) {
    return false
  }
  return true
}

let ifLogined = () => {
  let auth = wx.getStorageSync('auth') || {}
  if (auth.token && auth.uid) {
    return auth
  }
  return false
}

let navigatItem = (e) => {
  const url = e.currentTarget.dataset.url || '/pages/index/index'
  const open = e.currentTarget.dataset.open
  const toUrl = () => {
    wx.navigateTo({
      url,
    })
  }
  if (open) {
    toUrl()
  } else {
    if (ifLogined()) {
      toUrl()
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}

let pageReload = (scopeAuth, dataList) => {
  let auth = ifLogined()
  let dataEmpty = (list) => {
    let empty = false
    let item = null
    for (let i = 0, len = list.length; i < len; i++) {
      item = list[i]
      if (isEmptyObject(item)) {
        empty = true
        break
      }
    }
    return empty
  }
  if ((auth.token !== scopeAuth.token || auth.uid !== scopeAuth.uid) || dataEmpty(dataList)) {
    return true
  }
}

let cmpVersion = (left, right) => {
  if (typeof left + typeof right !== 'stringstring') {
    return false
  }
  let a = left.split('.')
  let b = right.split('.')
  let i = 0
  let len = Math.max(a.length, b.length)
  for (; i < len; i++) {
    if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
      return 1
    } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
      return -1
    }
  }
  return 0
}

var GetUrlRelativePath = function (url) {
  var arrUrl = url.split('//');
  var start = arrUrl[1].indexOf('/') + 1;
  var relUrl = arrUrl[1].substring(start);
  if (relUrl.indexOf('?') != -1) {
    relUrl = relUrl.split('?')[0];
  }
  return relUrl;
}

// get post id
// https://juejin.im/post/5b39bbcc5188252ce018c745
// 5b39bbcc5188252ce018c745 为 post id
var getPostIdByOriginalUrl = function (url) {
  return GetUrlRelativePath(url).split('/').slice(-1)[0]
};

let toPostDetail = (e) => {
  let item = e.currentTarget.dataset.item
  let postId = getPostIdByOriginalUrl(item.originalUrl)
  let entryId = item.objectId
  let t = item.type
  let url = ''
  let id = t === 'post' ? postId : entryId
  url = `/pages/post/post?id=${id}&type=${t}`
  wx.navigateTo({
    url,
  })
}

module.exports = {
  formatDate,
  isValidMobile,
  isEmptyObject,
  ifLogined,
  navigatItem,
  pageReload,
  cmpVersion,
  getPostIdByOriginalUrl,
  toPostDetail,
}