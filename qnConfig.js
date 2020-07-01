'use strict';


// AccessKey/SecretKey
var AK_SK = {
  'qn': {
    // 2020-01-18
    AK: 'xxx',
    SK: 'xxx'
  },
};

var curAK_SK = AK_SK['qn'];

var qnConfig = {
  // demo: {
  //   prefix: "",
  //   qnAK: curAK_SK.AK,
  //   qnSK: curAK_SK.SK,
  //   qnBucketUIS: "www-xxx-com", // your bucket name
  //   // qnDomainUIS: "//7xr4hg.com1.z0.glb.clouddn.com/",  // //xxxx.xxx.xx.glb.clouddn.com
  //   qnDomainUIS: "//static.xxx.com/",  // //xxxx.xxx.xx.glb.clouddn.com
  // },
  cdn: {
    prefix: "",
    qnAK: curAK_SK.AK,
    qnSK: curAK_SK.SK,
    qnBucketUIS: "static-cloudai-net", // your bucket name
    qnDomainUIS: "//static.cloudai.net/"  // //xxxx.xxx.xx.glb.clouddn.com
  },
};

module.exports = qnConfig.cdn;
