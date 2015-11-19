# A nodejs strict validator
A strict validator in nodeJs ,check for string, integer, email, etc.
Support batch check.

## Installation
```
npm install cck --save
```

## Check types
* notNull // 0,false,'' will return true
* notNullOrFalse // 0, '' will return true
* number
* string
* array
* regExp
* int
* intRange //range
* strLen //range
* arrLen //range
* telCN //中国电话号码
* mobileCN //中国手机号码
* email
* bjx //百家姓
* cnWord //中文或空格

cck.check
```javascript
var t = {name:'dd',age:23};
cck.check(t.name,'strLen',[3,5]); //false
cck.check(t.age,'intRange',[15,50]); //true

```
cck.checkBatch
```javascript
var t = {name:'dd',age:23};
var arr = [[t.name,'notNull'],[t.age,'intRange',[1,200]],[t.xy,'notNull'],[t.name,null,/^[d]+$/]];
var re = cck.checkBatch(arr); //return [2] ,the failed index or arr
```

## Usage
```javascript
var cck = reqire('cck');

//check number,int,string...
cck.check(2,'number'); //true
cck.check(-2,'int'); //true
cck.check(2.1,'int'); //false
cck.check(2.1,'string'); //false

//check int in range, the range include start and end
cck.check(32,'intRange',[20,35]); //true
cck.check(32,'intRange',[20,32]); //true
cck.check(32,'intRange',[32,35]); //true
cck.check(32,'intRange',[32]); //true
cck.check(32,'intRange',32); //true
cck.check(32,'intRange',[1,31]); //false

//check string length in range, include start and end
cck.check('55555','strLen',5); //true
cck.check('9','strLen',10); //false
cck.check('aD-',strLen,[-3,10]); //true
cck.check('',strLen,0); //true
cck.check('2','strLen',[2]); //false
cck.check('22','strLen',[2]); //true
cck.check('22','strLen',[2,3,5]); //true
cck.check('333','strLen',[2,3,5]); //true
cck.check('4444','strLen',[2,3,5]); //false
cck.check('22','strLen',[1,2]); //true
cck.check('22','strLen',[0,1]); //fals

//custom check regExp
cck.check('55555',null,/^[\d]+$/); //true
cck.check('9',null,10); //false

//check batch
var t = {name:'dd',age:23};
var arr = [[t.name,'notNull'],[t.age,'intRange',[1,200]],[t.xy,'notNull'],[t.name,null,/^[d]+$/]];
var re = cck.checkBatch(arr); //return [2] ,the failed index or arr

/**
 * millisecond to 'yyyy-MM-dd hh:mm:ss'
 * @param  {int} millSeccond
 * @return {string}
 */
cck.msToTime(1446940800000); //'2015-11-08 08:00:00'

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
cck.timeToMS(2015,11,8,8); // 1446940800000
```
## More
Check out ['test.cck.js'](https://github.com/keel/cck/blob/master/test/test.cck.js).