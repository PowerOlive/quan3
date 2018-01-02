const 分析 = require("../编译.js").分析
const 常量_指令名_前进 = require("../语法树处理.js").常量_指令名_前进
const 常量_指令名_转向 = require("../语法树处理.js").常量_指令名_转向

QUnit.test( "分析_前进1", function( assert ) {
  assert.deepEqual(
    分析("开始\n前进50\n结束\n").返回语法树(),
    {子节点: [{类型: 常量_指令名_前进, 参数: 50}]},
    "通过!" );
});

QUnit.test( "分析_循环_前进1", function( assert ) {
  assert.deepEqual(
    分析("开始\n循环1次\n前进50\n到此为止\n结束\n").返回语法树(),
    {子节点: [{类型: "循环", 次数: 1, 子节点: [{类型: 常量_指令名_前进, 参数: 50}]}]},
    "循环1次通过!" );
  assert.deepEqual(
    分析("开始\n循环2次\n前进50\n到此为止\n结束\n").返回语法树(),
    {子节点: [{类型: "循环", 次数: 2, 子节点: [{类型: 常量_指令名_前进, 参数: 50}]}]},
    "循环2次通过!" );
  assert.deepEqual(
    分析("开始\n循环2次\n前进50\n到此为止\n前进50\n结束\n").返回语法树(),
    {子节点: [
      {类型: "循环", 次数: 2, 子节点: [{类型: 常量_指令名_前进, 参数: 50}]},
      {类型: 常量_指令名_前进, 参数: 50}]},
    "循环2次后单次通过!" );
});

QUnit.test( "分析_多个同层循环", function( assert ) {
  assert.deepEqual(
    分析("开始\n循环2次\n前进50\n到此为止\n循环2次\n左转90度\n到此为止\n结束\n").返回语法树(),
    {子节点: [
      {类型: "循环", 次数: 2, 子节点: [{类型: 常量_指令名_前进, 参数: 50}]},
      {类型: "循环", 次数: 2, 子节点: [{类型: 常量_指令名_转向, 参数: 90}]}]},
    "循环2次通过!" );
});

QUnit.test( "分析_双层循环_前进1", function( assert ) {
  assert.deepEqual(
    分析("开始\n循环2次\n循环2次\n前进50\n到此为止\n到此为止\n结束\n").返回语法树(),
    {子节点: [
      {
        类型: "循环",
        次数: 2,
        子节点: [{
          类型: "循环",
          次数: 2,
          子节点: [{类型: 常量_指令名_前进, 参数: 50}]}]
      }]},
    "循环2次通过!" );
  assert.deepEqual(
    分析("开始\n循环2次\n循环2次\n前进50\n到此为止\n到此为止\n前进50\n结束\n").返回语法树(),
    {子节点: [
      {
        类型: "循环",
        次数: 2,
        子节点: [{
          类型: "循环",
          次数: 2,
          子节点: [{类型: 常量_指令名_前进, 参数: 50}]}]
      }, {类型: 常量_指令名_前进, 参数: 50}]},
    "外循环后带指令通过!" );
  assert.deepEqual(
    分析("开始\n循环2次\n循环2次\n前进50\n到此为止\n前进50\n到此为止\n结束\n").返回语法树(),
    {子节点: [
      {
        类型: "循环",
        次数: 2,
        子节点: [{
          类型: "循环",
          次数: 2,
          子节点: [{类型: 常量_指令名_前进, 参数: 50}]}, {类型: 常量_指令名_前进, 参数: 50}]
      }]},
    "内循环后带指令通过!" );
});