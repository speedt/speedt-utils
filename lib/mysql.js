/*!
 * speedt-utils
 * Copyright(c) 2014 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

var mysql = require('mysql');

var path = require('path'),
	cwd = process.cwd(),
	mysqlconf = require(path.join(cwd, 'settings')).mysql;

var pool = null;

/**
 *
 * @param
 * @return
 */
function initPool(){
	pool = mysql.createPool(mysqlconf);
}

/**
 *
 * @param
 * @return
 */
exports.query = function(sql, params, cb){
	if(!pool) initPool();

	pool.getConnection(function (err, conn){
		if(err) return cb(err);
		conn.query(sql, params, function (err, docs, fields){
			conn.release();
			cb(err, docs, fields);
		});
	});
};

/**
 * 检测唯一性
 *
 * @param {Array} docs
 * @return {Boolean}
 */
exports.checkOnly = function(docs){
	return !!docs && 1 === docs.length;
}

/**
 * sql格式化
 *
 * @param
 * @return
 */
exports.format = function(sql, params){
	return mysql.format(sql, params);
};