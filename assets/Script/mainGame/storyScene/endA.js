var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        player:cc.Node,
        rtn:cc.Node,
        
        txtLabel:cc.Label,
        txtShadow:cc.Label,
        
        leftNode:cc.Node,
        bg:cc.Node,
        
        Ttmp: 0,
        
        bgTtmp:0,
    },
    
    onLoad: function () {
        var self = this;
        
        //保存
        cc.sys.localStorage.setItem('isEndA',1);
        
        self.rtn.opacity = 0;
        
        
        self.rtn.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.director.resume();
            cc.audioEngine.stopAll();
            gameData.onChapter= 0;
            gameData.playerDeadCount = 0;
            gameData.playerDeadPosi = [[]];
            gameData.isPlayingBgm = false;
            gameData.playingChapter = 0;
            gameData.playingBgm = 0;
            gameData.stopSign = false;
            
            cc.director.loadScene("mainMenu");
        }); 
    },

    update: function (dt) {
        var self = this;
        if(self.player.opacity > 0)self.player.opacity -= 0.7;
        if(self.player.opacity <= 0)if(self.leftNode.x > -1000)self.leftNode.x -= 3;
        //if(self.player.opacity === 0)if(self.txtLabel.string ==="")self.txtLabel.string = "END A: 重蹈覆辙";
        if(self.Ttmp<600)self.Ttmp += 1;
        if(self.Ttmp==600)self.rtn.opacity = 255;
        
        
        if(self.bgTtmp < 300)self.bgTtmp += 1;
        else self.bgTtmp  = 0;
        
        if(self.bgTtmp < 150){
            self.txtLabel.node.rotation += 0.05;
            self.txtShadow.node.rotation += 0.03;
        }
        else {
            self.txtLabel.node.rotation -= 0.05;
            self.txtShadow.node.rotation -= 0.03;
        }
        
        
        self.txtShadow.string = self.txtLabel.string;
    },
});
