/**
 * Check tool for String,Time,moblie,email,etc.
 * author: Keel
 * 1.0.9: telCN,mobileCN,email,bjx增加非空检查;新增strInt,strIntRange方法;
 * 1.0.11: 修复正则校验前检测是否为string;
 */
'use strict';



/**
 * to millisecond
 * @param  {int} year
 * @param  {int} month
 * @param  {int} day
 * @param  {int} [hour]
 * @param  {int} [min]
 * @param  {int} [sec]
 * @param  {int} [millisecond]
 * @return {int}
 */
const timeToMS = function(year, month, day, hour, min, sec, ms) {
  const d = new Date();
  d.setFullYear(year, month - 1, day);
  d.setHours(hour || 0, min || 0, sec || 0, ms || 0);
  return d.getTime();
};

//返回以分为单位的整数，小数只支持两位，两位以上直接截断忽略
const priceStrParse = function(priceStr) {
  if (!priceStr.match(/^[\d]+[\\.]?[\d]*$/g)) {
    throw new Error('no priceStr');
  }
  const pointPo = priceStr.indexOf('.');
  const pLen = priceStr.length;
  if (pointPo < 0) {
    return parseInt(priceStr + '00');
  }
  if (pointPo === pLen - 1) {
    return parseInt(priceStr.substring(0, pLen - 1) + '00');
  }
  const intNum = priceStr.substring(0, pointPo);
  let deciNumEnd = pointPo + 3;
  let deciAdd = '';
  if (pLen - pointPo === 2) {
    //1位小数特别处理
    deciNumEnd = pointPo + 2;
    deciAdd = '0';
  }
  // console.log('deciNumEnd', deciNumEnd, 'pLen', pLen, 'pointPo', pointPo);
  const deciNum = priceStr.substring(pointPo + 1, deciNumEnd);
  // console.log('intNum:', intNum, 'deciNum', deciNum);
  return parseInt('' + intNum + deciNum + deciAdd);
};


const twoInt = function(int) {
  return (int < 10) ? '0' + int : int;
};

const threeInt = function(int) {
  if (int < 10) {
    return '00' + int;
  } else if (int < 100) {
    return '0' + int;
  } else {
    return '' + int;
  }
};
/**
 * millisecond to 'yyyy-MM-dd hh:mm:ss'
 * @param  {int} millSeccond
 * @return {string}
 */
const msToTime = function(millSec) {
  const d = millSec ? new Date(millSec) : new Date();
  const re = d.getFullYear() + '-' + twoInt(d.getMonth() + 1) + '-' + twoInt(d.getDate()) + ' ' + twoInt(d.getHours()) + ':' + twoInt(d.getMinutes()) + ':' + twoInt(d.getSeconds());
  return re;
};


/**
 * millisecond to 'yyyy-MM-dd hh:mm:ss:ms'
 * @param  {int} millSeccond
 * @return {string}
 */
const msToTimeWithMs = function(millSec) {
  const d = millSec ? new Date(millSec) : new Date();
  const re = d.getFullYear() + '-' + twoInt(d.getMonth() + 1) + '-' + twoInt(d.getDate()) + ' ' + twoInt(d.getHours()) + ':' + twoInt(d.getMinutes()) + ':' + twoInt(d.getSeconds()) + ':' + d.getMilliseconds();
  return re;
};

/**
 * 格式化时间,为避免错误，不支持12小时制
 * @param  {string} formatStr 默认为 'yyyyMMddHHmmss'
 * @param  {int} millSec   millSeccond
 * @return {string}
 */
