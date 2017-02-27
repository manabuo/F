var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        gamecanvas:cc.Node,
        
        normalEnemyGrp:cc.Node,
        imageEnemyGrp:cc.Node,
        crimsonEnemyGrp:cc.Node,
        
        enemyNormal:cc.Node,
        enemyImage:cc.Node,
        enemyCrimson:cc.Node,
        
        player:cc.Node,
        gameground:cc.Node,
        deadground:cc.Node,
        worldPositionMark:cc.Node,
        
        playerMovement:0,
        playerJmp:0,
        
        //普通敌人数据---------------------------------------------
        ne_moveSpeed:120,
        ne_jmpHeight:130,
        ne_jumpDuration:0.5,
        
        ne_isJumping:[],
        
        //Newton
        ne_t:[],
        ne_jumpCounter:[],
        ne_a:15,
        
        
        //image敌人数据---------------------------------------------
        ie_moveSpeed:200,
        ie_jmpHeight:250,
        ie_jumpDuration:0.5,
        
        ie_isJumping:[],
        
        //Newton
        ie_t:[],
        ie_jumpCounter:[],
        ie_a:15,
        
        
        //crimson敌人数据---------------------------------------------
        ce_moveSpeed:140,
        ce_jmpHeight:100,
        ce_jumpDuration:0.5,
        
        ce_isJumping:[],
        
        //Newton
        ce_t:[],
        ce_jumpCounter:[],
        ce_a:10,
    },
    //初始化数组
    initEnemyMem:function(){
        var self = this;
        var nE = self.normalEnemyGrp.getChildren();
        var iE = self.imageEnemyGrp.getChildren();
        var cE = self.crimsonEnemyGrp.getChildren();
        
        for(var a = 0;a<nE.length;a++)self.ne_t[a] = 0.0;
        for(var b = 0;b<iE.length;b++)self.ie_t[b] = 0.0;
        for(var c = 0;c<cE.length;c++)self.ce_t[c] = 0.0;
        
        for(var d = 0;d<iE.length;d++)self.ie_jumpCounter[d]=0;
    },
 
    //敌方管理器
    //二位数组格式：
    //positionX,positionY,type
    enemyManager:function(){
        var self = this;
        return self._mainCtrl._getChapterData(gameData.onChapter,6);
    },

    
    //生成敌人
    spawnEnemyFrmScript: function() {
        var self = this;
        
        var enemyData = self.enemyManager();
        
        for(var i = 0;i<enemyData.length;i++){
            self._spawnEnemy(enemyData[i][0], enemyData[i][1], enemyData[i][2]);
        }
    },
    _spawnEnemy:function(posiX,posiY,type){
        var self = this;
        
        
        if(type === 0){
            var newNormalEnemy = cc.instantiate(self.enemyNormal);
            self.normalEnemyGrp.addChild(newNormalEnemy);
            newNormalEnemy.setPosition(cc.p(posiX,posiY));
        }
        if(type === 1){
            var newImageEnemy = cc.instantiate(self.enemyImage);
            self.imageEnemyGrp.addChild(newImageEnemy);
            newImageEnemy.setPosition(cc.p(posiX,posiY));
        }
        if(type === 2){
            var newCrimsonEnemy = cc.instantiate(self.enemyCrimson);
            self.crimsonEnemyGrp.addChild(newCrimsonEnemy);
            newCrimsonEnemy.setPosition(cc.p(posiX,posiY));
        }
        
        //...
    },
    
    _getAllEnemyNodes:function(){
        var self = this;
        
        var nes = self.normalEnemyGrp.getChildren();
        var ies = self.imageEnemyGrp.getChildren();
        var ces = self.crimsonEnemyGrp.getChildren();
        
        return ces.concat(nes.concat(ies));
    },
    //普通敌人的AI
    normalEnemyAI: function(deltaT){
        var self = this;
        
        var allNormalEnemys = self.normalEnemyGrp.getChildren();
        
        for(var a = 0;a<allNormalEnemys.length;a++){
            
            var xDist = allNormalEnemys[a].x - self.player.x + self.worldPositionMark.x;
            var yDist = allNormalEnemys[a].y - self.player.y + self.worldPositionMark.y;
            
            
            if(xDist<500 && xDist>-500 && yDist<500 && yDist > -500){
                if(xDist > 0)self.enemyMove(a,1,0,allNormalEnemys[a],deltaT);
                if(xDist < 0)self.enemyMove(a,2,0,allNormalEnemys[a],deltaT);
                if(yDist < -self.player.height)self.enemyMove(a,3,0,allNormalEnemys[a],deltaT);
            }else self.enemyMove(a,0,0,allNormalEnemys[a],deltaT);
            
        }
        
    },
    _setPlayerMovement:function(move){
        var self = this;
        if(move == 3){
            self.playerJmp = 1;
        }
        else{
            self.playerMovement = move;
        }
    },
    //image敌人AI
    imageEnemyAI:function(deltaT){
        var self = this;
        
        var allImageEnemys = self.imageEnemyGrp.getChildren();
        
        for(var a = 0;a<allImageEnemys.length;a++){
            
            var xDist = allImageEnemys[a].x - self.player.x + self.worldPositionMark.x;
            var yDist = allImageEnemys[a].y - self.player.y + self.worldPositionMark.y;
            
            
            if(xDist<600 && xDist>-600 && yDist<500 && yDist > -500){
                self.enemyMove(a,self.playerMovement,1,allImageEnemys[a],deltaT);
                if(self.playerJmp == 1){
                    self.enemyMove(a,3,1,allImageEnemys[a],deltaT);
                    self.playerJmp = 0;
                }
            }else self.enemyMove(a,0,1,allImageEnemys[a],deltaT);
            
        }
        
    },
    //crimson敌人AI
    crimsonEnemyAI:function(deltaT){
        var self = this;
        
        var allCrimsonEnemys = self.crimsonEnemyGrp.getChildren();
        
        for(var a = 0;a<allCrimsonEnemys.length;a++){
            
            var xDist = allCrimsonEnemys[a].x - self.player.x + self.worldPositionMark.x;
            var yDist = allCrimsonEnemys[a].y - self.player.y + self.worldPositionMark.y;
            
            
            if(xDist<300 && xDist>-300 && yDist<300 && yDist > -300){
                if(xDist > 0)self.enemyMove(a,1,2,allCrimsonEnemys[a],deltaT);
                if(xDist < 0)self.enemyMove(a,2,2,allCrimsonEnemys[a],deltaT);
                if(yDist < -self.player.height)self.enemyMove(a,3,2,allCrimsonEnemys[a],deltaT);
            }else self.enemyMove(a,0,2,allCrimsonEnemys[a],deltaT);
            
        }
        
        
    },
    //敌人的移动操作函数
    //code,0静止，1左移，2右移，3跳跃
    //type,0普通,1镜像
    enemyMove:function(arrPosi,code,type,enemyNode,deltaT){
        var self = this;
        //先探测下落
        self.enemyFallDetec(arrPosi,type,enemyNode,deltaT);
        
        if(type === 0){
            switch (code) {
                case 0:break;
                case 1:enemyNode.x -= self.ne_moveSpeed * deltaT;break;
                case 2:enemyNode.x += self.ne_moveSpeed * deltaT;break;
                case 3:
                    if(self.ne_isJumping[arrPosi] === false){
                        enemyNode.runAction(cc.moveBy(self.ne_jumpDuration, cc.p(0, self.ne_jmpHeight)).easing(cc.easeCubicActionOut()));
                        self.ne_isJumping[arrPosi] = true;
                    }
                    break;
                default:break;
            }
        }
        
        if(type === 1){
            switch (code) {
                case 0:break;
                case 1:enemyNode.x -= self.ie_moveSpeed * deltaT;break;
                case 2:enemyNode.x += self.ie_moveSpeed * deltaT;break;
                case 3:
                    if(self.ie_isJumping[arrPosi] === false || self.ie_jumpCounter[arrPosi] < 2){
                        self.ie_jumpCounter[arrPosi] += 1;
                        self.ie_t[arrPosi] = 0;
                        enemyNode.runAction(cc.moveBy(self.ie_jumpDuration, cc.p(0, self.ie_jmpHeight)).easing(cc.easeCubicActionOut()));
                        self.ie_isJumping[arrPosi] = true;
                    }
                    break;
                default:break;
            }
        }
        
        if(type === 2){
            switch (code) {
                case 0:break;
                case 1:enemyNode.x -= self.ce_moveSpeed * deltaT;break;
                case 2:enemyNode.x += self.ce_moveSpeed * deltaT;break;
                case 3:
                    if(self.ce_isJumping[arrPosi] === false){
                        enemyNode.runAction(cc.moveBy(self.ce_jumpDuration, cc.p(0, self.ce_jmpHeight)).easing(cc.easeCubicActionOut()));
                        self.ce_isJumping[arrPosi] = true;
                    }
                    break;
                default:break;
            }
        }
    },
    
    //
    enemyFallDetec:function(arrPosi,type,enemyNode,deltaT){
        var self = this;
        
        var deadgroundSurface = self.deadground.y + self.deadground.height/2;
        var grounds = self.gameground.getChildren();
        
        //身体边缘
        var enemyBottom = enemyNode.y - enemyNode.height/2 +self.worldPositionMark.y;
        var enemyLeft = enemyNode.x - enemyNode.width/2 +self.worldPositionMark.x;
        var enemyRight = enemyNode.x + enemyNode.width/2 +self.worldPositionMark.x;
        
        //敌人的坠落死亡
        if(enemyBottom == deadgroundSurface){//remove...
        }
        
        //遍历地面数组,如果存在某个groundsurface紧贴enemyBottom则直接跳出遍历
        //如果不存在，再执行下坠的代码段：
        //判断x值符合enemy在ground正上方的值
        //上值取小于enemyBottom的最大groundsurface值为坠落目的
        var isOnGround = false;
        var groundY = deadgroundSurface;
        
        for(var c = 0;c<grounds.length;c++){
            var groundLeft = grounds[c].x-grounds[c].width/2;
            var groundRight = grounds[c].x+grounds[c].width/2;
            var groundSurface = grounds[c].y + grounds[c].height/2;
        
            var isXposiAt = (enemyLeft < groundRight)&&(enemyRight > groundLeft);
        
            if(enemyBottom == groundSurface && isXposiAt && grounds[c].width !== 0){
                isOnGround = true;
                break;
            }
            
            if(isXposiAt&&(enemyBottom>=groundSurface)){
                if(groundSurface < enemyBottom){
                    
                    if(groundSurface > groundY){
                        groundY = groundSurface;
                        
                    }
                }
            }
            
        }
        
        if(type===0){
            if(isOnGround){
                self.ne_t[arrPosi]=0;
                self.ne_jumpCounter[arrPosi] = 0;
                self.ne_isJumping[arrPosi] = false;
            }else{
                self.ne_t[arrPosi]+=deltaT;
                self.enemyFall(enemyNode,enemyBottom,groundY,self.ne_t[arrPosi]*self.ne_a);
                
            }
        }
            
        if(type===1){
           if(isOnGround){
                self.ie_t[arrPosi]=0;
                self.ie_jumpCounter[arrPosi] = 0;
                self.ie_isJumping[arrPosi] = false;
            }else{
                self.ie_t[arrPosi]+=deltaT;
                self.enemyFall(enemyNode,enemyBottom,groundY,self.ie_t[arrPosi]*self.ie_a);
            }
        }
        
        if(type===2){
           if(isOnGround){
                self.ce_t[arrPosi]=0;
                self.ce_jumpCounter[arrPosi] = 0;
                self.ce_isJumping[arrPosi] = false;
            }else{
                self.ce_t[arrPosi]+=deltaT;
                self.enemyFall(enemyNode,enemyBottom,groundY,self.ce_t[arrPosi]*self.ce_a);
            }
        }
        
        
    },
    
    //掉落函数，landposiY指由于存在一个下落平台，平台的y值
    enemyFall:function(enemyCall,enemyposiY,landposiY,speed){
        if(enemyposiY>landposiY){
            
            if(enemyposiY-landposiY > speed)
            enemyCall.y -= speed;
            else enemyCall.y  = landposiY + enemyCall.height/2;
        }
    },
    
    onLoad: function () {
        
        var self = this;
        //获取剧本控制，控制剧本流程
        self._mainCtrl = self.gamecanvas.getComponent("mainCtl");
        //注册建立敌人
        self.spawnEnemyFrmScript();
        //初始化数组
        self.initEnemyMem();
        
    },
    
    update: function (dt) {
        var self = this;
        
        self.normalEnemyAI(dt);
        self.imageEnemyAI(dt);
        self.crimsonEnemyAI(dt);
    },
});


