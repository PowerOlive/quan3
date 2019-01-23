const antlr4 = require("antlr4/index")
const 圈3Lexer = require("./圈3Lexer.js")
const 圈3Parser = require("./圈3Parser.js")
const 定制访问器 = require("./定制访问器.js")
const 生成路径表 = require("./语法树处理").生成路径表
const 截取路径表 = require("./语法树处理").截取路径表
const 生成指令序列 = require("./语法树处理").生成指令序列

var 指示方向图 = null;
var 当前速度 = 2;
var 图标位置x位移 = 171;
var 图标位置y位移 = -16;

置速度 = function(输入速度) {
  当前速度 = 输入速度;
}

// TODO: 需改进-现为全局, 由于browserify
分析 = function(代码) {
  重置状态();

  var 输入流 = new antlr4.InputStream(代码)
  var 词法分析器 = new 圈3Lexer.圈3Lexer(输入流)
  var 词  = new antlr4.CommonTokenStream(词法分析器)
  var 语法分析器 = new 圈3Parser.圈3Parser(词)
  语法分析器.buildParseTrees = true

  var 访问器 = new 定制访问器.定制访问器();
  var 语法树 = 访问器.visit(语法分析器.程序());
  // document.getElementById("调试输出").innerHTML += "速度: " + 当前速度;
  
  // TODO: 添加测试后, 合并两个接口: 生成指令序列, 生成路径表
  var 指令序列 = 生成指令序列(语法树);
  var 路径表 = 生成路径表(指令序列, 原点, 初始前进角度);
/*
  if (!指示方向图) {
    指示方向图 = createImg("图标/蚂蚁头向上.png")
    指示方向图.size(36, 34);
  }
*/
  // TODO: 提取到二阶函数
  绘制 = function() {
    var 此帧行进长度 = 行进总距离;
    const 速度 = parseInt(当前速度);

    // TODO: 获取剩余路径表, 避免从头开始截取
    var 拆分路径 = 截取路径表(路径表, 此帧行进长度, 此帧行进长度 + 速度);
    for (var i = 0; i < 拆分路径.截取部分.length; i++ ) {
      var 段 = 拆分路径.截取部分[i];
      var 起点 = 段.起点;
      var 终点 = 段.终点;
      line(起点.x, 起点.y, 终点.x, 终点.y);
    }
    /*
    for (var i = 0; i < 路径表.length; i++ ) {
      if (此帧行进长度 <= 0) {
        break;
      }
      var 段 = 路径表[i];
      var 起点 = 段.起点;
      var 终点 = 段.终点;
      var 距离 = 段.长度;

      // 每帧只要行进长度为`速度`的距离即可
      if (此帧行进长度 <= 速度 || 此帧行进长度 <= 距离 ) {
        var 当前起点 = 起点;
        var 当前终点 = {};
        if (此帧行进长度 <= 距离 ) {
          当前终点.x = 起点.x + (终点.x - 起点.x) * 此帧行进长度 / 距离;
          当前终点.y = 起点.y + (终点.y - 起点.y) * 此帧行进长度 / 距离;
        } else {
          当前终点 = 终点;
        }
        // TODO: 简化不同分辨率下的对准
        指示方向图.position(当前终点.x + 图标位置x位移, 当前终点.y + 图标位置y位移);
        指示方向图.style("transform", "rotate(" + (90 - 段.前进角度) + "deg)")
        line(当前起点.x, 当前起点.y, 当前终点.x, 当前终点.y);
        此帧行进长度 = 此帧行进长度 - 距离;
      } else if (此帧行进长度 > 距离) {
        此帧行进长度 = 此帧行进长度 - 距离;
      }
      //document.getElementById("调试输出").innerHTML += "当前序号" + 当前序号 + " (" + 起点.x + ", " + 起点.y + ")->(" + 当前x + ", " + 当前y + ") ";
        
    }*/
    
    行进总距离 += 速度;
  }
  return 访问器;
}

var 行进总距离 = 0;

var 画布尺寸 = {x: 800, y: 600};
var 原点 = {x: 画布尺寸.x/2, y: 画布尺寸.y/2};
var 初始前进角度 = 90; // 默认向上, 对应弧度: 90 * Math.PI / 180

function 重置状态() {
  清理();
  行进总距离 = 0;
  原点 = {x: 画布尺寸.x/2, y: 画布尺寸.y/2};
  前进角度 = 90;
}

exports.分析 = 分析;