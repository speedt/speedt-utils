/*!
 * speedt-utils
 * Copyright(c) 2017 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

const BufferHelper = require('bufferhelper'),
      iconv = require('iconv-lite'),
      querystring = require('querystring');

const sendReq = (request, uri, data, charset) => {
  data = querystring.stringify(data || {});

  uri.headers = uri.headers || {};
  uri.headers['Content-Length'] = Buffer.byteLength(data);

  return new Promise((resolve, reject) => {
    let req = request(uri, res => {
      let bh = new BufferHelper();

      res.setTimeout(3 * 1000, () => {
        console.error('[ERROR] %s response timeout.', (new Date().getTime()));
      });

      res.on('data', chunk => {
        bh.concat(chunk);
      });

      res.on('end', () => {
        try{
          resolve(iconv.decode(bh.toBuffer(), charset || 'utf-8'));
        }catch(e){ reject(e); }
      });

      res.on('error', reject);
    });

    req.setTimeout(3 * 1000, () => {
      console.error('[ERROR] %s request timeout.', (new Date().getTime()));
    });

    req.on('error', reject);

    req.write(data);
    req.end();
  });
};

/**
 * 返回HTML字符串
 *
 * @params
 * @return
 */
exports = module.exports = sendReq;

// /**
//  * 获取http或https
//  *
//  * @params
//  * @return
//  */
// function getReq(uri){
//   return (0 === uri.indexOf('https:')) ? https.request : http.request;
// }

// sendReq('http://www.xiaoluo.cc/v/index434.html', 'gbk', function (err, html){
//   if(err) return console.error(err);
//   console.log(html);
// });