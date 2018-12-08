'use strict';

const expect = require('chai').expect;
const tool = require('../lib/test-tool');
const cck = require('../lib/cck');

describe('cck.js', function() {
  describe('#check() - intRange', function() {
    const testType = 'intRange';
    const testArr = [
      { 'paras': [5, testType, 5], 'expect': true },
      { 'paras': [9, testType, 10], 'expect': false },
      { 'paras': [-1, testType, [-3, 10]], 'expect': true },
      { 'paras': [2, testType, 10], 'expect': false },
      { 'paras': [2, testType, [10]], 'expect': false },
      { 'paras': [2, testType, [2]], 'expect': true },
      { 'paras': [2, testType, [2, 3, 5]], 'expect': true },
      { 'paras': [3, testType, [2, 3, 5]], 'expect': true },
      { 'paras': [4, testType, [2, 3, 5]], 'expect': false },
      { 'paras': [2, testType, [1, 2]], 'expect': true },
      { 'paras': [2, testType, [0, 1]], 'expect': false }
    ];
    tool.testBatchSync(cck, 'check', testArr);
  });
  describe('#check() - number', function() {
    const testType = 'number';
    const testArr = [
      { 'paras': [2.01, testType], 'expect': true },
      { 'paras': [-2, testType], 'expect': true },
      { 'paras': ['2', testType], 'expect': false },
      { 'paras': [null, testType], 'expect': false },
      { 'paras': [false, testType], 'expect': false },
      { 'paras': ['', testType], 'expect': false },
      { 'paras': [0, testType], 'expect': true },
      { 'paras': [true, testType], 'expect': false },
      { 'paras': [
          [], testType
        ], 'expect': false },
      { 'paras': [{}, testType], 'expect': false },
      { 'paras': [function() {}, testType], 'expect': false }
    ];
    tool.testBatchSync(cck, 'check', testArr);
  });
  describe('#check() - int', function() {
    const testType = 'int';
    const testArr = [
      { 'paras': [2.01, testType], 'expect': false },
      { 'paras': [-2, testType], 'expect': true },
      { 'paras': ['2', testType], 'expect': false },
      { 'paras': [null, testType], 'expect': false },
      { 'paras': [false, testType], 'expect': false },
      { 'paras': ['', testType], 'expect': false },
      { 'paras': [0, testType], 'expect': true },
      { 'paras': [true, testType], 'expect': false },
      { 'paras': [
          [], testType
        ], 'expect': false },
      { 'paras': [{}, testType], 'expect': false },
      { 'paras': [function() {}, testType], 'expect': false }
    ];
    tool.testBatchSync(cck, 'check', testArr);
  });

  describe('#check() - array', function() {
    const testType = 'array';
    const testArr = [
      { 'paras': [
          [0], testType
        ], 'expect': true },
      { 'paras': [-2, testType], 'expect': false },
      { 'paras': ['2', testType], 'expect': false },
      { 'paras': [
          [null], testType
        ], 'expect': true },
      { 'paras': [false, testType], 'expect': false },
      { 'paras': ['', testType], 'expect': false },
      { 'paras': [0, testType], 'expect': false },
      { 'paras': [true, testType], 'expect': false },
      { 'paras': [
          [], testType
        ], 'expect': true },
      { 'paras': [{}, testType], 'expect': false },
      { 'paras': [function() {}, testType], 'expect': false }
    ];
    tool.testBatchSync(cck, 'check', testArr);
  });
  describe('#check() - strLen', function() {
    const testType = 'strLen';
    const testArr = [
      { 'paras': ['55555', testType, 5], 'expect': true },
      { 'paras': ['9', testType, 10], 'expect': false },
      { 'paras': ['aD-1', testType, [-3, 10]], 'expect': true },
      { 'paras': ['', testType, 0], 'expect': true },
      { 'paras': ['2', testType, [2]], 'expect': false },
      { 'paras': ['22', testType, [2]], 'expect': true },
      { 'paras': ['22', testType, [2, 3, 5]], 'expect': true },
      { 'paras': ['333', testType, [2, 3, 5]], 'expect': true },
      { 'paras': ['4444', testType, [2, 3, 5]], 'expect': false },
      { 'paras': ['22', testType, [1, 2]], 'expect': true },
      { 'paras': ['22', testType, [0, 1]], 'expect': false }
    ];
    tool.testBatchSync(cck, 'check', testArr);
  });
  describe('#check() - reg', function() {
    const testType = null;
    const testArr = [
      { 'paras': ['55555', testType, /^[\d]+$/], 'expect': true },
      { 'paras': ['9', testType, 10], 'expect': false },
      { 'paras': ['22', testType, /^[ss]$/], 'expect': false }
    ];
    tool.testBatchSync(cck, 'check', testArr);
  });

  describe('#checkForArr()', function() {
    const testType = 'strLen';
    const testArr = [
      { 'paras': [
          ['55555', testType, 5]
        ], 'expect': true }, { 'paras': [
          ['9', testType, 10]
        ], 'expect': false }, { 'paras': [
          ['aD-1', testType, [-3, 10]]
        ], 'expect': true }, { 'paras': [
          ['', testType, 0]
        ], 'expect': true }, { 'paras': [
          ['2', testType, [2]]
        ], 'expect': false }, { 'paras': [
          ['22', testType, [2]]
        ], 'expect': true }, { 'paras': [
          ['22', testType, [2, 3, 5]]
        ], 'expect': true }, { 'paras': [
          ['333', testType, [2, 3, 5]]
        ], 'expect': true }, { 'paras': [
          ['4444', testType, [2, 3, 5]]
        ], 'expect': false }, { 'paras': [
          ['22', testType, [1, 2]]
        ], 'expect': true }, { 'paras': [
          ['22', testType, [0, 1]]
        ], 'expect': false }
    ];
    tool.testBatchSync(cck, 'checkForArr', testArr);
  });

  describe('#checkBatch()', function() {
    const t = { name: 'dd', age: 23 };
    const arr = [
      [t.name, 'notNull'],
      [t.age, 'intRange', [1, 200]],
      [t.xy, 'notNull'],
      [t.name, null, /^[d]+$/]
    ];
    const re = cck.checkBatch(arr);
    it('should return the fail index', function() {
      expect(re).to.be.eql([2]);
    });
  });


  describe('#timeToMS()', function() {
    const d = new Date();
    d.setDate(8);
    d.setHours(8, 0, 0, 0);
    const ms = d.getTime();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const mStr = (month < 10) ? '0' + month : month;
    const str = year + '-' + mStr + '-08 08:00:00';
    it('should return yyyy-MM-dd hh:mm:ss', function() {
      expect(cck.msToTime(ms)).to.be.eql(str);
    });
    it('should return millisecond', function() {
      expect(cck.timeToMS(year, month, 8, 8)).to.be.eql(ms);
    });
  });


});