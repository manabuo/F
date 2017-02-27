cc.Class({
    extends: cc.Component,
    
    properties: {
        
        herTxtLabel:cc.Label,
        playerTxtLabel:cc.Label,
        
        player:cc.Node,
        
        paragPosi:0,
        touchable:true,
        
        isFadeout:false,
    },
    fadeOut:function(){
        var self = this;
        if(self.isFadeout === true){
            self.touchable=false;
            self.node.opacity -= 1;
            if(self.node.opacity <= 0)cc.director.loadScene("gameStartup");
        }
    },
    getTxt:function(who,position){
        var playerTxtArr = [
            "听力逐渐开始恢复",
            "那是她的声音",
            "我知道她在骗我",
            "好难受",
            "...",
            "张不开眼睛",
            "发不出声音",
            "动不了",
            "...",
            "从一开始就是这样",
            "嘛，无所谓了",
            "意识开始变得模糊",
            "我只是希望",
            "下一个人，别再像我一样了",
            "只差一点点",
            "...",
            "拜托了",
            "做点对的事情",
            "还有",
            "不要被疯掉的我杀掉",
            "拜托了",
        ];
            
        var herTxtArr = [
            "对不起",
            "...可调整的已经到极限了",
            "完了，他们发现我做什么了",
            "对不起",
        ];
        
        var rtn;
        switch(who){
            case 0:
                rtn = playerTxtArr[position];
                break;
            case 1:
                rtn =  herTxtArr[position];
                break;
            default:
                rtn = "";
                break;
        }
        return rtn;
    },
    txtTouchRegister:function(){
        var self = this;
        
        self.playerTxtLabel.string = self.getTxt(0,0);
        self.playerTxtLabel.node.on(cc.Node.EventType.TOUCH_END,
        function(event){
            if(self.touchable === true){
                
                var herTxt = self.herTxtLabel.string;
                switch(self.paragPosi){
                    case 0:herTxt = self.getTxt(1,0);break;
                    case 1:herTxt = self.getTxt(1,1);break;
                    case 5:herTxt = self.getTxt(1,2);break;
                    case 15:herTxt = self.getTxt(1,3);break;
                    default:break;
                }
                self.herTxtLabel.string = herTxt;
                    
                    
                self.paragPosi+=1;
                var str = self.getTxt(0,self.paragPosi);
                if(typeof(str)=="undefined")self.isFadeout = true;
                else self.playerTxtLabel.string = str;
            }
            
        });
    },
    
    onLoad: function () {
        //保存
        cc.sys.localStorage.setItem('isEndD',1);
        var self = this;
        self.txtTouchRegister();
    },
    
    update: function (dt) {
        var self = this;
        self.fadeOut();
        if(self.getTxt(0,self.paragPosi)!=self.playerTxtLabel.string)self.touchable=false;
        else self.touchable=true;
    },
});
