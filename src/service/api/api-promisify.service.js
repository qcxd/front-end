const config = require('../index').config;
const rest = require('../rest-promisify');


// User
// const insertUser = (user) => rest.post({url: '/user/insertUser', data: user});

const getUser = () => rest.post({url: '/user/getUser'});

const getUserByOpenid = (openid) => rest.get({url: `/user/getUser/${openid}`});

const getAllUsers = () => rest.get({url: `/api/v1/wp/users?fields=picture,id,name`, fromWp: true});


// Group
const getGroups = () => rest.get({url:'/api/v1/wp/groups?fields=id,name,members', fromWp: true});

const addGroups = (data) => rest.post({url: '/user/insertGroup', data});

const groupNotJoin = (openid) => rest.get({url: `/api/v1/wp/groupsNotJoinList/${openid}/?fields=id,name,members`, fromWp: true});

const getGroupUsers = (groupid) =>rest.get({url: `/api/v1/wp/group/${groupid}/users`, fromWp: true});


// wx functions use old api examples
// upload photo
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
/**********************mini-car*******************/
/**
 * 获取openid
 */
const getOpenid = (code) => rest.get({ url: '/mini/getOpenid?code=' + code });


/**
 * 创建用户
 * @param {}
 */
const insertUser = (user) => rest.post({ url: '/user/insertUser', data: user });

/**
 * 更新用户信息
 * @param {}
 */
const updateUser = (params) => rest.post({ url: `/user/updateUser`, data: params });

/**
 * 获取用户信息
 * @param {}
 */
const getUserInfo = () => rest.get({ url: `/user/userInfo` });

/**
 * 获取城市列表
 * @param {}
 */
const getCityList = (params) => rest.post({ url: `/user/district`, data: params });

/**
 * 获取城市列表
 * @param {}
 */
const getAllDistrict = (params) => rest.post({ url: `/user/allDistrict`, data: params });

/**
 * 创建店铺
 * @param {}
 */
const createShop = (params) => rest.post({ url: `/shop/createShop`, data: params });

/**
 * 店铺列表
 * @param {}
 */
const getShopList = (params) => rest.post({ url: `/shop/list`, data: params });

/**
 * 通过店铺id获取店铺信息
 */
const getShopDetail = (id) => rest.get({ url: `/shop/getShop?id=${id}` });

/**
 * 收藏店铺
 */
const followShop = (params) => rest.post({ url: `/shop/follow`, data: params });

/**
 * 加入仓库
 */
const joinWarehouse = (params) => rest.post({ url: `/shop/joinWarehouse`, data: params });

/**
 * 仓库店铺列表
 */
const getWarehouseList = (params) => rest.post({ url: `/shop/warehouseList`, data: params });

/**
 * 仓库汽车列表
 */
const getWarehouseCarList = (params) => rest.post({ url: `/shop/warehouseCarList`, data: params });

/**
 * 创建汽车
 */
const createCar = (params) => rest.post({ url: `/shop/createCar`, data: params });

/**
 * 获取用户数据分析
 */
const getUserStatistics = () => rest.get({ url: `/user/statistics` });



module.exports = {
  getOpenid,
  getUser,
  getUserByOpenid,
  getAllUsers,
  // Group
  getGroups,
  addGroups,
  groupNotJoin,
  getGroupUsers,
  // WX Func
  uploadPhoto,
  // mini-car
  insertUser,
  updateUser,
  getUserInfo,
  getCityList,
  getAllDistrict,
  createShop,
  getShopList,
  getShopDetail,
  followShop,
  joinWarehouse,
  getWarehouseList,
  getWarehouseCarList,
  createCar,
  getUserStatistics
}

