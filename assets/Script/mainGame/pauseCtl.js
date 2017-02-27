var chapterData = require('chapterData');
var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        back:cc.Node,
        quit:cc.Node,
    },
    
    onLoad: function () {
        this.back.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.director.resume();
            cc.audioEngine.stopAll();
            
            //去掉死亡位置生成敌人
            if(gameData.playerDeadCount !== 0)chapterData.enemyArr[gameData.onChapter].splice(chapterData.enemyArr[gameData.onChapter].length-gameData.genEnemyLen,gameData.genEnemyLen);
            gameData.onChapter= 0;
            gameData.playerDeadCount = 0;
            gameData.playerDeadPosi = [[]];
            gameData.isPlayingBgm = false;
            gameData.playingChapter = 0;
            gameData.playingBgm = 0;
            gameData.stopSign = false;
            gameData.genEnemyLen = 0;
            
            cc.director.loadScene("mainMenu");
        }); 
        this.quit.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.director.resume();
            cc.audioEngine.stopAll();
            cc.director.end();
        }); 
    },
});
