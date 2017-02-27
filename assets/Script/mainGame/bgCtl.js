var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        
        gamecanvas:cc.Node,
        
        bgText:cc.Node,
        bgBlock:cc.Node,
        
        textAnimateSpace:0.5,
        
        tisShowed:[],
        tTmp:[],
        
        bgShakeT:8.0,
        bgShakeTtmp:0.0,
    },
    
    //背景文字管理器
    //二维数组格式：
    //positionX,positionY,color,text,textSz
    bgtxtManager:function(){
        var self = this;
        
        self.tTmp = self._mainCtrl._getChapterData(gameData.onChapter,1);
    },
    
    //背景色块管理器
    //二维数组格式：
    //positionX,positionY,width,height,color
    bgblkManager:function(){
        var self = this;
        
        var bgblkArr = self._mainCtrl._getChapterData(gameData.onChapter,2);
        var randBlkData = self._mainCtrl._getChapterData(gameData.onChapter,3);
        var randBlks = self.randBlkGen(randBlkData);
        return bgblkArr.concat(randBlks);
    },
    
    //随机色块生成器
    //amount,minX,maxX,minY,maxY,minW,maxW,minH,maxH,color
    randBlkGen:function(randBlkData){
        var self = this;
        
        var randBlkArr =[[]];
        
        
        for(var a=0;a<randBlkData[0];a++){
            
            var X = randBlkData[1] + Math.round(Math.random()*(randBlkData[2] - randBlkData[1]));
            var Y = randBlkData[3] + Math.round(Math.random()*(randBlkData[4] - randBlkData[3]));
            var W = randBlkData[5] + Math.round(Math.random()*(randBlkData[6] - randBlkData[5]));
            var H = randBlkData[7] + Math.round(Math.random()*(randBlkData[8] - randBlkData[7]));
            var color = self.colorManager(randBlkData[9],randBlkData[10],randBlkData[11],randBlkData[12]);
            randBlkArr[a] = [X,Y,W,H,color];
            
        }
        //生成随机色块阴影
        var shadowBlkArr = self._spawnBgShadow(randBlkArr);
        
        return shadowBlkArr.concat(randBlkArr);
    },
    
    //阴影生成器
    _spawnBgShadow:function(blk){
        var self = this;
        
        var shadowblk = [[]];
        for(var c = 0;c<blk.length;c++){
            
            var posiX = blk[c][0] - 10;
            var posiY = blk[c][1] - 5;
            var wid = blk[c][2] + 20;
            var hei = blk[c][3];
            var colo = self.colorManager(100, 100, 100, 255);
            
            shadowblk[c] = [posiX,posiY,wid,hei,colo];
        }
        
        return shadowblk;
        
    },
    //背景抖动
    _bgShaker:function(dt){
        var self = this;
        
        self.bgShakeTtmp += dt;
        
        if(self.bgShakeTtmp <= self.bgShakeT/2){
            self.node.x += 0.05;
            self.node.y -= 0.1;
        }
        
        if(self.bgShakeTtmp >= self.bgShakeT/2){
            self.node.x -= 0.05;
            self.node.y += 0.1;
        }
        
        if(self.bgShakeTtmp >= self.bgShakeT)self.bgShakeTtmp = 0.0;
        
    },
    //初始化
    animeCalInit:function(){
        var self = this;
        
        self.bgtxtManager();
        for(var a=0;a<self.tTmp.length;a++){
            self.tisShowed[a]=false;
        }
        
    },
    
    
    colorManager:function(R,G,B,A){
        var c;
        c = new cc.Color(R,G,B,A);
        return c;
    },
    
    //spawnBgTxt有点特殊，因为要在玩家到来的时候spawn，所以不会在onLoad里实现
    //为了获得玩家坐标，通过this._anime()方法在gameCtl.js的update()方法之中调用
    spawnBgTxt: function(arrayNum,deltaT) {
        var self = this;
        
        var bgtxtData = self.tTmp;
        
            
        var bgT = cc.instantiate(self.bgText);
        self.node.addChild(bgT);
        bgT.setPosition(cc.p(bgtxtData[arrayNum][0],bgtxtData[arrayNum][1]));
        bgT.color = self.colorManager(bgtxtData[arrayNum][2], bgtxtData[arrayNum][3], bgtxtData[arrayNum][4], bgtxtData[arrayNum][5]);
        
        var bgLabel = bgT.getComponent(cc.Label);
        bgLabel.fontSize = bgtxtData[arrayNum][7];
        
        var labelTxt = bgtxtData[arrayNum][6];
        bgLabel.string = labelTxt;
        self.tisShowed[arrayNum] = true;
    },
    
    spawnBgBlk: function() {
        var self = this;
        
        var bgblkData = self.bgblkManager();
        
        for(var i = 0;i<bgblkData.length;i++){
            
            var bgB = cc.instantiate(self.bgBlock);
            self.node.addChild(bgB);
        
            bgB.setPosition(cc.p(bgblkData[i][0],bgblkData[i][1]));
            bgB.width = bgblkData[i][2];
            bgB.height = bgblkData[i][3];
            bgB.color = self.colorManager(bgblkData[i][4], bgblkData[i][5], bgblkData[i][6], bgblkData[i][7]);
            
            //滤镜贴图
            var filt = bgB.getChildByName("filter");
            filt.width = bgB.width;
            filt.height = bgB.height;
        }
    },
    
    
    _anime:function(playerX,playerY,deltaT){
        var self = this;
        
        var bgtxtData = self.tTmp;
        var labels = self.node.getChildren();
        
        var gamebgX = self.node.x;
        var gamebgY = self.node.y;
        
        for(var i = 0;i<bgtxtData.length;i++){
            
            var dx = playerX - bgtxtData[i][0] - gamebgX;
            var dy = playerY - bgtxtData[i][1] - gamebgY;
            
            //只有当玩家x与该文字距离< 300,y与该文字距离< 200才会显示
            if((dx<300 && dx>-300) && (dy<200 && dy>-200)){
                
                if(self.tisShowed[i] === false)self.spawnBgTxt(i,deltaT);
            }
            
            
        }
        
    },
    
    onLoad: function () {
        
        var self = this;
        
        //获取剧本控制，控制剧本流程
        self._mainCtrl = self.gamecanvas.getComponent("mainCtl");
        
        //初始化动画数组
        self.animeCalInit();
        //注册建立背景
        self.spawnBgBlk();
        //self.spawnBgTxt();
        
    },
    
    update: function (dt) {

    },
});
