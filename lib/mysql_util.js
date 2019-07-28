/*!
 * speedt-utils
 * Copyright(c) 2014 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

var path = require('path'),
	cwd = process.cwd();

var mysql = require('./mysql');

var utils = module.exports;

/**
 * 获取全部数据
 *
 * @param
 * @return
 */
utils.getAll = function(columns, table_name, orderbys, limit, cb){
	var params = [ table_name ];

	var sql = select_table_sql(columns);
	sql += orderby_sql(orderbys);

	mysql.query(sql, params, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 通过主键获取单条记录
 *
 * @param
 * @return
 */
utils.getById = function(columns, table_name, id, cb){
	var params = [ table_name, id ];

	var sql = select_table_sql(columns);
	sql += ' WHERE id=?';

	mysql.query(sql, params, function (err, doc){
		if(err) return cb(err);
		cb(null, doc);
	});
};

/**
 * 模糊查询
 *
 * @param
 * @return
 */
utils.find = function(columns, table_name, wheres, orderbys, limit, cb){
	var sql = select_table_sql(columns);
	// where begin
	var where_sqls = where_sql(wheres);
	sql += where_sqls[0];
	// where end
	sql += orderby_sql(orderbys);

	var params = where_sqls[1];
	params.splice(0, 0, table_name);

	mysql.query(sql, params, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 查询表sql
 *
 * @param
 * @return
 */
function select_table_sql(columns){
	var sql = 'SELECT ';
	sql += (!columns) ? '*' : columns.join(', ');
	sql += ' FROM ??';
	return sql;
}

/**
 * where sql
 *
 * @param
 * @return
 */
function where_sql(wheres){
	var params = [];
	var _where = '';
	for(var i in wheres){
		var where = wheres[i];
		_where += ' AND ?? '+ where[1] +' ?';
		params.push(where[0]);
		params.push(where[2]);
	}
	_where = _where.substring(4);
	_where = ' WHERE'+ _where;

	return [_where, params];
}

/**
 * 排序 sql
 *
 * @param
 * @return
 */
function orderby_sql(orderbys){
	var _orderby = '';
	if(!orderbys) return _orderby;
	for(var i in orderbys){
		var orderby = orderbys[i];
		_orderby += ', '+ orderby[0] +' '+ orderby[1];
	}
	_orderby = _orderby.substring(1);
	_orderby = ' ORDER BY'+ _orderby;
	return _orderby;
}