var fileHost = "http://test-buycarshop.oss-cn-beijing.aliyuncs.com"
var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`, //默认存在根目录，可根据需求改
  AccessKeySecret: 'QaucOO51i55dLUBolkJgs7p2qBn7oC',
  OSSAccessKeyId: 'LTAIvWyXwy6LwMKi',
  timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config
