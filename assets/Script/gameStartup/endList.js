cc.Class({
    extends: cc.Component,

    properties: {
        rtn:cc.Node,
        
        enda:cc.Label,
        endb:cc.Label,
        endc:cc.Label,
        endd:cc.Label,
    },

    
    onLoad: function () {
        var self = this;
        
        var endA = cc.sys.localStorage.getItem('isEndA');
        var endB = cc.sys.localStorage.getItem('isEndB');
        var endC = cc.sys.localStorage.getItem('isEndC');
        var endD = cc.sys.localStorage.getItem('isEndD');
        cc.log(endA);
        if(parseInt(endA) === 1){self.enda.string = "重蹈覆辙";}
        if(parseInt(endB) === 1){self.endb.string = "假象";}
        if(parseInt(endC) === 1){self.endc.string = "旅程的开始";}
        if(parseInt(endD) === 1){self.endd.string = "失之交臂";}
        
        self.rtn.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.director.loadScene("mainMenu");
        }); 
    },
});
