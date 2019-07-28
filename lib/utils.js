/*!
 * speedt-utils
 * Copyright(c) 2014 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs');

var utils = module.exports;

utils.invokeCallback = function(cb){
	if(cb && 'function' === typeof cb){
		cb.apply(null, Array.prototype.slice.call(arguments, 1));
	}
};

utils.size = function(obj){
	var count = 0;
	for(var i in obj){
		if(obj.hasOwnProperty(i) && 'function' !== typeof obj[i]) count++;
	}
	return count;
};

/**
 * format date
 *
 * @param {String} format 'YY/MM/dd hh:mm:ss.S'
 * @return
 */
utils.format = function(date, format){
	var that = this;
	date = date || new Date;
	format = format || 'hh:mm:ss.S';
	var o = {
		'Y+': date.getFullYear(),
		'M+': this.padLeft(date.getMonth() + 1, '0', 2),     // month
		'd+': this.padLeft(date.getDate(), '0', 2),          // day
		'h+': this.padLeft(date.getHours(), '0', 2),         // hour
		'm+': this.padLeft(date.getMinutes(), '0', 2),       // minute
		's+': this.padLeft(date.getSeconds(), '0', 2),       // second
		'S':  this.padRight(date.getMilliseconds(), '0', 3)  // millisecond
	}
	for(var k in o){
		if(new RegExp('('+ k +')').test(format)){
			format = format.replace(RegExp.$1, o[k]);
		}
	}
	return format;
};

utils.padRight = function(str, char, len){
	return (str + Array(len).join(char)).slice(0, len);
};

utils.padLeft = function(str, char, len){
	var str1 = (Array(len).join(char) + str);
	return str1.slice(str1.length - len);
};

(function (utils){
	var regex = /.*[\u4e00-\u9fa5]+.*$/;
	/**
	 * check if has Chinese characters.
	 *
	 * @param {String} str
	 * @return
	 */
	utils.hasChineseChar = function(str){
		return regex.test(str);
	};
})(utils);

utils.loadConfigFile = function(path){
	if(fs.existsSync(path)){
		var file = require(path);
		return file;
	}
	console.error('[%s] invalid configuration with file path: %j.', this.format(), path);
};

(function (utils){
	var hexTable = [];
	for(var i=0; i<256; i++){
		hexTable[i] = (i <= 15 ? '0' : '') + i.toString(16);
	}
	var ObjectID = require('mongodb').ObjectID;
	/**
	 * 根据指定的时间，生成自定义ObjectId
	 *
	 * @params {Date} time
	 * @return
	 */
	utils.genObjectId = function(time){
		var obj = new ObjectID();
		if(!time) return obj.toString();
		var id = obj.generate(parseInt(time/1000, 10));
		var hexString = '';
		for(var i=0; i<id.length; i++){
			hexString += hexTable[id.charCodeAt(i)];
		}
		return hexString;
	};
})(utils);

(function (utils){
	var hexDigits = '0123456789abcdef';
	/**
	 * uuid
	 *
	 * @param {Boolean} bool 是否加 "-" 分割
	 * @return uuid
	 */
	utils.uuid = function(b){
		var s = [];
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = b ? '-' : '';

		var uuid = s.join('');
		return uuid;
	};
})(utils);

(function (utils){
	var regex = /(-?\d+)(\d{3})/;
	/**
	 * 货币格式
	 *
	 * @params
	 * @return
	 */
	utils.currencyformat = function(num){
		num = num || 0;
		num = num + '';
		while(regex.test(num)){
			num = num.replace(regex, '$1,$2');
		}
		return num;
	};
})(utils);

utils.cache = require('./cache');
utils.mysql = require('./mysql');
utils.mysql_util = require('./mysql_util');
utils.md5 = require('./md5');
utils.service = require('../service');
utils.express = require('./express');

(function (utils){
	/* 生成随机字符串 */
	var a_z0_9A_Z = ['0','1','2','3','4','5','6','7','8','9',
					'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
					'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	/**
	 * 生成随机字符串
	 *
	 * @params {Number} num 长度
	 * @return
	 */
	utils.randomStr = function(num){
		var str = '';
		for(var i=0; i<num; i++){
			str += (a_z0_9A_Z[Math.floor(Math.random() * 62)]);
		}
		return str;
	};
})(utils);

(function (utils){
	var regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	/**
	 * 判断是否是Email格式
	 *
	 * @params
	 * @return
	 */
	utils.checkEmail = function(email){
		return regex.test(email);
	};
})(utils);

(function (utils){
	var regex = /^0?1[3|4|5|8][0-9]\d{8}$/;
	/**
	 * 检测手机号
	 *
	 * @params
	 * @return
	 */
	utils.checkMobile = function(mobile){
		mobile = mobile || '';
		mobile = mobile +'';
		mobile = mobile.trim();
		return regex.test(mobile) ? mobile : '';
	};
})(utils);

/**
 * 替换所有
 *
 * @params
 * @return
 */
utils.replaceAll = function(str, s, d){
	return str.replace(new RegExp(s, 'gm'), d);
};