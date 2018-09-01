/*!
 * speedt-utils
 * Copyright(c) 2017 speedt <13837186852@qq.com>
 * MIT Licensed
 */
'use strict';

(function(window){
  var root = window;
  var previousSpeedT = root.speedt;

  var _ = function(obj){
    if(obj instanceof _) return obj;
    if(!(this instanceof _)) return new _(obj);
  };

  // nodejs
  if('undefined' !== typeof exports){
    if('undefined' !== typeof module && module.exports){
      exports = module.exports = _;
    }
    exports.speedt = _;
  }else{
    root.speedt = _;
  }

  _.size = function(obj){
    var count = 0;
    for(var i in obj){
      if(obj.hasOwnProperty(i) && 'function' !== typeof obj[i]) count++;
    }
    return count;
  };

  var padRight = _.padRight = function(str, char, len){
    return (str + Array(len).join(char)).slice(0, len);
  };

  var padLeft = _.padLeft = function(str, char, len){
    var _str = (Array(len).join(char) + str);
    return _str.slice(_str.length - len);
  };

  (function(){
    var regex = /.*[\u4e00-\u9fa5]+.*$/;
    /**
     * check if has Chinese characters.
     *
     * @param {String} str
     * @return
     */
    _.hasChineseChar = function(str){
      return regex.test(str);
    };
  })();

  (function(){
    var hexDigits = '0123456789abcdef';
    /**
     * uuid
     *
     * @param {Boolean} bool 是否加 "-" 分割
     * @return uuid
    */
    _.uuid = function(b){
      var s = [];
      for(var i=0; i<36; i++){
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = '4';                                       // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = b ? '-' : '';

      return s.join('');
    };
  })();

  (function(){
    var regex = /(-?\d+)(\d{3})/;
    /**
     * 货币格式
     *
     * @params
     * @return
     */
    _.currencyformat = function(n){
      n = n || 0;
      n = n + '';
      while(regex.test(n)){
        n = n.replace(regex, '$1,$2');
      }
      return n;
    };
  })();

  (function(){
    /* 生成随机字符串 */
    var a_z0_9A_Z = ['0','1','2','3','4','5','6','7','8','9',
                     'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                     'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    /**
     * 生成随机字符串
     *
     * @params {Number} n 长度
     * @return
     */
    _.randomStr = function(n){
      var str = '';
      for(var i=0; i<n; i++){
        str += (a_z0_9A_Z[Math.floor(Math.random() * 62)]);
      }
      return str;
    };
  })();

  (function(){
    var regex = /^0?1[3|4|5|8][0-9]\d{8}$/;
    /**
     * 检测手机号
     *
     * @params
     * @return
     */
    _.checkMobile = function(m){
      m = m || '';
      m = m +'';
      m = m.trim();
      if(regex.test(m)) return m;
    };
  })();

  /**
   * 检测数字
   *
   * @params
   * @return
   */
  (function(){
    var regex = /^\d+$/;
    _.checkNum = function(s){
      if(regex.test(s)) return (s - 0);
    };
  })();

  /**
   * 获取文件后缀
   *
   * @param
   * @return
   */
  _.getFileSuffix = function(file_name){
    var idx = file_name.lastIndexOf('.');
    var suffix = file_name.substring(idx, file_name.length);
    return suffix.toLowerCase();
  };

  (function(){
    function isEmpty(str){
      if(!str) return;
      str = str.trim();
      if('' !== str) return str;
    }

    /**
     *
     * @param
     * @return
     */
    _.isEmpty = function(str, defStr){
      return isEmpty(str) || defStr;
    }
  })();

  _.removeObjKey = function(obj, key){
    if(this.hasOwnProperty(obj, key)) delete obj[key];
  };

  _.hasOwnProperty = function(obj, key){
    if(obj.hasOwnProperty){
      return obj.hasOwnProperty(key);
    }
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  /**
   * 替换所有
   *
   * @params
   * @return
   */
  _.replaceAll = function(str, s, d){
    return str.replace(new RegExp(s, 'gm'), d);
  };

  /**
   * 格式化日期
   *
   * @params
   * @return
   */
  _.formatDate = function(format, date){
    if(!date) return '';
    date   = date   || new Date;
    format = format || 'hh:mm:ss.S';
    var o = {
      'Y+':          date.getFullYear(),
      'M+':  padLeft(date.getMonth() + 1,    '0', 2),  // month
      'd+':  padLeft(date.getDate(),         '0', 2),  // day
      'h+':  padLeft(date.getHours(),        '0', 2),  // hour
      'm+':  padLeft(date.getMinutes(),      '0', 2),  // minute
      's+':  padLeft(date.getSeconds(),      '0', 2),  // second
       'S': padRight(date.getMilliseconds(), '0', 3)   // millisecond
    }
    for(var k in o){
      if(new RegExp('('+ k +')').test(format)){
        format = format.replace(RegExp.$1, o[k]);
      }
    }
    return format;
  };

  /**
   * 数组转对象
   *
   * ['a', 1, 'b', 2] ==> { a: 1, b: 2 }
   *
   * @params
   * @return
   */
  _.arrToObj = function(arr){
    var obj = {};
    for(var i=0, j=arr.length; i<j; i++){
      obj[arr[i]] = arr[++i];
    }
    return obj;
  };

  _.noConflict = function(){
    root.speedt = previousSpeedT;
    return this;
  };

  // amd
  if('function' === typeof define && define.amd){
    define('speedt', [], function(){
      return _;
    });
  }
})('undefined' === typeof window ? {} : window);
