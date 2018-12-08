/*
测试的辅助方法
 */
'use strict';
const fs = require('fs');
const expect = require('chai').expect;
/**
 * 简单的复制对象
 * @param  {object} obj
 * @return {object}
 */
const clone = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

const fileExists = function(filePath) {
  try {
    fs.statSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
};

const createFile = function(filePath, str, isProtect, options) {
  try {
    if (isProtect && fileExists(filePath)) {
      console.error('file is already exsisted.[%s]', filePath);
      return;
    }
    fs.writeFileSync(filePath, str, (options || { flags: 'w', encoding: 'utf-8' }));
    // console.log('createFile OK:%s',filePath);
  } catch (e) {
    console.error(e, 'createFile error:%s', filePath);
  }
};

const delFile = function(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    console.error('delFile error:%s', filePath);
  }
};

const copyFile = function(src, dest) {
  try {
    fs.writeFileSync(dest, fs.readFileSync(src));
  } catch (e) {
    console.error('copy error,from:%s to %s.', src, dest);
  }
};

/**
 * 批量测试同步方法,如
 * ----------
  const testType = 'intRange';
  const testArr = [
    {'paras':[5,testType,5],'expect':true},
    {'paras':[9,testType,[2,10]],'expect':false}
  ];

  tool.testBatchSync(cck,'check',testArr);
 * ----------
 * @param {jsFile} target 测试的对象,一般是某js文件
 * @param  {Array} testArr
 * @return {}
 */
const testBatchSync = function(target, testFnName, testArr) {
  describe('testBatchSync: ' + testFnName, function() {
    testArr.forEach(function(testObj) {
      it('input: [' + testObj.paras + ']' + ' should return: ' + testObj.expect, function() {
        if (!testObj.hasOwnProperty('expect') || !testObj.hasOwnProperty('paras')) {
          console.error('testBatchSync.testArr error:%j', testObj);
          expect(true).to.be.eql(false);
          return;
        }
        const re = target[testFnName].apply(target, testObj.paras);
        expect(re).to.be.eql(testObj.expect);
      });
    });
  });
};

exports.testBatchSync = testBatchSync;
exports.clone = clone;
exports.createFile = createFile;
exports.delFile = delFile;
exports.copyFile = copyFile;
exports.fileExists = fileExists;