var chapterData = require('chapterData');
var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        
        gameLayer:cc.Node,
        gameLifeLimit:cc.Label,
        
        pausebtn:cc.Node,
        pauseLay:cc.Node,
        
        gamedata:cc.Label,
        
        //玩家死亡次数上限
        playDeadMax:4,
        
        //特殊scene的章节ID
        CHAP_ENDA:21,
        CHAP_ENDB:22,
        CHAP_ENDC:23,
        CHAP_ENDD:24,
        
        CHAP_ENDPLAYERMAP:20,
    },
    /**
     *  这里是游戏的主函数，对
     *  -关卡存档数据读写，章节读取事件，玩家死亡事件，音量开关，暂停-
     *  进行控制
     *  
     * 注意：本游戏每个章节有一个ID
     * 第零章编号为0，依次递增
     * 
     * -------------------------------------------------------------------------
     * 保存的数据:
     * onChapter        进行到的章节
     * playerDeadTimes  玩家死亡的次数
     * -------------------------------------------------------------------------
     * -------------------------------------------------------------------------
     * 本游戏每章节的数据内容及其结构:
     * ---
     * 关卡章节名:
     * chapterArr = [string];
     * ---
     * 玩家初始位置:
     * playerGenPosi = [X,Y];
     * ---
     * 关卡背景：
     * bgtxtArr   = [[X,Y,R,G,B,A,string,fntSz]];
     * bgblkArr   = [[X,Y,W,H,R,G,B,A]];
     * randBlkData = [amount,minX,maxX,minY,maxY,minW,maxW,minH,maxH,R,G,B,A];
     * ---
     * 关卡地面:
     * groundArr = [[X,Y,W,H,R,G,B,A,draggable,flexible]];
     * 
     * draggable:
     * 0 不可拖拽
     * 1 x轴拖拽
     * 2 y轴拖拽
     * 3 x,y均可拖拽
     * 
     * flexible:
     * 0 不可伸缩
     * 1 x轴伸缩
     * 
     * spcGroundArr = [[X,Y,W,H,R,G,B,A,func,code]];
     * 
     * func:
     * 0 下一章节
     * 1 gamedeadground
     * 2 特殊章节
     * 
     * code:
     * 目标章节ID，当func为1时无意义
     * ---
     * 敌人生成:
     * enemyArr = [[X,Y,type]];
     * 
     * type:
     * 0 normalEnemy
     * 1 imageEnemy
     * 2 crisonEnemy
     * 
     * -------------------------------------------------------------------------
      **/
    
    
    //获取章节数据
    //whichData:
    //0:chapterArr
    //1:bgtxtArr  2:bgblkArr  3:randBlkData
    //4:groundArr 5:spcGroundArr 
    //6:enemyArr
    //7:playerGenPosi
    _getChapterData:function(chapNum,whichData){
        var self = this;
        
        cc.log('Load assets'+whichData+'of Chapter:'+chapNum);
        switch(whichData){
            case 0:return chapterData.chapterArr[chapNum];
            case 1:return chapterData.bgtxtArr[chapNum];
            case 2:return chapterData.bgblkArr[chapNum];
            case 3:return chapterData.randBlkData[chapNum];
            case 4:return chapterData.groundArr[chapNum];
            case 5:return chapterData.spcGroundArr[chapNum];
            case 6:return chapterData.enemyArr[chapNum];
            case 7:return chapterData.playerGenPosi[chapNum];
            default:return;
        }
        
    },
    
    
    //读取
    loadChapter:function(){
        
        var self = this;
        
        //读取的功能在继续游戏按钮而不是游戏scene中实现，所以这里实质不需要
        var test = cc.sys.localStorage.getItem('onChapter');
        cc.log('On Chapter:'+test);
        
    },
    
    //保存
    saveChapter:function(){
        //一关开始的时候，更新章节
        if(gameData.onChapter!==0 && gameData.onChapter< 19)cc.sys.localStorage.setItem('onChapter',gameData.onChapter);
        
    },
    saveplayerDeadData:function(){
        //一关完成的时候（完成，即触发进入另一个场景），更新玩家死亡次数
        var deadTimes = cc.sys.localStorage.getItem('playerDeadTimes');
        cc.sys.localStorage.setItem('playerDeadTimes',parseInt(deadTimes) + parseInt(gameData.playerDeadCount));
    },
    
    
    
    //玩家死亡，如果是被杀死记录玩家位置并在下次开始的时候在这里生成一个敌人
    _playerDeadCall:function(dieX,dieY){
        var self = this;
        
        gameData.playerDeadCount += 1;
        //死亡进入A结局
        if(gameData.playerDeadCount == self.playDeadMax)self._nextChapterCall(self.CHAP_ENDA);
        else{
            if(dieX ===false&&dieY===false){
            cc.log('deadground hit');
            cc.director.loadScene('mainGameScene'); 
            }
            else {
                cc.log('x:'+dieX +'y:'+ dieY + 'enemy hit');
                gameData.genEnemyLen += 1;
                var deadArr = [[dieX,dieY,0]];
                chapterData.enemyArr[gameData.onChapter] = chapterData.enemyArr[gameData.onChapter].concat(deadArr);
                gameData.playerDeadPosi = gameData.playerDeadPosi.concat(deadArr);
                
                cc.director.loadScene('mainGameScene'); 
            }
            
        }
        
        
    },
    //进入章节
    _nextChapterCall:function(chapNo){
        var self = this;
        cc.log('_nextChapterCall() chap:'+chapNo);
        
        cc.audioEngine.stopAll();
        
        //去掉死亡位置生成敌人
        if(gameData.playerDeadCount !== 0)chapterData.enemyArr[gameData.onChapter].splice(chapterData.enemyArr[gameData.onChapter].length-gameData.genEnemyLen,gameData.genEnemyLen);
        //更新玩家总死亡次数
        self.saveplayerDeadData();
        //清除上关死亡统计数据
        gameData.playerDeadPosi = [[]];
        gameData.playerDeadCount = 0;
        gameData.genEnemyLen = 0;
        
        //是否特殊章节？
        var isSpc = self.checkIfIsInSpcChptr(chapNo);
        
        //更新当前章节
        gameData.onChapter = chapNo;
        cc.director.loadScene('textScene');
        
    },
    
    
    //游戏暂停
    _pauseRegist:function(){
        var self = this;
        
        var pauseLabel = self.pausebtn.getChildByName("Label");
        pauseLabel = pauseLabel.getComponent(cc.Label);
        
        var defaultText = pauseLabel.string;
        var defaultPosition = cc.p(self.pausebtn.x,self.pausebtn.y);
        var defaultWidth = self.pausebtn.width;
        var defaultHeight = self.pausebtn.height;
        
        //暂停按钮按下
        self.pausebtn.on(cc.Node.EventType.TOUCH_START, function(event){
            if(cc.director.isPaused()){
                self.gameLayer.opacity = 255;
                self.pauseLay.opacity = 0;
                self.pauseLay.x = 1500;
                pauseLabel.string = defaultText;
                self.pausebtn.setPosition(defaultPosition);
                self.pausebtn.width = defaultWidth;
                self.pausebtn.height = defaultHeight;
                cc.director.resume();
            }else{
                self.gameLayer.opacity = 0;
                self.pauseLay.opacity = 255;
                self.pauseLay.x = 0;
                pauseLabel.string = '继续';
                self.pausebtn.setPosition(cc.p(0,0));
                self.pausebtn.width = 150;
                self.pausebtn.height = 60;
                cc.director.pause();
            }
        });
        
    },
    
    
    //检测是否进入了 特殊章节（即其他scene的引用）
    checkIfIsInSpcChptr:function(chapNo){
        var self = this;
        
        switch(chapNo){
            case self.CHAP_ENDA:cc.director.loadScene('endA');break;
            case self.CHAP_ENDB:cc.director.loadScene('endB');break;
            case self.CHAP_ENDC:cc.director.loadScene('endC');break;
            case self.CHAP_ENDD:cc.director.loadScene('endD');break;
            case self.CHAP_ENDPLAYERMAP:cc.director.loadScene('playerMapEnd');break;
            default:return false;
            
        }
        
        return true;
    },
    // use this for initialization
    onLoad: function () {
        var self = this;
        
        //cc.director.setProjection(5200);
        //cc.director.setDepthTest(false);
        //锁60帧，避免部分计时器出现问题
        //cc.game.setFrameRate(60);
        cc.director.setDisplayStats(true);
        //
        self._gameCtrl = self.gameLayer.getComponent("gameCtl");
        
        self._pauseRegist();
        
        //保存
        self.saveChapter();
        //显示剩余生命
        self.gameLifeLimit.string = self.playDeadMax - gameData.playerDeadCount - 1;
        
        cc.log('onLoad() called!');
        cc.log('playerDead:'+gameData.playerDeadCount+'times');
    },
    
    
    update: function (dt) {
        
        
    },
});
