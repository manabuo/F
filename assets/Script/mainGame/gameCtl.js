var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        gamecanvas:cc.Node,
        
        worldPositionMark:cc.Node,
        
        joystick:cc.Node,
        jumpbutton:cc.Node,
        
        
        player:cc.Node,
        enemygrp:cc.Node,
        
        gamebg:cc.Node,
        
        gameground:cc.Node,
        gamedeadground:cc.Node,
        gameendground:cc.Node,
        gamenextground:cc.Node,
        
        
        camera:cc.Node,
        
        gamedata:cc.Label,
        
        isRightable:true,
        isLeftable:false,
        
        
        //空中连续跳跃次数及计数器(注意：0->跳一下，1->跳两下，以此类推)
        airJumpCount:1,
        jumpCounter:0,
        //牛顿定律坠落时间控制和加速度
        t:0.0,
        a:15,
        
        isCallingNextScene:false,
        isPushingSpace:false,
    },
    
    //镜头移动控制
    cameraControl:function(deltaT){
        
        var self = this;
        var elementSpeed = deltaT*self._playerCtrl._getPlayerMoveSpeed();
        
        var groundArr = self.gameground.getChildren();
        var enemyArr = self.enemygrp.getChildren();
        
        //标准右移动
        if(self.player.x > self.camera.x+self.camera.width/12){
            
            
            if(self.isRightable){
                self.player.x -= elementSpeed;
                self.gamebg.x -= elementSpeed*0.7;
                for(var i = 0;i<groundArr.length;i++)groundArr[i].x -= elementSpeed;
                for(var j = 0;j<enemyArr.length;j++)enemyArr[j].x -= elementSpeed;
            }
        }
        //标准左移动
        else if(self.player.x < self.camera.x-self.camera.width/12){
            
            
            if(self.isLeftable){
                self.player.x += elementSpeed;
                self.gamebg.x += elementSpeed*0.7;
                for(var k = 0;k<groundArr.length;k++)groundArr[k].x += elementSpeed;
                for(var l = 0;l<enemyArr.length;l++)enemyArr[l].x += elementSpeed;
            }
            
        }else{
            
        }
        //禁止左移动
        if(self.player.x < self.camera.x-self.camera.width/2+self.player.width/2){
            if(self.isLeftable===false){
                self.player.x += elementSpeed;
            }
        }
        //禁止右移动
        if(self.player.x > self.camera.x+self.camera.width/2-self.player.width/2){
            if(self.isRightable===false){
                self.player.x -= elementSpeed;
            }
        }
        
    },
    
    //注册输入事件，摇杆和按键效果一样
    registerInputEvent: function () {

        var self = this;
        
        var moveCode = 0;
        var isJumping = false;
        
        //跳跃按钮按下
        self.jumpbutton.on(cc.Node.EventType.TOUCH_START, function(event){
            if(isJumping===false){
                if(self.jumpCounter < self.airJumpCount){
                    self.t =0.0;
                    self.jumpCounter += 1;
                    self._playerCtrl._playerMove(3);
                    self._enemyCtrl._setPlayerMovement(3);
                }
            }
            isJumping = true;
        });
        //跳跃按钮松开
        self.jumpbutton.on(cc.Node.EventType.TOUCH_END, function(event){
            self._playerCtrl._playerMoveStop(3);
            
            isJumping = false;
        });
        
        //摇杆拉动
        this._joystickCtrl.addJoyStickTouchChangeListener(function (angle) {
            
            if(angle!==null){
                //开始前进
                self._playerCtrl._playerMoveStop(moveCode);
                if(angle>135 && angle <=225){
                    isJumping = false;
                    moveCode = 1;
                    self._enemyCtrl._setPlayerMovement(2);
                }
                if((angle>315 && angle <=360)||(angle>=0 && angle<=45)){
                    isJumping = false;
                    moveCode = 2;
                    self._enemyCtrl._setPlayerMovement(1);
                }
                if(angle>45 && angle <=135){
                    /**
                    moveCode = 0;
                    if(isJumping===false){
                        if(self.jumpCounter < self.airJumpCount){
                            self.t =0.0;
                            moveCode = 3;
                            self.jumpCounter += 1;
                        }
                    }
                    isJumping = true;
                    **/
                }
                self._playerCtrl._playerMove(moveCode);
                
            }else {
                self._enemyCtrl._setPlayerMovement(0);
                //停止前进
                self._playerCtrl._playerMoveStop(moveCode);
                isJumping = false;
                moveCode = 0;
            }

        });
        //按键按下
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, 
                        function (event) {
                            var angle = null;
                            switch(event.keyCode) {
                                case cc.KEY.a:
                                    self._playerCtrl._playerMove(1);
                                    self._enemyCtrl._setPlayerMovement(2);
                                    break;
                                case cc.KEY.d:
                                    self._playerCtrl._playerMove(2);
                                    self._enemyCtrl._setPlayerMovement(1);
                                    break;
                                case cc.KEY.space:
                                    if(self.isPushingSpace === false){
                                        if(self.jumpCounter < self.airJumpCount){
                                            self.t =0.0;
                                            self._playerCtrl._playerMove(3);
                                            self.jumpCounter += 1;
                                        
                                            self._enemyCtrl._setPlayerMovement(3);
                                        }
                                    }
                                    
                                    self.isPushingSpace = true;
                                    break;
                            }
                        }, this);
        //按键抬起
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, 
                        function (event){
                            switch(event.keyCode) {
                                case cc.KEY.a:
                                    self._playerCtrl._playerMoveStop(1);
                                    self._enemyCtrl._setPlayerMovement(0);
                                    break;
                                case cc.KEY.d:
                                    self._playerCtrl._playerMoveStop(2);
                                    self._enemyCtrl._setPlayerMovement(0);
                                    break;
                                case cc.KEY.space:
                                    self._playerCtrl._playerMoveStop(3);
                                    self.isPushingSpace = false;
                                    break;
                            }
                        }, this);

    },
    
    //坠落探测
    droppingDetec:function (deltaT) {
        
        var self = this; 
        
        var grounds = self.gameground.getChildren();
        
        //玩家的身体边缘
        var playerBottom = self.player.y - self.player.height/2;
        var playerLeft = self.player.x - self.player.width/2;
        var playerRight = self.player.x + self.player.width/2;
        
        
        
        //死亡地带边缘
        var deadgroundSurface = self.gamedeadground.y + self.gamedeadground.height/2;
        
        
        //遍历地面数组,如果存在某个groundsurface紧贴playerBottom则直接跳出遍历
        //如果不存在，再执行下坠的代码段：
        //判断x值符合player在ground正上方的值
        //上值取小于playerBottom的最大groundsurface值为坠落目的
        
        var isOnGround = false;
        var groundY = deadgroundSurface;
        for(var c = 0;c<grounds.length;c++){
            var groundLeft = grounds[c].x-grounds[c].width/2;
            var groundRight = grounds[c].x+grounds[c].width/2;
            var groundSurface = grounds[c].y + grounds[c].height/2;
            
            var isXposiAt = (playerLeft < groundRight)&&(playerRight > groundLeft);
            
            if(playerBottom == groundSurface && isXposiAt && grounds[c].width !== 0){
                isOnGround = true;
                break;
            }
            
            if(isXposiAt&&(playerBottom>=groundSurface))
            if(groundSurface < playerBottom)
            if(groundSurface > groundY)
            groundY = groundSurface;
        }
        
        self._playerCtrl._playerRotate(isOnGround);
        
        if(isOnGround){
            self.t=0;
            self.jumpCounter = 0;
            
        }
        else{
            self.t+=deltaT;
            self._playerCtrl._playerFall(playerBottom,groundY,self.t*self.a);
        }
        
        //self.player.runAction(self._playerCtrl._playerFall(self.player.y,groundY));
    },

    //场景切换识别
    sceneCallDetec:function () {
        var self = this;
        
        //结局场景
        var endGLeft = self.gameendground.x-self.gameendground.width/2;
        var endGRight = self.gameendground.x+self.gameendground.width/2;
        var endGSurface = self.gameendground.y + self.gameendground.height/2;
        
        //下一章节场景
        var nxtGLeft = self.gamenextground.x-self.gamenextground.width/2;
        var nxtGRight = self.gamenextground.x+self.gamenextground.width/2;
        var nxtGSurface = self.gamenextground.y + self.gamenextground.height/2;
        
        //玩家的身体边缘
        var playerBottom = self.player.y - self.player.height/2;
        var playerLeft = self.player.x - self.player.width/2;
        var playerRight = self.player.x + self.player.width/2;
        
        
        var isXposiAtEND = (playerLeft < endGRight)&&(playerRight > endGLeft);
        var isXposiAtNXT = (playerLeft < nxtGRight)&&(playerRight > nxtGLeft);
        
        
        //
        
        if(playerBottom == nxtGSurface && isXposiAtNXT && self.isCallingNextScene === false){
            self.isCallingNextScene = true;
            var spcGroundDatas = self._mainCtrl._getChapterData(gameData.onChapter,5);
            self._mainCtrl._nextChapterCall(spcGroundDatas[0][9]);
        }
        if(playerBottom == endGSurface && isXposiAtEND && self.isCallingNextScene === false){
            self.isCallingNextScene = true;
            var spcGroundDatas = self._mainCtrl._getChapterData(gameData.onChapter,5);
            self._mainCtrl._nextChapterCall(spcGroundDatas[2][9]);
        }
        
        
        
        
    },

    //主角死亡识别
    deathDetec:function () {
        
        var self = this;
        
        //坠落死
        var playerBottom = self.player.y - self.player.height/2;
        var deadgroundSurface = self.gamedeadground.y + self.gamedeadground.height/2;
        if(playerBottom == deadgroundSurface && self.isCallingNextScene === false){
            self.isCallingNextScene = true;
            self._mainCtrl._playerDeadCall(false,false);
        }
        //cc.director.loadScene("mainGameScene");
        
        //攻击死
        var enemys = self._enemyCtrl._getAllEnemyNodes();
        for(var a=0;a<enemys.length;a++){
            
            var xDist = enemys[a].x - self.player.x +self.worldPositionMark.x;
            var yDist = enemys[a].y - self.player.y +self.worldPositionMark.y;
            
            if(xDist < 0)xDist = -xDist;
            if(yDist < 0)yDist = -yDist;
            //如果直接传入player的坐标是屏幕中的相对坐标，我需要传入绝对坐标，也就是与worldPositionMark的坐标差
            if(xDist < (self.player.width+enemys[a].width)/2 && yDist < (self.player.height+enemys[a].height)/2 && self.isCallingNextScene === false){
                self.isCallingNextScene = true;
                self._mainCtrl._playerDeadCall(self.player.x-self.worldPositionMark.x,self.player.y-self.worldPositionMark.y);
            }
            
            
        }
        
    },
    
    //背景动画更新
    bgAnimeDetec:function(deltaT){
        var self = this;
        
        self._bgCtrl._anime(self.player.x,self.player.y,deltaT);
    },
    
    onLoad: function () {
        
        var self = this;
        
        //获取剧本控制，控制剧本流程
        self._mainCtrl = self.gamecanvas.getComponent("mainCtl");
        
        //获取摇杆控制组件
        self._joystickCtrl = self.joystick.getComponent("JoystickCtrl");
        //获取玩家控制组件
        self._playerCtrl = self.player.getComponent("playerCtl"); 
        //获取敌人控制组件
        self._enemyCtrl = self.enemygrp.getComponent("enemyCtl");
        //获取游戏地面组件
        self._groundCtrl = self.gameground.getComponent("groundCtl"); 
        //获取背景组件
        self._bgCtrl = self.gamebg.getComponent("bgCtl"); 
        //注册监听事件
        self.registerInputEvent();
        

    },
    
     update: function (dt) {
         //镜头移动
        this.cameraControl(dt);
        
        //探测坠落
        this.droppingDetec(dt);
        
        //探测玩家死亡
        this.deathDetec();
        
        //探测场景切换
        this.sceneCallDetec();
        
        //背景动画探测
        this.bgAnimeDetec(dt);
        
        //背景抖动
        this._bgCtrl._bgShaker(dt);
     },
});
