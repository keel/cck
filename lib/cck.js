/**
 * Check tool for String,Time,moblie,email,etc.
 * author: Keel
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
var timeToMS = function(year,month,day,hour,min,sec,ms){
  var d = new Date();
  d.setFullYear(year,month-1,day);
  d.setHours(hour || 0,min || 0,sec || 0,ms || 0);
  d.setMinutes(min || 0);
  d.setSeconds(sec || 0);
  return d.getTime();
};


var twoInt = function(int) {
  return (int < 10) ? '0'+int : int;
};
/**
 * millisecond to 'yyyy-MM-dd hh:mm:ss'
 * @param  {int} millSeccond
 * @return {string}
 */
var msToTime = function(millSec){
  var d = new Date(millSec);
  var re = d.getFullYear() + '-'+ twoInt(d.getMonth()+1) + '-'+ twoInt(d.getDate()) + ' '+ twoInt(d.getHours()) + ':'+ twoInt(d.getMinutes()) + ':'+ twoInt(d.getSeconds());
  return re;
};


/**
 * Check the para is not null or undefined, 0 and '' will return true
 * 严格校验是否为null或undefined,在为0或''的情况会返回true
 * @param  {object} para
 * @return {boolean}
 */
var isNotNull = function(para){
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
var isNotNullOrFalse = function(para){
  if (para === null || para === undefined ||  para === false) {
    return false;
  }
  return true;
};

/**
 * 预置的检查策略
 * check strategy for check function
 * @type {object}
 */
var checkMap = {
  'notNull':isNotNull,
  'notNullOrFalse':isNotNullOrFalse,
  'number':function  (val) {
    return (typeof val === 'number');
    // return !isNaN(val);
  },
  'string':function (val) {
    return (typeof val === 'string');
  },
  'array':function (val) {
    if (!isNotNull(val)) {
      return false;
    }
    return (val.constructor.name === 'Array');
  },
  'regExp':function (val) {
    if (!isNotNull(val)) {
      return false;
    }
    return (val.constructor.name === 'RegExp');
  },
  'int':function (val) {
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
  'intRange':function (val,checkPara) {
    if (!checkMap.int(val)) {
      return false;
    }
    if (checkMap.array(checkPara)) {
      if (checkPara.length >= 2) {
        return (val >= checkPara[0] && val <= checkPara[1]);
      }else if (checkPara.length === 1) {
        return val >= checkPara[0];
      }
    }else if (checkMap.int(checkPara)) {
      return val >= checkPara;
    }
    return false;
  },
  'intMin':function (val,checkPara) {
    if (!checkMap.int(val) || !checkMap.int(checkPara)) {
      return false;
    }
    return val >= checkPara;
  },
  'intMax':function (val,checkPara) {
    if (!checkMap.int(val) || !checkMap.int(checkPara)) {
      return false;
    }
    return val <= checkPara;
  },
  /**
   * check the value in int range, include start and end.
   * 判断string长度是否在指定范围内(头尾均包含),如果checkPara为单个数字则判断长度是否大于等于
   * @param  {object} val       test value
   * @param  {Array|number} checkPara e.g. '[4,20]' : >=4 && <=20 , '[5]' : >=5 , '5' : >=5
   * @return {boolean}
   */
  'strLen':function (val,checkPara) {
    if (!checkMap.string(val)) {
      return false;
    }
    return checkMap.intRange(val.length,checkPara);
  },
  'arrLen':function (val,checkPara) {
    if (!checkMap.array(val)) {
      return false;
    }
    return checkMap.intRange(val.length,checkPara);
  },
  'telCN':function (val) {
    return (val.match(/^0[\d]{2,3}[\-]?[\d]{7,8}$/)) ? true : false;
  },
  'mobileCN':function (val) {
    return (val.match(/^1[1-9]{2}\d{8}$/)) ? true : false;
  },
  'email':function (val) {
    return (val.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)) ? true : false;
  },
  /**
   * 百家姓
   */
  'bjx':function (val) {
    if ('赵|钱|孙|李|周|吴|郑|王|冯|陈|楮|卫|蒋|沈|韩|杨|朱|秦|尤|许|何|吕|施|张|孔|曹|严|华|金|魏|陶|姜|戚|谢|邹|喻|柏|水|窦|章|云|苏|潘|葛|奚|范|彭|郎|鲁|韦|昌|马|苗|凤|花|方|俞|任|袁|柳|酆|鲍|史|唐|费|廉|岑|薛|雷|贺|倪|汤|滕|殷|罗|毕|郝|邬|安|常|乐|于|时|傅|皮|卞|齐|康|伍|余|元|卜|顾|孟|平|黄|和|穆|萧|尹|姚|邵|湛|汪|祁|毛|禹|狄|米|贝|明|臧|计|伏|成|戴|谈|宋|茅|庞|熊|纪|舒|屈|项|祝|董|梁|杜|阮|蓝|闽|席|季|麻|强|贾|路|娄|危|江|童|颜|郭|梅|盛|林|刁|锺|徐|丘|骆|高|夏|蔡|田|樊|胡|凌|霍|虞|万|支|柯|昝|管|卢|莫|经|房|裘|缪|干|解|应|宗|丁|宣|贲|邓|郁|单|杭|洪|包|诸|左|石|崔|吉|钮|龚|程|嵇|邢|滑|裴|陆|荣|翁|荀|羊|於|惠|甄|麹|家|封|芮|羿|储|靳|汲|邴|糜|松|井|段|富|巫|乌|焦|巴|弓|牧|隗|山|谷|车|侯|宓|蓬|全|郗|班|仰|秋|仲|伊|宫|宁|仇|栾|暴|甘|斜|厉|戎|祖|武|符|刘|景|詹|束|龙|叶|幸|司|韶|郜|黎|蓟|薄|印|宿|白|怀|蒲|邰|从|鄂|索|咸|籍|赖|卓|蔺|屠|蒙|池|乔|阴|郁|胥|能|苍|双|闻|莘|党|翟|谭|贡|劳|逄|姬|申|扶|堵|冉|宰|郦|雍|郤|璩|桑|桂|濮|牛|寿|通|边|扈|燕|冀|郏|浦|尚|农|温|别|庄|晏|柴|瞿|阎|充|慕|连|茹|习|宦|艾|鱼|容|向|古|易|慎|戈|廖|庾|终|暨|居|衡|步|都|耿|满|弘|匡|国|文|寇|广|禄|阙|东|欧|殳|沃|利|蔚|越|夔|隆|师|巩|厍|聂|晁|勾|敖|融|冷|訾|辛|阚|那|简|饶|空|曾|毋|沙|乜|养|鞠|须|丰|巢|关|蒯|相|查|后|荆|红|游|竺|权|逑|盖|益|桓|公|万俟|司马|上官|欧阳|夏侯|诸葛|闻人|东方|赫连|皇甫|尉迟|公羊|澹台|公冶|宗政|濮阳|淳于|单于|太叔|申屠|公孙|仲孙|轩辕|令狐|锺离|宇文|长孙|慕容|鲜于|闾丘|司徒|司空|丌官|司寇|仉|督|子车|颛孙|端木|巫马|公西|漆雕|乐正|壤驷|公良|拓拔|夹谷|宰父|谷梁|晋|楚|阎|法|汝|鄢|涂|钦|段干|百里|东郭|南门|呼延|归|海|羊舌|微生|岳|帅|缑|亢|况|后|有|琴|梁丘|左丘|东门|西门|商|牟|佘|佴|伯|赏|南宫|墨|哈|谯|笪|年|爱|阳|佟|第五|言|福'.search(val) != -1 ) {
      return true;
    }
    return false;
  },
  'cnWord':function (val) {
    return (val.match(/^[\u4e00-\u9fa5|\s]*$/)) ? true : false;
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
var check = function(val,checkType,checkPara){
  var haveCheckType = isNotNull(checkType);
  if (haveCheckType) {
    if (checkMap.string(checkType) && checkMap.hasOwnProperty(checkType)) {
      return checkMap[checkType](val,checkPara);
    }
  }else{
    if (checkMap.regExp(checkPara)) {
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
var checkForArr = function(arr){
  if (!checkMap.array(arr) || arr.length < 2) {
    return false;
  }
  var checkPara = (arr.length > 2) ? arr[2] : null;
  return check(arr[0],arr[1],checkPara);
};

/**
 * batch check.
 * 批量检验,[[targetpara,检验类型或正则,条件参数],...]
 * e.g.:
 * ------------
 * var t = {name:'dd',age:23};
 * var arr = [[t.name,'notNull'],[t.age,'intRange',[1,200]],[t.xy,'notNull']];
 * var re = checkBatch(arr); //re = [2] the last one check failed
 * ------------
 * @param  {Array} paraArr e.g.:[[t.name,'notNull'],[t.age,'intRange',[1,200]]]
 * @return {Array} [fail index]
 */
var checkBatch = function(paraArr){
  var failArr = [];
  for (var i = 0; i < paraArr.length; i++) {
    // console.log('paraArr[%d]:%j, re:%j',i,paraArr[i],checkForArr(paraArr[i]));
    if (!checkForArr(paraArr[i])) {
      failArr.push(i);
    }
  }
  return failArr;
};



exports.isNotNull = isNotNull;
exports.isNotNullOrFalse = isNotNullOrFalse;
exports.checkBatch = checkBatch;
exports.check = check;
exports.checkForArr = checkForArr;
exports.timeToMS = timeToMS;
exports.msToTime = msToTime;