const timeFormat = function(formatStr, millSec) {
  const d = millSec ? new Date(millSec) : new Date();
  const df = {
    'YYYY': d.getFullYear(),
    'yyyy': d.getFullYear(),
    'MM': twoInt(d.getMonth() + 1),
    // 'DD': twoInt(d.getDate()),//年中的天数
    'dd': twoInt(d.getDate()),
    'HH': twoInt(d.getHours()),
    // 'hh': (d.getHours() < 12) ? twoInt(d.getHours()) : twoInt(d.getHours() - 12),//12小时制
    'mm': twoInt(d.getMinutes()),
    'ss': twoInt(d.getSeconds()),
    'SSS': threeInt(d.getMilliseconds()),
  };
  if (!formatStr) {
    formatStr = 'yyyyMMddHHmmss'; //默认格式
  }
  for (const i in df) {
    formatStr = formatStr.replace(new RegExp(i, 'g'), df[i]);
  }
  return formatStr;
};

const timeFormatParse = function(timeStr, formatStr) {
  if (timeStr.length != formatStr.length) {
    throw new Error('[ERR]timeFormatParse timeStr:' + timeStr + '|formatStr:' + formatStr + ';');
  }
  const d = new Date(0);
  const df = {
    'YYYY': (t) => d.setFullYear(parseInt(t)),
    'yyyy': (t) => d.setFullYear(parseInt(t)),
    'MM': (t) => d.setMonth(parseInt(t) - 1),
    'dd': (t) => d.setDate(parseInt(t)),
    'HH': (t) => d.setHours(parseInt(t)),
    'mm': (t) => d.setMinutes(parseInt(t)),
    'ss': (t) => d.setSeconds(parseInt(t)),
    'SSS': (t) => d.setMilliseconds(parseInt(t)),
  };

  for (const i in df) {
    const tIndex = formatStr.indexOf(i);
    // console.log('tIndex', tIndex, i, '[' + formatStr + ']', '[' + timeStr + ']', i.length);
    if (tIndex >= 0) {
      const t = timeStr.substring(tIndex, tIndex + i.length);
      // console.log('t', t);
      df[i](t);
      timeStr = timeStr.substring(0, tIndex) + timeStr.substring(tIndex + i.length);
      formatStr = formatStr.substring(0, tIndex) + formatStr.substring(tIndex + i.length);
    }
  }
  return d;
};

// const formatStr = 'yyyyMMdd HH:mm:ss';
// const timeStr = '20200211 15:40:04';
// console.log(msToTimeWithMs(timeFormatParse(timeStr, formatStr).getTime()));

/**
 * Check the para is not null or undefined, 0 and '' will return true
 * 严格校验是否为null或undefined,在为0或''的情况会返回true
 * @param  {object} para
 * @return {boolean}
 */
const isNotNull = function(para) {
  if (para === null || para === undefined) {
    return false;
  }
  return true;
};

/**
 * Check the para is not null or undefined or false, 0 and '' will return true
 * 严格校验是否为null或undefined或false,在为0或''的情况会返回true
 * @param  {object} para
 * @return {boolean}
 */
const isNotNullOrFalse = function(para) {
  if (para === null || para === undefined || para === false) {
    return false;
  }
  return true;
};

/**
 * 预置的检查策略
 * check strategy for check function
 * @type {object}
 */
