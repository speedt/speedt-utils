/*!
 * speedt-utils
 * Copyright(c) 2014 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = module.exports;

var cache_arr = {};
/**
 * 缓存初始化
 *
 * @param
 * @return
 */
function getCaches(){
	if(!cache_arr) cache_arr = {};
	return cache_arr;
}

/**
 * 获取缓存
 *
 * @param
 * @return
 */
utils.get = function(cache_name, cache_time, funcs, cb){
	var cache = getCaches()[cache_name];
	// 判断缓存是否存在
	if(!cache){
		// 创建新缓存
		cache = {};
		getCaches()[cache_name] = cache;
	}else{
		if(new Date() < cache.last_time){
			return cb(null, cache.data);
		}
	}

	// 重设缓存间隔时间
	cache.last_time = new Date();
	cache.last_time = new Date(cache.last_time.valueOf() + cache_time);

	funcs.push(function (err, data){
		if(err) return cb(err);
		cache.data = data;
		cb(null, cache.data);
	});

	var func = funcs[0];
	func.apply(null, Array.prototype.slice.call(funcs, 1));
};

/**
 * 移除缓存
 *
 * @param
 * @return
 */
utils.remove = function(cache_name){};