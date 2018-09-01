/*!
 * speedt-utils
 * Copyright(c) 2017 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

const crypto = require('crypto');
const _      = require('underscore');
const util   = require('./util');

var exports = module.exports;

exports.genApikey = function(){
  var diffiehellman = crypto.createDiffieHellman(256);
  var key = diffiehellman.generateKeys('base64');
  return key.toString('utf-8');
};

exports.genSeckey = function(){
  return this.genApikey();
};

exports.validate = function(data, seckey){
  let sign1 = data.signature;
  let sign2 = this.genSignature(data, seckey);
  // console.log(encodeURIComponent(sign2))
  return sign1 === sign2;
};

exports.genSignature = function(data, seckey){
  // seckey = 'KFD85H9SmyZd8FSopX_CxxG5VgLFW71LiYc35PxZWXABX9BsANvPUQpLBCrPz25JpSy2_bt2Z0gWRCA6ePsKww';
  // data = 'apiKey=J4_EFO3ZlBZynJC7dACIFiivoCniAvJlLr-H_dIex-eAdyz1ykGgMtrvcJ7PBCrPKsJRuPaiRKdDuL5LTL_Jag&command=listAccounts&listAll=true&response=json';

  util.removeObjKey(data, 'signature');

  let arr  = obj2Arr(data);
  let sign = crypto.createHmac('sha1', seckey).update(arr.join('')).digest().toString('base64');

  return sign;
};

/**
 * 对象Key Value 转数组
 *
 * @param
 * @return 新数组
 */
const obj2Arr = obj => {
  let keys   = _.keys(obj);
  let sortBy = _.sortBy(keys, key => key);

  let arr = [];

  for(let key of sortBy){
    arr.push(key);
    // arr.push('=');
    arr.push(obj[key]);
  }
  return arr;
}