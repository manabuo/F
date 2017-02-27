cc.Class({
    extends: cc.Component,

    properties: {
        cameraLeft:cc.Node,
        cameraRight:cc.Node,
        
        gameLay:cc.Node,
        
        moveSpeed:5,
        //-1:Left,0:Stop,1:Right
        LorR:0,
    },
    
    moveCamera:function(deltaT){
        var self = this;
        switch(self.LorR){
            case -1:self.gameLay.x -= self.moveSpeed * deltaT;break;
            case 1:self.gameLay.x += self.moveSpeed * deltaT;break;
            default:break;
        }
    },
    registerLRBtn:function(){
        var self = this;
        
        self.cameraLeft.on(cc.Node.EventType.TOUCH_START, function(event){
            self.LorR = -1;
        });
        self.cameraLeft.on(cc.Node.EventType.TOUCH_END, function(event){
            self.LorR = 0;
        });
        self.cameraLeft.on(cc.Node.EventType.TOUCH_CANCEL, function(event){
            self.LorR = 0;
        });
        
        
        self.cameraRight.on(cc.Node.EventType.TOUCH_START, function(event){
            self.LorR = 1;
        });
        self.cameraRight.on(cc.Node.EventType.TOUCH_END, function(event){
            self.LorR = 0;
        });
        self.cameraRight.on(cc.Node.EventType.TOUCH_CANCEL, function(event){
            self.LorR = 0;
        });
    },
    
    onLoad: function () {
        var self = this;
        self.registerLRBtn();
    },


    update: function (dt) {
        var self = this;
        self.moveCamera(dt);
    },
});
