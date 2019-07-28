/*!
 * speedt-utils
 * Copyright(c) 2014 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

var utils = module.exports;

(function (utils){
	var str1 = '参数异常';

	/**
	 * post数据校验
	 *
	 * @params {Object}
	 * @params {Object}
	 * @return {Object}
	 */
	utils.valiPostData = function(req, res, next){
		var data = req.body.data;
		if(!data) return res.send({ success: false, msg: str1 });

		try{
			data = JSON.parse(data);
			if('object' === typeof data){
				req._data = data;
				return next();
			}
			res.send({ success: false, msg: str1 });
		}catch(ex){
			res.send({ success: false, msg: ex.message });
		}
	};

	/**
	 * get数据校验
	 *
	 * @params {Object}
	 * @params {Object}
	 * @return {Object}
	 */
	utils.valiGetData = function(req, res, next){
		var data = req.query.data;
		if(!data) return res.send(500, str1);
		try{
			data = JSON.parse(data);
			if('object' === typeof data){
				req._data = data;
				return next();
			}
			res.send(500, str1);
		}catch(ex){
			res.send(500, ex.message);
		}
	};
})(utils);
