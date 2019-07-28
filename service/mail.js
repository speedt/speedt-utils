/*!
 * speedt-utils
 * Copyright(c) 2014 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	velocity = require('velocityjs');

var path = require('path'),
	cwd = process.cwd(),
	mailconf = require(path.join(cwd, 'settings')).mail;

var mailer = require('nodemailer'),
	transport = null;

function init(){
	transport = mailer.createTransport('SMTP', mailconf);
}

/**
 *
 * @params
 * @return
 */
exports.sendMail = function(opts, cb){
	opts = opts || {};
	opts.from = opts.from || mailconf.auth.user;
	opts.to = opts.to || mailconf.to.join(',');

	if(!transport) init();

	// send html mail
	if(!!opts.template){
		return this.sendTempMail(opts, cb);
	}

	transport.sendMail(opts, function (err, info){
		cb(err, info);
	});
};


(function (exports){
	/**
	 * 发送HTML邮件（带模板的）
	 *
	 * @params
	 * @return
	 */
	exports.sendTempMail = function(opts, cb){
		// 0为模板文件路径
		// 1为数据
		// 2为macro宏
		var temp = opts.template;
		// 获取模板
		getTemplate(temp[0], function (err, template){
			if(err) return cb(err);
			// 模板+数据生成HTML
			opts.html = velocity.render(template, temp[1], temp[2]);
			// start send mail
			transport.sendMail(opts, function (err, info){
				cb(err, info);
			});
		});
	};

	/**
	 * 获取模板
	 *
	 * @params
	 * @return
	 */
	function getTemplate(path, cb){
		fs.readFile(path, 'utf8', function (err, template){
			if(err) return cb(err);
			cb(null, template);
		});
	};
})(exports);