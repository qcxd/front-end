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
const getOpenid = (code, needLoading = '1') => rest.get({ url: '/mini/getOpenid?code=' + code, needLoading: needLoading });


/**
 * 创建用户
 * @param {}
 */
const insertUser = (user, needLoading = '1') => rest.post({ url: '/user/insertUser', data: user, needLoading: needLoading });

/**
 * 更新用户信息
 * @param {}
 */
const updateUser = (params, needLoading = '1') => rest.post({ url: `/user/updateUser`, data: params, needLoading: needLoading });

/**
 * 获取用户信息
 * @param {}
 */
const getUserInfo = (needLoading = '1') => rest.get({ url: `/user/userInfo`, needLoading: needLoading });

/**
 * 获取城市列表
 * @param {}
 */
const getCityList = (params, needLoading = '1') => rest.post({ url: `/user/district`, data: params, needLoading: needLoading });

/**
 * 获取城市列表
 * @param {}
 */
const getAllDistrict = (params, needLoading = '1') => rest.post({ url: `/user/allDistrict`, data: params, needLoading: needLoading });

/**
 * 创建店铺
 * @param {}
 */
const createShop = (params, needLoading = '1') => rest.post({ url: `/shop/createShop`, data: params, needLoading: needLoading });

/**
 * 更新店铺
 * @param {}
 */
const updateShop = (params, needLoading = '1') => rest.post({ url: `/shop/updateShop`, data: params, needLoading: needLoading });

/**
 * 店铺列表
 * @param {}
 */
const getShopList = (params, needLoading = '1') => rest.post({ url: `/shop/list`, data: params, needLoading: needLoading });

/**
 * 通过店铺id获取店铺信息
 */
const getShopDetail = (id, needLoading = '1') => rest.get({ url: `/shop/getShop?id=${id}`, needLoading: needLoading });

/**
 * 收藏店铺
 */
const followShop = (params, needLoading = '1') => rest.post({ url: `/shop/follow`, data: params, needLoading: needLoading });

/**
 * 加入仓库
 */
const joinWarehouse = (params, needLoading = '1') => rest.post({ url: `/shop/joinWarehouse`, data: params, needLoading: needLoading });

/**
 * 仓库店铺列表
 */
const getWarehouseList = (params, needLoading = '1') => rest.post({ url: `/shop/warehouseList`, data: params, needLoading: needLoading });

/**
 * 仓库汽车列表
 */
const getWarehouseCarList = (params, needLoading = '1') => rest.post({ url: `/shop/warehouseCarList`, data: params, needLoading: needLoading });

/**
 * 创建汽车
 */
const createCar = (params, needLoading = '1') => rest.post({ url: `/car/createCar`, data: params, needLoading: needLoading });

/**
 * 更新汽车
 */
const updateCar = (params, needLoading = '1') => rest.post({ url: `/car/updateCar`, data: params, needLoading: needLoading });

/**
 * 通过汽车id获取汽车详情
 */
const getCarDetail = (id, needLoading = '1') => rest.get({ url: `/car/detail/${id}`, needLoading: needLoading });

/**
 * 获取用户数据分析
 */
const getUserStatistics = (needLoading = '1') => rest.get({ url: `/user/statistics`, needLoading: needLoading });

/**
 *  品牌列表
 */
const getCarBrands = (hot = false, needLoading = '1') => rest.get({ url: `/car/brands?hot=${hot}`, needLoading: needLoading });

/**
 *  某个品牌详细信息
 */
const getCarBrandDetail = (brand_id, needLoading = '1') => rest.get({ url: `/car/brand/${brand_id}`, needLoading: needLoading });

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
  updateShop,
  getShopList,
  getShopDetail,
  followShop,
  joinWarehouse,
  getWarehouseList,
  getWarehouseCarList,
  createCar,
  updateCar,
  getCarDetail,
  getUserStatistics,
  getCarBrands,
  getCarBrandDetail
}

