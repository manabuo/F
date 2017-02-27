var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        gamecanvas:cc.Node,
        
        moveSpeed : 150,
        
        jumpHeight : 100,
        jumpDuration: 0.1,
        
        isJumping:false,
    },
    
    //初始化玩家位置
    setplayerGenPosi:function(){
        var self = this;
        var posiArr = self._mainCtrl._getChapterData(gameData.onChapter,7);
        this.node.x = posiArr[0];
        this.node.y = posiArr[1];
    },

    //玩家掉落，landposiY指由于存在一个下落平台，平台的y值
    _playerFall:function(playerposiY,landposiY,speed){
        if(playerposiY>landposiY){
            if(playerposiY-landposiY > speed)
            this.node.y -= speed;
            else this.node.y  = landposiY + this.node.height/2;
        }
        
    },
    //
    setJumpAction: function () {
        var self = this;
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        
        // 序列化
        //var seq = cc.sequence(jumpUp,jumpDown); 
        
        return jumpUp; 
    },
    _playerRotate:function(isOnGrd){
        var self = this;
        
        var childs = this.node.getChildren();
        
        if(isOnGrd && this.node.rotation % 90 === 0){
            this.node.rotation = 0;
            for(var a = 0;a<childs.length;a++)childs[a].rotation = 0;
        }else{
            this.node.rotation += 10;
            for(var a = 0;a<childs.length;a++)childs[a].rotation -= 10;
        }
        
    },
    //获得玩家移动速度
    _getPlayerMoveSpeed:function(){
        return this.moveSpeed;
    },
    /**
    *0:不动 1:左移 2:右移 3:跳跃
    **/
    _playerMove:function(code){
        var self = this;
        switch(code){
            case 0:break;
            case 1:
                self.accLeft = true;
                self.accRight = false;                        
                break;
            case 2:
                self.accLeft = false;
                self.accRight = true; 
                break;
            case 3:
                self.jumpAction = self.setJumpAction();
                if(self.isJumping === false){
                    self.node.runAction(self.jumpAction);
                    
                    self.isJumping = true;
                }
                break;
                default:break;
        }
    },
    _playerMoveStop:function(code){
        var self = this;
        switch(code){
            case 0:break;
            case 1:
                self.accLeft = false;       
                break;
            case 2:
                self.accRight = false;     
                break;
            case 3:
                self.isJumping = false;
                break;
                default:break;
        }
        
    },
    
    onLoad: function () {
        var self = this;
        
        //获取剧本控制，控制剧本流程
        self._mainCtrl = self.gamecanvas.getComponent("mainCtl");
        
        //初始化玩家位置
        self.setplayerGenPosi();
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        this.ySpeed = 0;
    },
    
    update: function (dt) {

        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.node.x -= this.moveSpeed * dt;
        } else if (this.accRight) {
            this.node.x += this.moveSpeed * dt;
        }
        //cc.log('playerPosi:X'+this.node.x+'Y'+this.node.y);

    },
});
