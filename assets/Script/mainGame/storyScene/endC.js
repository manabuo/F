cc.Class({
    extends: cc.Component,

    properties: {
        lay:cc.Node,
        
        herTxtLabel:cc.Label,
        playerTxtLabel:cc.Label,
        her:cc.Node,
        player:cc.Node,
        
        paragPosi:0,
        touchable:true,
        
        isFadeout:false,
    },
    fadeOut:function(){
        var self = this;
        if(self.isFadeout === true){
            self.touchable=false;
            self.lay.opacity += 1;
            if(self.lay.opacity >= 255)cc.director.loadScene("gameStartup");
        }
    },
    getTxt:function(who,position){
        var playerTxtArr = [
            "意识开始清醒",
            "耳边逐渐传来声音",
            "警笛声越来越响",
            "我知道,在这本日记中的旅程快要结束了",
            "但我毫不留恋",
            "再见了, F",
            "我们将会在现实中再次相遇",
            "那是她的声音",
            "耳边，枪声与警笛声越来越响",
            "我知道，",
            "真正的旅程才刚刚开始"
        ];
            
        var herTxtArr = [
            "快点醒来，我们该走了",
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
                if(self.paragPosi == 6){
                    self.herTxtLabel.string = self.getTxt(1,0);
                    
                }
                self.paragPosi+=1;
                var str = self.getTxt(0,self.paragPosi);
                if(typeof(str)=="undefined")self.isFadeout = true;
                else self.playerTxtLabel.string = str;
            }
            
        });
    },
    
    onLoad: function () {
        //保存
        cc.sys.localStorage.setItem('isEndC',1);
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
