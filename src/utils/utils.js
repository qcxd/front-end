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

const showModal = (title, content) => {
  wx.showModal({
    title: title ? title : '网络异常',
    content: content ? content : '网络异常，请稍后再试',
  })
}

const cityReplace = (val) => {
  return val.replace(/市$/, '');
}

/** 校验字段不能为空 */
const validateEmpty = (value, desc) => {
  if (!value) {
    wx.showToast({
      title: desc,
      icon: 'none',
    });
    return false;
  }
}

/** 校验上传图片 */
const validateImages = (images, desc) => {
  if (images.length <= 0) {
    wx.showToast({
      title: desc,
      icon: 'none',
    });
    return false;
  }
}

/** 校验手机号码格式 */
const validatePhone = (phone, desc) => {
  const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    wx.showToast({
      title: desc,
      icon: 'none',
    });
    return false;
  }
}

const phoneCall = (e) => {
  const phone = e.currentTarget.dataset.phone
  wx.makePhoneCall({
    phoneNumber: phone,
  })
}

module.exports = {
  formatDate,
  showModal,
  cityReplace,
  validateEmpty,
  validateImages,
  validatePhone,
  phoneCall
}