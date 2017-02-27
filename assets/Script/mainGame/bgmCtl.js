var chapterData = require('chapterData');
var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        bgms:{
            default:[],
            url:[cc.AudioClip]
        }
    },
    playBgm:function(){
        
        if(gameData.isPlayingBgm===false){
                gameData.playingBgm = cc.audioEngine.play(this.bgms[gameData.onChapter],true);
                gameData.isPlayingBgm = true;
                gameData.playingChapter = gameData.onChapter;
            }
    },
    
    onLoad: function () {
        
        if(gameData.onChapter == gameData.playingChapter){
            this.playBgm();
        }else{
            cc.audioEngine.stop(gameData.playingBgm);
            gameData.isPlayingBgm=false;
            this.playBgm();
        }
        
    },
    
    
    
    update: function (dt) {
        
    },
});
