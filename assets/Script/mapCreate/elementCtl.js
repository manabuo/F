cc.Class({
    extends: cc.Component,

    properties: {
        
        ctlTypeBtn:cc.Node,
        delBtn:cc.Node,
        sizeCtlable:false,
        isDeleteable:false,
        //---------------------
        worldPosition:0,
        
        //0:位置，1:大小
        ctlType:0,
        isDelete:false,
    },
    updateWorldPosition:function(){
        var self = this;
        self.worldPosition = self.node.parent.x;
        //cc.log('WorldPosition updated!\nX:'+self.worldPosition);
    },
    
    detectDelete:function(){
        var self = this;
        self.node.on(cc.Node.EventType.TOUCH_START, function(event){
            if(self.isDeleteable && self.isDelete){
                self.node.removeFromParent();
            }
        });
    },
    
    register:function(){
        var self = this;
        
        self.ctlTypeBtn.on(cc.Node.EventType.TOUCH_END, function(event){
            var label = self.ctlTypeBtn.getChildByName("Label");
            label = label.getComponent(cc.Label);
            
            if(self.ctlType === 0){
                self.ctlType = 1;
                label.string = "大小调整";
            }
            else if(self.ctlType === 1){
                self.ctlType = 0;
                label.string = "位置调整";
            }
        });
            
        self.delBtn.on(cc.Node.EventType.TOUCH_END, function(event){
            var label = self.delBtn.getChildByName("Label");
            label = label.getComponent(cc.Label);
            if(self.isDelete){
                self.isDelete = false;
                label.string = "删除";
            }else{
                self.isDelete = true;
                label.string = "请选择";
            }
            
            
        });
        
        self.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            if(self.ctlType === 0){
                self.node.x += event.getDeltaX();
                self.node.y += event.getDeltaY();
            }
            if(self.ctlType === 1 && self.sizeCtlable === true){
                var w = self.node.width;
                var h = self.node.height; 
                if(self.node.width>30)self.node.width = parseFloat(w) + event.getDeltaX();
                else if(event.getDeltaX()>0)self.node.width = parseFloat(w) + event.getDeltaX();
                
                if(self.node.height>30)self.node.height = parseFloat(h) + event.getDeltaY();
                else if(event.getDeltaY()>0)self.node.height = parseFloat(h) + event.getDeltaY();
            }
            
        });
        
    },
    
    onLoad: function () {
        var self = this;
        
        self.register();
        self.detectDelete();
        
    },
    
    update: function (dt) {
        var self = this;
        self.updateWorldPosition();
        
        
    },
});
