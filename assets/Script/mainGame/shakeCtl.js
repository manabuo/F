cc.Class({
    extends: cc.Component,

    properties: {
        deltaT:1,
        
        positionDelta:0,
        
        dtCal:0,
        
        frame:0,
    },
    
    onLoad: function () {
        var self = this;
        
    },

    update: function (dt) {
        var self = this;
        
        self.node.rotation = self.node.parent.rotation;
        
        self.dtCal += dt; 
        if(self.dtCal >= self.deltaT){
            self.dtCal = 0;
            if(self.frame === 0){
                self.node.x += 10;
                self.node.y += 10;
                self.frame = 1;
            }
            else {
                self.node.x -= 10;
                self.node.y -= 10;
                self.frame = 0;
            }
        }
    },
});
