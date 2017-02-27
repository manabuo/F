cc.Class({
    extends: cc.Component,

    properties: {
        //插空字符
        spcstr: '.',
        //每隔多少帧显示下一个字符
        freshD:30,
        
        frameCal:0,
        position :0,
        oriText:'',
    },
    
    onLoad: function () {
        var self = this;
        var label = self.getComponent(cc.Label);
        self.oriText = label.string;
        label.string = '';
        
    },
    
    update: function (dt) {
        var self = this;
        if(self.position==self.oriText.length){
            if(self.oriText != self.getComponent(cc.Label).string){
                self.oriText = self.getComponent(cc.Label).string;
                self.getComponent(cc.Label).string ='';
                self.position = 0;
            }
        }
        
        self.frameCal+=1;
        
        if(self.frameCal==self.freshD){
            
            self.frameCal = 0;
             
            if(self.position<self.oriText.length){
                
                self.getComponent(cc.Label).string ='';
                for(var a =0;a<=self.position;a++){
                    self.getComponent(cc.Label).string += self.oriText.charAt(a);
                }
                for(var i =0;i<self.oriText.length-self.position-1;i++){
                    self.getComponent(cc.Label).string +=self.spcstr;
                }
                self.position+=1;
            }else{
                
                if(self.oriText != self.getComponent(cc.Label).string){
                    self.position = 0;
                }
            }
        }
        
        
    },
    
    
});
