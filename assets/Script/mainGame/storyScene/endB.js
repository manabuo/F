cc.Class({
    extends: cc.Component,

    properties: {
        player:cc.Node,
        playerTxt:cc.Label,
        
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
    
    getTxt:function(position){
        var playerTxtArr = [
            "...",
            "我知道",
            "我从一开始就知道",
            "只是我不愿意承认",
            "我是这本日记的作者",
            "我伤害了无数的人",
            "...后来，我开始讨厌这个自己",
            "所以我跳了进来",
            "但我还是恐惧，恐惧成为那些哀嚎的孤魂野鬼",
            "我躲开了所有的他们",
            "尽管我明明知道",
            "...",
            "是我",
            "是我害死了他们",
            "...",
            "是时候结束了",
            "不需要怀疑",
            "因为",
            "这是我日记的最后一页",
        ];
        
        var rtn = playerTxtArr[position];
        return rtn;
    },
    
    txtTouchRegister:function(){
        var self = this;
        
        self.playerTxt.string = self.getTxt(0);
        self.playerTxt.node.on(cc.Node.EventType.TOUCH_END,
        function(event){
            if(self.touchable === true){
                self.paragPosi+=1;
                var str = self.getTxt(self.paragPosi);
                if(typeof(str)=="undefined")self.isFadeout = true;
                else self.playerTxt.string = str;
            }
            
        });
    },
    
    onLoad: function () {
        //保存
        cc.sys.localStorage.setItem('isEndB',1);
        var self = this;
        self.txtTouchRegister();
    },
    
    update: function (dt) {
        var self = this;
        self.fadeOut();
        if(self.getTxt(self.paragPosi)!=self.playerTxt.string)self.touchable=false;
        else self.touchable=true;
    },
});