const checkMap = {
  'notNull': isNotNull,
  'notNullOrFalse': isNotNullOrFalse,
  'number': function(val) {
    return (typeof val === 'number');
    // return !isNaN(val);
  },
  'string': function(val) {
    return (typeof val === 'string');
  },
  'array': function(val) {
    if (!isNotNull(val)) {
      return false;
    }
    return (val.constructor.name === 'Array');
  },
  'regExp': function(val) {
    if (!isNotNull(val)) {
      return false;
    }
    return (val.constructor.name === 'RegExp');
  },
  'int': function(val) {
    // if (!checkMap.number(val)) {
    //   return false;
    // }
    return Math.floor(val) === val;
    // return Number.isInteger(val);
  },
  /**
   * check the value in int range, include start and end.
   * 判断val是否在指定范围内(头尾均包含),如果checkPara为单个数字则判断长度是否大于等于
   * @param  {object} val       test value
   * @param  {Array|number} checkPara e.g. '[4,20]' : >=4 && <=20 , '[5]' : >=5 , '5' : >=5
   * @return {boolean}
   */
  'intRange': function(val, checkPara) {
    if (!checkMap.int(val)) {
      return false;
    }
    if (checkMap.array(checkPara)) {
      if (checkPara.length >= 2) {
        return (val >= checkPara[0] && val <= checkPara[1]);
      } else if (checkPara.length === 1) {
        return val >= checkPara[0];
      }
    } else if (checkMap.int(checkPara)) {
      return val >= checkPara;
    }
    return false;
  },
  'intMin': function(val, checkPara) {
    if (!checkMap.int(val) || !checkMap.int(checkPara)) {
      return false;
    }
    return val >= checkPara;
  },
  'intMax': function(val, checkPara) {
    if (!checkMap.int(val) || !checkMap.int(checkPara)) {
      return false;
    }
    return val <= checkPara;
  },
  'strInt': function(val) {
    val = parseInt(val);
    return checkMap.int(val);
  },
  /**
   * check the value in int range, include start and end.
   * 判断val是否在指定范围内(头尾均包含),如果checkPara为单个数字则判断长度是否大于等于
   * @param  {object} val       test value
   * @param  {Array|number} checkPara e.g. '[4,20]' : >=4 && <=20 , '[5]' : >=5 , '5' : >=5
   * @return {boolean}
   */
  'strIntRange': function(val, checkPara) {
    val = parseInt(val);
    if (!checkMap.int(val)) {
      return false;
    }
    if (checkMap.array(checkPara)) {
      if (checkPara.length >= 2) {
        return (val >= checkPara[0] && val <= checkPara[1]);
      } else if (checkPara.length === 1) {
        return val >= checkPara[0];
      }
    } else if (checkMap.int(checkPara)) {
      return val >= checkPara;
    }
    return false;
  },
  /**
   * check the value in int range, include start and end.
   * 判断string长度是否在指定范围内(头尾均包含),如果checkPara为单个数字则判断长度是否大于等于
   * @param  {object} val       test value
   * @param  {Array|number} checkPara e.g. '[4,20]' : >=4 && <=20 , '[5]' : >=5 , '5' : >=5
   * @return {boolean}
   */
  'strLen': function(val, checkPara) {
    if (!checkMap.string(val)) {
      return false;
    }
    return checkMap.intRange(val.length, checkPara);
  },
  'arrLen': function(val, checkPara) {
    if (!checkMap.array(val)) {
      return false;
    }
    return checkMap.intRange(val.length, checkPara);
  },
  'telCN': function(val) {
    if (!checkMap.string(val)) {
      return false;
    }
    return (val.match(/^0[\d]{2,3}[-]?[\d]{7,8}$/)) ? true : false;
  },
  'mobileCN': function(val) {
    if (!checkMap.string(val)) {
      return false;
    }
    return (val.match(/^1[0-9]{2}\d{8}$/)) ? true : false;
  },
  'email': function(val) {
    if (!checkMap.string(val)) {
      return false;
    }
    return (val.match(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,15})$/)) ? true : false;
  },
  /**
   * 百家姓
   */
  'bjx': function(val) {
    if (!checkMap.string(val)) {
      return false;
    }
    if ('赵|钱|孙|李|周|吴|郑|王|冯|陈|楮|卫|蒋|沈|韩|杨|朱|秦|尤|许|何|吕|施|张|孔|曹|严|华|金|魏|陶|姜|戚|谢|邹|喻|柏|水|窦|章|云|苏|潘|葛|奚|范|彭|郎|鲁|韦|昌|马|苗|凤|花|方|俞|任|袁|柳|酆|鲍|史|唐|费|廉|岑|薛|雷|贺|倪|汤|滕|殷|罗|毕|郝|邬|安|常|乐|于|时|傅|皮|卞|齐|康|伍|余|元|卜|顾|孟|平|黄|和|穆|萧|尹|姚|邵|湛|汪|祁|毛|禹|狄|米|贝|明|臧|计|伏|成|戴|谈|宋|茅|庞|熊|纪|舒|屈|项|祝|董|梁|杜|阮|蓝|闽|席|季|麻|强|贾|路|娄|危|江|童|颜|郭|梅|盛|林|刁|锺|徐|丘|骆|高|夏|蔡|田|樊|胡|凌|霍|虞|万|支|柯|昝|管|卢|莫|经|房|裘|缪|干|解|应|宗|丁|宣|贲|邓|郁|单|杭|洪|包|诸|左|石|崔|吉|钮|龚|程|嵇|邢|滑|裴|陆|荣|翁|荀|羊|於|惠|甄|麹|家|封|芮|羿|储|靳|汲|邴|糜|松|井|段|富|巫|乌|焦|巴|弓|牧|隗|山|谷|车|侯|宓|蓬|全|郗|班|仰|秋|仲|伊|宫|宁|仇|栾|暴|甘|斜|厉|戎|祖|武|符|刘|景|詹|束|龙|叶|幸|司|韶|郜|黎|蓟|薄|印|宿|白|怀|蒲|邰|从|鄂|索|咸|籍|赖|卓|蔺|屠|蒙|池|乔|阴|郁|胥|能|苍|双|闻|莘|党|翟|谭|贡|劳|逄|姬|申|扶|堵|冉|宰|郦|雍|郤|璩|桑|桂|濮|牛|寿|通|边|扈|燕|冀|郏|浦|尚|农|温|别|庄|晏|柴|瞿|阎|充|慕|连|茹|习|宦|艾|鱼|容|向|古|易|慎|戈|廖|庾|终|暨|居|衡|步|都|耿|满|弘|匡|国|文|寇|广|禄|阙|东|欧|殳|沃|利|蔚|越|夔|隆|师|巩|厍|聂|晁|勾|敖|融|冷|訾|辛|阚|那|简|饶|空|曾|毋|沙|乜|养|鞠|须|丰|巢|关|蒯|相|查|后|荆|红|游|竺|权|逑|盖|益|桓|公|万俟|司马|上官|欧阳|夏侯|诸葛|闻人|东方|赫连|皇甫|尉迟|公羊|澹台|公冶|宗政|濮阳|淳于|单于|太叔|申屠|公孙|仲孙|轩辕|令狐|锺离|宇文|长孙|慕容|鲜于|闾丘|司徒|司空|丌官|司寇|仉|督|子车|颛孙|端木|巫马|公西|漆雕|乐正|壤驷|公良|拓拔|夹谷|宰父|谷梁|晋|楚|阎|法|汝|鄢|涂|钦|段干|百里|东郭|南门|呼延|归|海|羊舌|微生|岳|帅|缑|亢|况|后|有|琴|梁丘|左丘|东门|西门|商|牟|佘|佴|伯|赏|南宫|墨|哈|谯|笪|年|爱|阳|佟|第五|言|福'.search(val) != -1) {
      return true;
    }
    return false;
  },
  'cnWord': function(val) {
    if (!checkMap.string(val)) {
      return false;
    }
    return (val.match(/^[\u4e00-\u9fa5|\s]*$/)) ? true : false;
  },
  'function': function(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
  }
};

