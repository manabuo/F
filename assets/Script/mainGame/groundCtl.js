var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        onChapter:0,
        
        player:cc.Node,
        
        gamecanvas:cc.Node,
        
        ground:cc.Node,
        
        sceneground:cc.Node,
        deadground:cc.Node,
        endground:cc.Node,
        
        worldPositionMark:cc.Node,
    },
    
    //特殊功能地面管理器
    //positionX,positionY,width,height,color,func,code
    //func包括:0 进入下一场景 1 接触死亡 2 进入结局场景
    //code是进入场景的名称，func为1时无用
    spcGroundManager:function(){
        var self = this;
        
        return self._mainCtrl._getChapterData(gameData.onChapter,5);
    },
    //普通地面管理器
    //二位数组格式：
    //positionX,positionY,width,height,color
    groundManager:function(){
        var self = this;
        
        return self._mainCtrl._getChapterData(gameData.onChapter,4);
    },
    
    colorManager:function(R,G,B,A){
        var c;
        c = new cc.Color(R,G,B,A);
        return c;
    },
    
    //可拖动地面拖动
    onDragging:function(dground,isX,isY,isL){
        var self = this;
        
        
        
        var defaultX = dground.x;
        var defaultY = dground.y;
        var defaultL = dground.width;
        
        
        //发现把isX和isY写在一个函数里会导致降帧较严重，so
        //X轴移动
        if(isX){
            dground.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            //cc.log('Ground Dragging\nx:' + event.getDeltaX());
            
            var maxX = defaultX + 300 + self.worldPositionMark.x;
            var minX = defaultX - 300 + self.worldPositionMark.x;
            
                if(dground.x <= maxX && dground.x >= minX){
                    dground.x += event.getDeltaX();
                }else{
                    if(dground.x < minX){
                        dground.x = minX;
                    }else{
                        dground.x = maxX;
                    }
                }
            });
        }
        //Y轴移动
        if(isY){
            
            dground.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            //cc.log('Ground Dragging\ny:'+ event.getDeltaY());
            
            //玩家的边缘
            var playerL = self.player.x - self.player.width/2 + self.worldPositionMark.x;
            var playerR = self.player.x + self.player.width/2 + self.worldPositionMark.x;
            var playerB = self.player.y - self.player.height/2 + self.worldPositionMark.y;
            //地面的边缘
            var groundL = dground.x - dground.width/2 + self.worldPositionMark.x;
            var groundR = dground.x + dground.width/2 + self.worldPositionMark.x;
            var groundT = dground.y + dground.height/2 + self.worldPositionMark.y;
            //推动玩家
            if(playerL < groundR && playerR > groundL && (playerB >= dground.y)&& (playerB <= groundT))
            self.player.y = dground.y + dground.height/2 + self.player.height/2+30;
            
            //地面移动
            var maxY = defaultY + 300 + self.worldPositionMark.y;
            var minY = defaultY - 300 + self.worldPositionMark.y;
            
            if(dground.y <= maxY && dground.y >= minY){
                dground.y += event.getDeltaY();
            }else{
                if(dground.y < minY){
                    dground.y = minY;
                }else{
                    dground.y = maxY;
                }
            }
            
            
            
            });
        }
        
        if(isL){
            
            //滤镜贴图
            var filt = dground.getChildByName("filter");
            
            dground.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            //cc.log('Ground Dragging\nl:'+ event.getDeltaX());
            
            var maxL = defaultL + 300;
            var minL = defaultL;

                if(dground.width <= maxL && dground.width >= minL){
                    dground.width += event.getDeltaX();
                    filt.width += event.getDeltaX();
                }else{
                    if(dground.width < minL){
                        dground.width = minL;
                        filt.width = minL;
                    }else{
                        dground.width = maxL;
                        filt.width = maxL;
                    }
                }
            
            });
        }
        
    },
    //拖动时的
    draggingSticky:function(){
        
    },
    spawnGround: function() {
        var self = this;
        
        var groundData = self.groundManager();
        var spcGroundData = self.spcGroundManager();
        //最先生成阴影
        self._spawnShadow(groundData);
        
        
        //生成普通地面
        for(var i = 0;i<groundData.length;i++){
            
            var newGround = cc.instantiate(self.ground);
            self.node.addChild(newGround);
        
            newGround.setPosition(cc.p(groundData[i][0],groundData[i][1]));
            newGround.width = groundData[i][2];
            newGround.height = groundData[i][3];
            newGround.color = self.colorManager(groundData[i][4], groundData[i][5], groundData[i][6], groundData[i][7]);
            
            var isX = false;
            var isY = false;
            var isL = false;
            
            if(groundData[i][8] === 1)isX = true;
            if(groundData[i][8] === 2)isY = true;
            if(groundData[i][8] === 3){isX = true;isY = true;}
            
            if(groundData[i][9] === 1)isL = true;
            self.onDragging(newGround,isX,isY,isL);
            
            //滤镜贴图
            var filt = newGround.getChildByName("filter");
            filt.width = newGround.width;
            filt.height = newGround.height;
        }
        
        //生成功能地面
        for(var a = 0;a<spcGroundData.length;a++){
            
            
            var actualG;
            switch (spcGroundData[a][8]){
                case 0:actualG = self.sceneground;break;
                case 1:actualG = self.deadground;break;
                case 2:actualG = self.endground;break;
                default:break;
            }
            
            actualG.setPosition(cc.p(spcGroundData[a][0],spcGroundData[a][1]));
            actualG.width = spcGroundData[a][2];
            actualG.height = spcGroundData[a][3];
            actualG.color = self.colorManager(spcGroundData[a][4], spcGroundData[a][5], spcGroundData[a][6], spcGroundData[a][7]);
            //滤镜贴图
            var filt = actualG.getChildByName("filter");
            filt.width = actualG.width;
            filt.height = actualG.height;
        }
        
        
    },
    
    //地面阴影
    _spawnShadow:function(grounds){
        var self = this;
        
        for(var c = 0;c<grounds.length;c++){
            
            if(grounds[c][8] === 0 && grounds[c][9] === 0){
                var posiX = grounds[c][0] + 10;
                var posiY = grounds[c][1] - 5;
                var wid = grounds[c][2];
                var hei = grounds[c][3];
                var colo = self.colorManager(100, 100, 100, 255);
            
                var gShadow = cc.instantiate(self.ground);
                self.node.addChild(gShadow);
            
                gShadow.setPosition(cc.p(posiX,posiY));
                gShadow.width = wid;
                gShadow.height = hei;
                gShadow.color = colo;
                gShadow.opacity = 180;
            }
        }
        
    },
    
    onLoad: function () {
        
        var self = this;
        //获取剧本控制，控制剧本流程
        self._mainCtrl = self.gamecanvas.getComponent("mainCtl");
        
        
        //注册建立地面世界
        self.spawnGround();
        
    },
    
    update: function (dt) {
        var self = this;
        
    },
});
