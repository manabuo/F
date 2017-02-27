cc.Class({
    extends: cc.Component,

    properties: {
        ret:cc.Node,
        player:cc.Node,
        txt:cc.Label,
        txtShadow:cc.Label,
    },

    
    onLoad: function () {
        this.ret.on(cc.Node.EventType.TOUCH_END, function(event){
            
            cc.director.loadScene('mainMenu');
        });
    },
    
    update:function(){
        var self = this;
        
        self.txtShadow.string = self.txt.string;
        self.player.x += 5;
    },
});
