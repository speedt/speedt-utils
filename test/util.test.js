/*!
 * speedt-utils
 * Copyright(c) 2017 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

const assert = require('assert');
const util = require('../lib/util.js');

describe('util', function(){
  it('#randomStr', function (done){
  	console.log(util.randomStr(6));
    done();
  });
});
