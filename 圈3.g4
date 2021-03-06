grammar 圈3;
程序   : '开始' 声明+ '结束';
          
声明 : 前进 | 转向 | 循环;

循环 : '循环' T数 '次' 声明+ '到此为止' ;

前进    : '前进' T数 ;

转向  :  T转向 '转' T数 '度' ;

T转向 : '左' | '右' ;
T数 : [0-9]+ ;
T空白     : [ \n\t]+ -> skip;