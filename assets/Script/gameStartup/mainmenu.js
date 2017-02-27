var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        
        aboutLay:cc.Node,
        aboutClose:cc.Node,
        
        
	    //按键音效资源
	        buttonAudio: {
	            default: null,
	            url: cc.AudioClip
	        },
	        
	        text:{
	            default: null,
	            type: cc.Label
	        },
	        
	        
	        newGameButton:{
	            default: null,
	            type: cc.Node
	        },
	        loadGameButton:{
	            default: null,
	            type: cc.Node
	        },
	        endListButton:{
	            default: null,
	            type: cc.Node
	        },
	        aboutButton:{
	            default: null,
	            type: cc.Node
	        },
	        exitButton:{
	            default: null,
	            type: cc.Node
	        },
	        
	        createGameButton:{
	            default: null,
	            type: cc.Node
	        },
    },
    
    //清理存档
    restoresave:function(){
        cc.sys.localStorage.setItem('onChapter',0);
        cc.sys.localStorage.setItem('playerDeadTimes',0);
    },
    //检查是否第一次打开游戏
    checkFirstLaunch:function(){
        if(isNaN(parseInt(cc.sys.localStorage.getItem('playerDeadTimes'))))cc.sys.localStorage.setItem('playerDeadTimes',0);
        if(isNaN(parseInt(cc.sys.localStorage.getItem('onChapter'))))cc.sys.localStorage.setItem('onChapter',0);
    },
    // use this for initialization
    onLoad: function () {
        
        var self = this;
        //self.restoresave();//------------
        self.checkFirstLaunch();
        var saveChap = cc.sys.localStorage.getItem('onChapter');
        var saveDeadTimes = cc.sys.localStorage.getItem('playerDeadTimes');
        
        cc.log('saveChap' + saveChap);
        cc.log('saveDeadTimes' + saveDeadTimes);
        self.text.string = '实验目前进行到了第'+(parseInt(saveChap)+1)+'步，\n目前已有'+(parseInt(saveDeadTimes)+1)+'名实验体实验失败\n报告到此';
        
        if(parseInt(saveChap) === 0 ){
            cc.log('saveChap === 0');
            self.loadGameButton.active = false;
        }
        
        var newgame =function (event){
            cc.audioEngine.playEffect(self.buttonAudio, false);
            
            gameData.onChapter=0;
            cc.director.loadScene("textScene");
        };
        var loadgame =function (event){
            cc.audioEngine.playEffect(self.buttonAudio, false);
            
            gameData.onChapter=saveChap;
            cc.director.loadScene("textScene");
            
        };
        var endlist = function(event){
            cc.audioEngine.playEffect(self.buttonAudio, false);
            cc.director.loadScene("endList");
        };
        var about =function (event){
            cc.audioEngine.playEffect(self.buttonAudio, false);
            self.aboutLay.x = 0;
        };
        var exitgame =function (event){
            cc.audioEngine.playEffect(self.buttonAudio, false);
            cc.director.end();
        };
        
        var creategame = function(event){
            cc.audioEngine.playEffect(self.buttonAudio, false);
            cc.director.loadScene("newCreateMap");
        };
        
        self.newGameButton.on(cc.Node.EventType.TOUCH_END,newgame,self); 
        self.loadGameButton.on(cc.Node.EventType.TOUCH_END,loadgame,self); 
        self.endListButton.on(cc.Node.EventType.TOUCH_END,endlist,self); 
        self.aboutButton.on(cc.Node.EventType.TOUCH_END,about,self); 
        self.exitButton.on(cc.Node.EventType.TOUCH_END,exitgame,self); 
        
        self.createGameButton.on(cc.Node.EventType.TOUCH_END,creategame,self); 
        
        
        self.aboutClose.on(cc.Node.EventType.TOUCH_END,function(event){
            self.aboutLay.x = 1500;
        }); 
        
    },
    
     update: function (dt) {
         
         
         
         
         
     },
});
