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
const getOpenid = (code, loading = '1') => rest.get({ url: '/mini/getOpenid?code=' + code, loading: loading });


/**
 * 创建用户
 * @param {}
 */
const insertUser = (user, loading = '1') => rest.post({ url: '/user/insertUser', data: user, loading: loading });

/**
 * 更新用户信息
 * @param {}
 */
const updateUser = (params, loading = '1') => rest.post({ url: `/user/updateUser`, data: params, loading: loading });

/**
 * 获取用户信息
 * @param {}
 */
const getUserInfo = (loading = '1') => rest.get({ url: `/user/userInfo`, loading: loading });

/**
 * 获取城市列表
 * @param {}
 */
const getCityList = (params, loading = '1') => rest.post({ url: `/user/district`, data: params });

/**
 * 获取城市列表
 * @param {}
 */
const getAllDistrict = (params, loading = '1') => rest.post({ url: `/user/allDistrict`, data: params, loading: loading });

/**
 * 创建店铺
 * @param {}
 */
const createShop = (params, loading = '1') => rest.post({ url: `/shop/createShop`, data: params, loading: loading });

/**
 * 店铺列表
 * @param {}
 */
const getShopList = (params, loading = '1') => rest.post({ url: `/shop/list`, data: params, loading: loading });

/**
 * 通过店铺id获取店铺信息
 */
const getShopDetail = (id, loading = '1') => rest.get({ url: `/shop/getShop?id=${id}`, loading: loading });

/**
 * 收藏店铺
 */
const followShop = (params, loading = '1') => rest.post({ url: `/shop/follow`, data: params, loading: loading });

/**
 * 加入仓库
 */
const joinWarehouse = (params, loading = '1') => rest.post({ url: `/shop/joinWarehouse`, data: params, loading: loading });

/**
 * 仓库店铺列表
 */
const getWarehouseList = (params, loading = '1') => rest.post({ url: `/shop/warehouseList`, data: params, loading: loading });

/**
 * 仓库汽车列表
 */
const getWarehouseCarList = (params, loading = '1') => rest.post({ url: `/shop/warehouseCarList`, data: params, loading: loading });

/**
 * 创建汽车
 */
const createCar = (params, loading = '1') => rest.post({ url: `/car/createCar`, data: params, loading: loading });

/**
 * 通过汽车id获取汽车详情
 */
const getCarDetail = (id, loading = '1') => rest.get({ url: `/car/detail/${id}`, loading: loading });

/**
 * 获取用户数据分析
 */
const getUserStatistics = (loading = '1') => rest.get({ url: `/user/statistics`, loading: loading });

/**
 *  品牌列表
 */
const getCarBrands = (hot = false, loading = '1') => rest.get({ url: `/car/brands?hot=${hot}`, loading: loading });

/**
 *  某个品牌详细信息
 */
const getCarBrandDetail = (brand_id, loading = '1') => rest.get({ url: `/car/brand/${brand_id}`, loading: loading });

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
  getCarDetail,
  getUserStatistics,
  getCarBrands,
  getCarBrandDetail
}

