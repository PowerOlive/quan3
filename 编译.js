const antlr4 = require("antlr4/index")
const 圈3Lexer = require("./圈3Lexer.js")
const 圈3Parser = require("./圈3Parser.js")
const 定制访问器 = require("./定制访问器.js")
const 生成路径表 = require("./语法树处理").生成路径表
const 截取路径表 = require("./语法树处理").截取路径表
const 生成指令序列 = require("./语法树处理").生成指令序列

const 图标位置x位移 = 171;
const 图标位置y位移 = -16;

const 画布尺寸 = {x: 800, y: 600};
const 原点 = {x: 画布尺寸.x/2, y: 画布尺寸.y/2};
const 初始前进角度 = 90; // 默认向上, 对应弧度: 90 * Math.PI / 180

var 指示方向图 = null;
var 当前速度 = "5";

置速度 = function(输入速度) {
  当前速度 = 输入速度;
}

清理画板 = function() {
  清理()
  if (!指示方向图) {
    指示方向图 = createImg("图标/蚂蚁头向上.png")
    指示方向图.size(36, 34);
  }
}

// TODO: 需改进-现为全局, 由于browserify
分析 = function(代码) {
  const 输入流 = new antlr4.InputStream(代码)
  const 词法分析器 = new 圈3Lexer.圈3Lexer(输入流)
  const 词  = new antlr4.CommonTokenStream(词法分析器)
  const 语法分析器 = new 圈3Parser.圈3Parser(词)
  语法分析器.buildParseTrees = true

  var 访问器 = new 定制访问器.定制访问器();
  var 语法树 = 访问器.visit(语法分析器.程序());
  
  // TODO: 添加测试后, 合并两个接口: 生成指令序列, 生成路径表
  var 指令序列 = 生成指令序列(语法树);
  var 路径表 = 生成路径表(指令序列, 原点, 初始前进角度);

  const 速度 = parseInt(当前速度);
  
  // TODO: 提取到二阶函数
  绘制 = function() {
    if (路径表.length <= 0) {
      return;
    }
    var 拆分路径 = 截取路径表(路径表, 0, 速度);
    路径表 = 拆分路径.剩余部分;

    for (var i = 0; i < 拆分路径.截取部分.length; i++ ) {
      var 段 = 拆分路径.截取部分[i];
      var 起点 = 段.起点;
      var 终点 = 段.终点;
      线段(起点.x, 起点.y, 终点.x, 终点.y);
      
      // TODO: 简化不同分辨率下的对准
      指示方向图.position(终点.x + 图标位置x位移, 终点.y + 图标位置y位移);
      指示方向图.style("transform", "rotate(" + (90 - 段.前进角度) + "deg)")
    }
  }
  return 访问器;
}

exports.分析 = 分析;