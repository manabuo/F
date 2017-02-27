cc.Class({
    extends: cc.Component,

    properties: {
        maxDx:150,
        maxDy:500,
        
        defaultX:0,
        defaultY:0,
        
        //-1 0 1
        accVectorX:-1,
        accVectorY:-1,
    },
    
    
    onLoad: function () {
        var self = this;
        self.defaultX = self.node.x;
        self.defaultY = self.node.y;
    },

    update: function (dt) {
        var self = this;
        if(self.node.x >= self.defaultX + self.maxDx)self.accVectorX = -1;
        else if(self.node.x <= self.defaultX - self.maxDx)self.accVectorX = 1;
        
        if(self.node.y >= self.defaultY + self.maxDy)self.accVectorY = -1;
        else if(self.node.y <= self.defaultY - self.maxDy)self.accVectorY = 1;
        
        self.node.x += self.accVectorX*40;
        self.node.y += self.accVectorY*0.3;
    },
});
