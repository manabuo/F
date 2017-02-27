var gameData = require('gameData');
cc.Class({
    extends: cc.Component,

    properties: {
        gamecanvas:cc.Node,
        
        chapterLayout:cc.Node,
        chapterLabel:cc.Label,
        
        isAnimeOn:false,
        
        chapter:'',
        
        Ttmp:0,
        
    },
    chapterManager:function(){
        var self = this;
        
        return self._mainCtrl._getChapterData(gameData.onChapter,0);
    },
    
    _showChapter:function(chapNum){
        
        var self = this;
        var chapArr = self.chapterManager();
        self.initLay();
        
        
        self.chapter = chapArr[0];
        //这个bool被每帧的anime函数侦测
        self.isAnimeOn = true;
        
        
    },
    
    //初始化内容
    initLay:function(){
        var self = this;
        self.chapterLayout.height = 0;
        self.chapterLabel.string = '';
    },
    
    txtAnime:function(){
        var self = this;
        var txtNode = self.node.getChildByName("chapterBg").getChildByName("chapterLabel");
        if(self.Ttmp < 50)txtNode.rotation += 0.10;
        else if(self.Ttmp < 200)txtNode.rotation -= 0.10;
        
    },
    
    anime:function(){
        var self = this;
        
        if(self.isAnimeOn === true){
            
            
            
            if(self.chapterLayout.height < 170){
                self.chapterLayout.height += 5;
            }else
            if(self.chapterLayout.height == 170){
                self.chapterLabel.string = self.chapter;
                self.chapterLayout.height += 5;
            }else
            if(self.Ttmp <300){
                self.Ttmp += 1;
            }else 
            
            
            
            
            //清理
            if(self.Ttmp == 300){
                
                self.isAnimeOn=false;
                self.Ttmp = 0;
                self.initLay();
            }
        }
        
        
    },
    

    onLoad: function () {
        var self = this;
        
        //获取剧本控制，控制剧本流程
        self._mainCtrl = self.gamecanvas.getComponent("mainCtl");
        
        self.initLay();
        
        self._showChapter(0);
    },

    update: function (dt) {
        var self = this;
        //章节显示动画探测
        self.anime();
        self.txtAnime();
    },
});
