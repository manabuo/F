cc.Class({
    extends: cc.Component,
    
    properties: {
    },
    
    onLoad: function () {
        this.T = 0;
        cc.game.setFrameRate(60);
    },
    update: function (dt) {
        this.T+=1;
        if(this.T>450)cc.director.loadScene("mainMenu");
    },
});
