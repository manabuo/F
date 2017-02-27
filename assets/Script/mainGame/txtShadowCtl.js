cc.Class({
    extends: cc.Component,
    
    onLoad: function(){
        var self = this;
        self.node.x = 5;
        self.node.y = 0;
        var colo = new cc.Color(75,75,75,255);
        self.node.color = colo;
        var sz = self.node.parent.getComponent(cc.Label).fontSize;
        self.node.getComponent(cc.Label).fontSize = sz;
        var ft = self.node.parent.getComponent(cc.Label).font;
        self.node.getComponent(cc.Label).font = ft;
    },
    update: function (dt) {
        var self = this;
        var str = self.node.parent.getComponent(cc.Label).string;
        self.node.getComponent(cc.Label).string = str;
    },
});
