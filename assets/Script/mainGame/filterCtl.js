cc.Class({
    extends: cc.Component,

    properties: {
        grounds:cc.Node,
        bgs:cc.Node,
        
        worldPosition:cc.Node,
    },
    initFilter:function(){
        
        
        this.node.opacity = 50;
    },
    frameFilter:function(){
        var self = this;
        
        //self.node.removeAllChildren();
        
        var allGrounds = self.grounds.getChildren();
        
        for(var a = 0;a<allGrounds.length;a++){
            var wid = allGrounds[a].width*1.3;
            var hei = allGrounds[a].height*1.3;
            
            var posiX = allGrounds[a].x;
            var posiY = allGrounds[a].y;
            
            var colo = allGrounds[a].color;
            
            var filterG = cc.instantiate(allGrounds[a]);
            self.node.addChild(filterG);
            
            filterG.setPosition(cc.p(posiX,posiY));
            filterG.width = wid;
            filterG.height = hei;
            filterG.color = colo;
            
        }
        
        var allBgs = self.bgs.getChildren();
        for(var b = 0 ;b<allBgs.length;b++){
            var bgwid = allBgs[b].width*1.3;
            var bghei = allBgs[b].height*1.3;
            
            var bgposiX = allBgs[b].x;
            var bgposiY = allBgs[b].y;
            
            var bgcolo = allBgs[b].color;
            
            var filterBG = cc.instantiate(allBgs[b]);
            self.node.addChild(filterBG);
            
            filterBG.setPosition(cc.p(bgposiX,bgposiY));
            filterBG.width = bgwid;
            filterBG.height = bghei;
            filterBG.color = bgcolo;
        }
        
    },
    
    onLoad: function () {
        var self = this;
        //self.initFilter();
        //self.frameFilter();
    },
    
    update: function (dt) {
        var self = this;
        //self.node.x = self.worldPosition.x;
    },
});
