/**
 * return 
 * {
 *   error: true|false,
 *   data: ...
 * }
 * 
 */
const ERR_KEY = 'error';
const DATA_KEY = 'data';
function getStorage(key){
    try{
        let data = wx.getStorageSync(key);
        return throwData(data);
    }catch(e){
        return throwErr(e);
    } 
}
function setStorage(key, value){
    try{
        wx.setStorageSync(key, value);
        return throwData('success');
    }catch(e){
        return throwErr(e);
    }
}
function removeStorage(key){
    try{
        wx.removeStorageSync(key);
        return throwData('success');
    }catch(e){
        return throwErr(e);
    }
}

function isInStorage(key){
    let info = wx.getStorageInfoSync();
    let keys = info.keys;
    if(keys.length<=0){
        return false;
    }

    for(let i=0;i<keys.length;i++){
        if(keys[i] === key){
            return true;
        }
    }
    return false;
}

function throwErr(e){
    let ret = {};
    ret[DATA_KEY] = e;
    ret[ERR_KEY] = true;
    return ret;
}

function throwData(data){
    let ret = {};
    ret[DATA_KEY] = data;
    ret[ERR_KEY] = false;
    return ret;
}




function checkCache(key){
    let inStorage = isInStorage(key);
    let data = null;
    if(inStorage){
        data = getStorage(key);
    }else {
        data = {};
        data[DATA_KEY] = 'no data';
        data[ERR_KEY] = true;
    }
    return data;
}




module.exports = {
    checkData: checkCache,
    setData: setStorage,
    delData: removeStorage
}