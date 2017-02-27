var chapterData = require('chapterData');
var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        //bgm资源
	        bgmAudio: {
	            default: null,
	            url: cc.AudioClip
	        },
	        //
	        textLayout:{
	            default: null,
	            type: cc.Label
	        },
	        
	        nextButton:{
	            
	            default:null,
	            type: cc.Node
	        },
	       
	        //-----
	        paragPosi:0,
	        touchable:true,
    },
    
    
    updateText: function (num){
        return chapterData.txtSceneArr[gameData.onChapter][num];
    },
    
    onLoad: function () {
        
        var self = this;
        self.textLayout.string = self.updateText(0);
        
        self.nextButton.on(cc.Node.EventType.TOUCH_START,
        
        function(event){
            if(self.touchable === true){
                self.paragPosi+=1;
                var str = self.updateText(self.paragPosi);
                if(typeof(str)=="undefined")cc.director.loadScene("mainGameScene");
                else self.textLayout.string = str;
            }
        }
        , self.nextButton);
        
    },
    
     update: function (dt) {
        var self = this;
        
        var str = self.textLayout.string;
        if(self.updateText(self.paragPosi)!=str)self.touchable=false;
        else self.touchable=true;
        
     },
});