/**
 * main check function
 * 以参数方式校验
 * e.g.
 * ------------
 * check(targetInt,'intRang',[1,20])
 * ------------
 *
 * @param  {object} val       target
 * @param  {string} checkType type in checkMap, e.g. 'strLen' or you custom regExp
 * @param  {string} checkPara
 * @return {boolean}
 */
const check = function(val, checkType, checkPara) {
  const haveCheckType = isNotNull(checkType);
  if (haveCheckType) {
    if (checkMap.string(checkType) && checkMap.hasOwnProperty(checkType)) {
      return checkMap[checkType](val, checkPara);
    }
  } else {
    if (checkMap.regExp(checkPara)) {
      if (!checkMap.string(val)) {
        return false;
      }
      if (val.match(checkPara)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * check function. use array mode.
 * 以数组形式校验,单参数
 *
 * e.g.
 * ------------
 * check(targetInt,'intRang',[1,20])
 * ------------
 *
 * @param  {Array} arr [val,checkType,checkPara]
 * @return {boolean}
 */
const checkForArr = function(arr) {
  if (!checkMap.array(arr) || arr.length < 2) {
    return false;
  }
  const checkPara = (arr.length > 2) ? arr[2] : null;
  return check(arr[0], arr[1], checkPara);
};

/**
 * batch check.
 * 批量检验,[[targetpara,检验类型或正则,条件参数],...]
 * e.g.:
 * ------------
 * const t = {name:'dd',age:23};
 * const arr = [[t.name,'notNull'],[t.age,'intRange',[1,200]],[t.xy,'notNull']];
 * const re = checkBatch(arr); //re = [2] the last one check failed
 * ------------
 * @param  {Array} paraArr e.g.:[[t.name,'notNull'],[t.age,'intRange',[1,200]]]
 * @return {Array} [fail index]
 */
const checkBatch = function(paraArr) {
  const failArr = [];
  for (let i = 0; i < paraArr.length; i++) {
    // console.log('paraArr[%d]:%j, re:%j',i,paraArr[i],checkForArr(paraArr[i]));
    if (!checkForArr(paraArr[i])) {
      failArr.push(i);
    }
  }
  return failArr;
};

/**
 * 返回一个检查器，可以定义一个对map对象属性的检查数组，通过check方法直接检验不同的map。
 * 如:
 * ------------------
 * const r = [
 *   ['productKey', /^[A-Za-z0-9]{12}$/g], //[map属性名,检验key或正则,附加参数]
 *   ['verifyCode', /^[A-Za-z0-9]{4}$/g],
 *   ['orderId', 'int'],
 *   ['fee', 'intRange',[10,20]],
 * ];
 * const mapCC = mapChecker(r);
 * const target = {
 *   'productKey':'a21341234234',
 *   'verifyCode':'232a',
 *   'orderId':33,
 *   'fee':14,
 *   'times':'2341234adfasdfa'
 * };
 * const re =  mapCC.check(target);
 * console.log(re);
 * ------------------
 * @param  {Array} paraArr 属性检验规则定义数组
 * @return {Array}         失败的属性名数组,paraArr定义错误时返回null
 */
const mapChecker = function mapChecker(paraArr) {
  const checkr = {
    'checkKeys': [],
    'checkParas': []
  };
  for (let i = 0, len = paraArr.length; i < len; i++) {
    const cc = paraArr[i];
    if (cc.length < 2) {
      return null;
    }
    checkr.checkKeys.push(cc[0]);
    if (typeof cc[1] === 'string') {
      checkr.checkParas.push(cc.slice(1));
    } else {
      checkr.checkParas.push([null, cc[1]]);
    }
  }
  checkr.check = function(targetMap) {
    const failArr = [];
    for (let i = 0, len = this.checkKeys.length; i < len; i++) {
      const mapKey = this.checkKeys[i];
      // console.log('mapKey:',mapKey,this.checkParas[i][0],this.checkParas[i][1]);
      if (!check(targetMap[mapKey], this.checkParas[i][0], this.checkParas[i][1])) {
        failArr.push(mapKey);
      }
    }
    return failArr;
  };
  return checkr;
};

exports.priceStrParse = priceStrParse;
exports.twoInt = twoInt;
exports.threeInt = threeInt;
exports.mapChecker = mapChecker;
exports.isNotNull = isNotNull;
exports.isNotNullOrFalse = isNotNullOrFalse;
exports.checkBatch = checkBatch;
exports.check = check;
exports.checkForArr = checkForArr;
exports.timeToMS = timeToMS;
exports.msToTime = msToTime;
exports.msToTimeWithMs = msToTimeWithMs;
exports.timeFormat = timeFormat;
exports.timeFormatParse = timeFormatParse;