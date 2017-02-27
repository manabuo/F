var newMap = require('newMapData');
cc.Class({
    extends: cc.Component,

    properties: {
        gameLay:cc.Node,
        
        
        //Module
        player:cc.Node,
        finground:cc.Node,
        txtModule:cc.Node,
        blkModule:cc.Node,
        neModule:cc.Node,
        ceModule:cc.Node,
        ieModule:cc.Node,
        
        //LayerCtl
        groundArr:cc.Node,
        XgroundArr:cc.Node,
        YgroundArr:cc.Node,
        LgroundArr:cc.Node,
        bgblkArr:cc.Node,
        bgtxtArr:cc.Node,
        neArr:cc.Node,
        ceArr:cc.Node,
        ieArr:cc.Node,
        
        //UI
        addBgBlk:cc.Node,
        addBgTxt:cc.Node,
        
        addGrnd:cc.Node,
        addXGrnd:cc.Node,
        addYGrnd:cc.Node,
        addLGrnd:cc.Node,
        
        addNe:cc.Node,
        addCe:cc.Node,
        addIe:cc.Node,
        
        getWidth:cc.EditBox,
        getHeight:cc.EditBox,
        getR:cc.EditBox,
        getG:cc.EditBox,
        getB:cc.EditBox,
        getA:cc.EditBox,
        
        outputResult:cc.Node,
        
        outputLay:cc.Node,
        outputBox:cc.EditBox,
        outputClose:cc.Node,
        
        save:cc.Node,
        
        back:cc.Node,
    },
    
    printBlks:function(){
        
        var self = this;
        
        if(newMap.isNewMap===false){
            
            //地图数据
            var thisMap = newMap.allMapData[newMap.mapDataPosition];
            
            var player = self.player;
            var finground = self.finground;
            
            newMap.chapterName = thisMap[0][0];
            
            var btArr = thisMap[2];
            
            for(var a=0;a<btArr.length;a++){
                var newTxt = cc.instantiate(self.txtModule);
                self.bgtxtArr.addChild(newTxt);
                newTxt.setPosition(cc.p(btArr[a][0]/0.7,btArr[a][1]));
                newTxt.color = self.colorManager(btArr[a][2],btArr[a][3],btArr[a][4],btArr[a][5]);
                var editbox = newTxt.getComponent(cc.EditBox);
                editbox.string = btArr[a][6];
            }
            
            var bbArr = thisMap[3];
            
            for(var b=0;b<bbArr.length;b++){
                var newBgBlk = cc.instantiate(self.blkModule);
                self.bgblkArr.addChild(newBgBlk);
                newBgBlk.setPosition(cc.p(bbArr[b][0]/0.7,bbArr[b][1]));
                newBgBlk.width = bbArr[b][2]/0.7;
                newBgBlk.height = bbArr[b][3];
                newBgBlk.color = self.colorManager(bbArr[b][4],bbArr[b][5],bbArr[b][6],bbArr[b][7]);
                newBgBlk.getChildByName("type").getComponent(cc.Label).string = "背景色块";
            }
            
            var ggArr = thisMap[5];
            
            for(var c = 0;c<ggArr.length;c++){
                var newBlk = cc.instantiate(self.blkModule);
                if(1===ggArr[c][9]){
                    self.LgroundArr.addChild(newBlk);
                    newBlk.getChildByName("type").getComponent(cc.Label).string = "拉伸地面";
                }else{
                    
                    switch(ggArr[c][8]){
                        case 0:
                            self.groundArr.addChild(newBlk);
                            newBlk.getChildByName("type").getComponent(cc.Label).string = "固定地面";
                            break;
                        case 1:
                            self.XgroundArr.addChild(newBlk);
                            newBlk.getChildByName("type").getComponent(cc.Label).string = "平移地面";
                            break;
                        case 2:
                            self.YgroundArr.addChild(newBlk);
                            newBlk.getChildByName("type").getComponent(cc.Label).string = "纵移地面";
                            break;
                        default:break;
                    }
                    
                }
                
                newBlk.setPosition(cc.p(ggArr[c][0],ggArr[c][1]));
                newBlk.width = ggArr[c][2];
                newBlk.height = ggArr[c][3];
                newBlk.color = self.colorManager(ggArr[c][4],ggArr[c][5],ggArr[c][6],ggArr[c][7]);
                
            }
            
            var sgArr = thisMap[6];
            
            for(var d = 0;d<sgArr.length;d++){
                if(sgArr[d][8]===0){
                    finground.x = sgArr[d][0];
                    finground.y = sgArr[d][1];
                }
                
            }
            
            var enArr = thisMap[7];
            //cc.log(enArr);
            
            for(var e = 0;e<enArr.length;e++){
                switch(enArr[e][2]){
                    case 0 :
                        var newNe = cc.instantiate(self.neModule);
                        self.neArr.addChild(newNe);
                        newNe.x = enArr[e][0];
                        newNe.y = enArr[e][1];
                        break;
                    case 1 :
                        var newIe = cc.instantiate(self.ieModule);
                        self.ieArr.addChild(newIe);
                        newIe.x = enArr[e][0];
                        newIe.y = enArr[e][1];
                        break;
                    case 2 :
                        var newCe = cc.instantiate(self.ceModule);
                        self.ceArr.addChild(newCe);
                        newCe.x = enArr[e][0];
                        newCe.y = enArr[e][1];
                        break;
                        
                    default:break;
                }
                
                
                
            }
            
            
            
        }
    },
    output:function(){
        var self = this;
        
        self.outputClose.on(cc.Node.EventType.TOUCH_END,function(event){
            self.outputLay.x = -900;
            self.outputBox.string ='';
        });
        
        self.outputResult.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('output:');
            
            var allGround = self.groundArr.getChildren();
            var allXGround = self.XgroundArr.getChildren();
            var allYGround = self.YgroundArr.getChildren();
            var allLGround = self.LgroundArr.getChildren();
            var allBgblk = self.bgblkArr.getChildren();
            var allBgtxt = self.bgtxtArr.getChildren();
            var allNe = self.neArr.getChildren();
            var allCe = self.ceArr.getChildren();
            var allIe = self.ieArr.getChildren();
            var player = self.player;
            
            var gArr = [];
            for(var a = 0;a<allGround.length;a++)
            gArr[a]=[allGround[a].x,allGround[a].y,allGround[a].width,allGround[a].height,allGround[a].color.r,allGround[a].color.g,allGround[a].color.b,allGround[a].color.a,0,0];
            
            var xgArr = [];
            for(var b = 0;b<allXGround.length;b++)
            xgArr[b]=[allXGround[b].x,allXGround[b].y,allXGround[b].width,allXGround[b].height,allXGround[b].color.r,allXGround[b].color.g,allXGround[b].color.b,allXGround[b].color.a,1,0];
            
            var ygArr = [];
            for(var c = 0;c<allYGround.length;c++)
            ygArr[c]=[allYGround[c].x,allYGround[c].y,allYGround[c].width,allYGround[c].height,allYGround[c].color.r,allYGround[c].color.g,allYGround[c].color.b,allYGround[c].color.a,2,0];
            
            var lgArr = [];
            for(var d = 0;d<allLGround.length;d++)
            lgArr[d]=[allLGround[d].x,allLGround[d].y,allLGround[d].width,allLGround[d].height,allLGround[d].color.r,allLGround[d].color.g,allLGround[d].color.b,allLGround[d].color.a,0,1];
            
            //bgblkArr
            var bbArr = [];
            for(var e = 0;e<allBgblk.length;e++)
            bbArr[e]=[allBgblk[e].x*0.7,allBgblk[e].y,allBgblk[e].width*0.7,allBgblk[e].height,allBgblk[e].color.r,allBgblk[e].color.g,allBgblk[e].color.b,allBgblk[e].color.a];
            
            //bgtxtArr
            var btArr = [];
            for(var f = 0;f<allBgtxt.length;f++){
                var btEditTxt = allBgtxt[f].getComponent(cc.EditBox);
                btArr[f]=[allBgtxt[f].x*0.7,allBgtxt[f].y,allBgtxt[f].color.r,allBgtxt[f].color.g,allBgtxt[f].color.b,allBgtxt[f].color.a,btEditTxt.string,40];
            }
            var nArr = [];
            for(var g = 0;g<allNe.length;g++)
            nArr[g]=[allNe[g].x,allNe[g].y,0];
            
            var cArr = [];
            for(var h = 0;h<allCe.length;h++)
            cArr[h]=[allCe[h].x,allCe[h].y,2];
            
            var iArr = [];
            for(var i = 0;i<allIe.length;i++)
            iArr[i]=[allIe[i].x,allIe[i].y,1];
            
            //playerGenPosi
            var playerArr = [player.x,player.y];
            
            var fgArr=[[self.finground.x,self.finground.y,50,50,0,255,0,255,0,20/*目标章节*/]];//通过关卡A点
            var dgArr=[[10000,-700,20000,20,255, 100, 100, 255,1,0]];//死亡判定地面
            var f2gArr=[[0,-1000,0,0,0,0,255,255,2,0]];//通过关卡B点，自定义地图无此功能
            
            //chapterArr
            var cpArr =[newMap.chapterName];
            //txtSceneArr
            var tsArr =['...'];
            //randBlkData
            var rbArr = [[50, -200, 8000, 800, 1300, 100, 300, 300, 1300, 30, 30, 30, 255],];
            //groundArr
            var ggArr = gArr.concat(xgArr.concat(ygArr.concat(lgArr)));
            //spcGroundArr
            var sgArr = fgArr.concat(dgArr.concat(f2gArr));
            //enemyArr
            var enArr = nArr.concat(cArr.concat(iArr));
            
            self.outputLay.x = 0;
            self.outputBox.string = '';
            //输出窗口
            self.outputBox.string += 'chapterArr:[[\''+cpArr+'\'],],\n';
            self.outputBox.string += 'txtSceneArr:[[\'...\'],],\n';
            self.outputBox.string += 'bgtxtArr:[[\n';
            for(var z = 0;z<btArr.length;z++){
                self.outputBox.string += '[';
                for(var zz = 0;zz<btArr[z].length;zz++){
                    self.outputBox.string += btArr[z][zz]+',';
                }
                self.outputBox.string += '],\n';
            }
            self.outputBox.string += '],],\n';
            
            self.outputBox.string += 'bgblkArr:[[\n';
            for(var y = 0;y<bbArr.length;y++){
                self.outputBox.string += '[';
                for(var yy = 0;yy<bbArr[y].length;yy++){
                    self.outputBox.string += bbArr[y][yy]+',';
                }
                self.outputBox.string += '],\n';
            }
            self.outputBox.string += '],],\n';
            
            self.outputBox.string += 'randBlkData:[[';
            for(var x = 0;x<rbArr.length;x++){
                self.outputBox.string += rbArr[x]+',';
            }
            self.outputBox.string += ']],\n';
            
            self.outputBox.string += 'groundArr:[[\n';
            for(var w = 0;w<ggArr.length;w++){
                self.outputBox.string += '[';
                for(var ww = 0;ww<ggArr[w].length;ww++){
                    self.outputBox.string += ggArr[w][ww]+',';
                }
                self.outputBox.string += '],\n';
            }
            self.outputBox.string += '],],\n';
            
            self.outputBox.string += 'spcGroundArr:[[\n';
            for(var v = 0;v<sgArr.length;v++){
                self.outputBox.string += '[';
                for(var vv = 0;vv<sgArr[v].length;vv++){
                    self.outputBox.string += sgArr[v][vv]+',';
                }
                self.outputBox.string += '],\n';
            }
            self.outputBox.string += '],],\n';
            
            self.outputBox.string += 'enemyArr:[[\n';
            for(var u = 0;u<enArr.length;u++){
                self.outputBox.string += '[';
                for(var uu = 0;uu<enArr[u].length;uu++){
                    self.outputBox.string += enArr[u][uu]+',';
                }
                self.outputBox.string += '],\n';
            }
            self.outputBox.string += '],],\n';
            
            self.outputBox.string += 'playerGenPosi:[[';
            for(var t = 0;t<playerArr.length;t++){
                self.outputBox.string += playerArr[t]+',';
            }
            self.outputBox.string += ']],\n';
        });
        
    },
    
    colorManager:function(R,G,B,A){
        var c;
        c = new cc.Color(R,G,B,A);
        return c;
    },
    registButton:function(){
        var self = this;
        
        
        self.addBgBlk.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('bgBlk Add');
            var newBgBlk = cc.instantiate(self.blkModule);
            self.bgblkArr.addChild(newBgBlk);
            newBgBlk.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
            newBgBlk.width = self.getWidth.string;
            newBgBlk.height = self.getHeight.string;
            newBgBlk.color = self.colorManager(self.getR.string, self.getG.string, self.getB.string, self.getA.string);
            //cc.log(newBgBlk.color.r);
            
            newBgBlk.getChildByName("type").getComponent(cc.Label).string = "背景色块";
        });
        
        self.addBgTxt.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('bgTxt Add');
            var newBgTxt = cc.instantiate(self.txtModule);
            self.bgtxtArr.addChild(newBgTxt);
            newBgTxt.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
            newBgTxt.width = self.getWidth.string;
            newBgTxt.height = self.getHeight.string;
            newBgTxt.color = self.colorManager(self.getR.string, self.getG.string, self.getB.string, self.getA.string);
        });
        
        self.addGrnd.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('grnd Add');
            var newGrnd = cc.instantiate(self.blkModule);
            self.groundArr.addChild(newGrnd);
            newGrnd.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
            newGrnd.width = self.getWidth.string;
            newGrnd.height = self.getHeight.string;
            newGrnd.color = self.colorManager(self.getR.string, self.getG.string, self.getB.string, self.getA.string);
            newGrnd.getChildByName("type").getComponent(cc.Label).string = "固定地面";
        });
        
        self.addXGrnd.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('XGrnd Add');
            var newGrnd = cc.instantiate(self.blkModule);
            self.XgroundArr.addChild(newGrnd);
            newGrnd.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
            newGrnd.width = self.getWidth.string;
            newGrnd.height = self.getHeight.string;
            newGrnd.color = self.colorManager(self.getR.string, self.getG.string, self.getB.string, self.getA.string);
            newGrnd.getChildByName("type").getComponent(cc.Label).string = "平移地面";
        });
        
        self.addYGrnd.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('YGrnd Add');
            var newGrnd = cc.instantiate(self.blkModule);
            self.YgroundArr.addChild(newGrnd);
            newGrnd.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
            newGrnd.width = self.getWidth.string;
            newGrnd.height = self.getHeight.string;
            newGrnd.color = self.colorManager(self.getR.string, self.getG.string, self.getB.string, self.getA.string);
            newGrnd.getChildByName("type").getComponent(cc.Label).string = "纵移地面";
        });
        
        self.addLGrnd.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('LGrnd Add');
            var newGrnd = cc.instantiate(self.blkModule);
            self.LgroundArr.addChild(newGrnd);
            newGrnd.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
            newGrnd.width = self.getWidth.string;
            newGrnd.height = self.getHeight.string;
            newGrnd.color = self.colorManager(self.getR.string, self.getG.string, self.getB.string, self.getA.string);
            newGrnd.getChildByName("type").getComponent(cc.Label).string = "拉伸地面";
        });
        
        self.addNe.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('ne Add');
            var newEnemy = cc.instantiate(self.neModule);
            self.neArr.addChild(newEnemy);
            newEnemy.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
        });
        self.addCe.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('ce Add');
            var newEnemy = cc.instantiate(self.ceModule);
            self.ceArr.addChild(newEnemy);
            newEnemy.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
        });
        self.addIe.on(cc.Node.EventType.TOUCH_END,function(event){
            //cc.log('ie Add');
            var newEnemy = cc.instantiate(self.ieModule);
            self.ieArr.addChild(newEnemy);
            newEnemy.setPosition(cc.p(-self.gameLay.x,self.gameLay.y));
        });
        
        
        self.back.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.director.loadScene("mainMenu");
        });
        
        self.save.on(cc.Node.EventType.TOUCH_END,function(event){
            
            var allGround = self.groundArr.getChildren();
            var allXGround = self.XgroundArr.getChildren();
            var allYGround = self.YgroundArr.getChildren();
            var allLGround = self.LgroundArr.getChildren();
            var allBgblk = self.bgblkArr.getChildren();
            var allBgtxt = self.bgtxtArr.getChildren();
            var allNe = self.neArr.getChildren();
            var allCe = self.ceArr.getChildren();
            var allIe = self.ieArr.getChildren();
            var player = self.player;
            
            var gArr = [];
            for(var a = 0;a<allGround.length;a++)
            gArr[a]=[allGround[a].x,allGround[a].y,allGround[a].width,allGround[a].height,allGround[a].color.r,allGround[a].color.g,allGround[a].color.b,allGround[a].color.a,0,0];
            
            var xgArr = [];
            for(var b = 0;b<allXGround.length;b++)
            xgArr[b]=[allXGround[b].x,allXGround[b].y,allXGround[b].width,allXGround[b].height,allXGround[b].color.r,allXGround[b].color.g,allXGround[b].color.b,allXGround[b].color.a,1,0];
            
            var ygArr = [];
            for(var c = 0;c<allYGround.length;c++)
            ygArr[c]=[allYGround[c].x,allYGround[c].y,allYGround[c].width,allYGround[c].height,allYGround[c].color.r,allYGround[c].color.g,allYGround[c].color.b,allYGround[c].color.a,2,0];
            
            var lgArr = [];
            for(var d = 0;d<allLGround.length;d++)
            lgArr[d]=[allLGround[d].x,allLGround[d].y,allLGround[d].width,allLGround[d].height,allLGround[d].color.r,allLGround[d].color.g,allLGround[d].color.b,allLGround[d].color.a,0,1];
            
            //bgblkArr
            var bbArr = [];
            for(var e = 0;e<allBgblk.length;e++)
            bbArr[e]=[allBgblk[e].x*0.7,allBgblk[e].y,allBgblk[e].width*0.7,allBgblk[e].height,allBgblk[e].color.r,allBgblk[e].color.g,allBgblk[e].color.b,allBgblk[e].color.a];
            
            //bgtxtArr
            var btArr = [];
            for(var f = 0;f<allBgtxt.length;f++){
                var btEditTxt = allBgtxt[f].getComponent(cc.EditBox);
                btArr[f]=[allBgtxt[f].x*0.7,allBgtxt[f].y,allBgtxt[f].color.r,allBgtxt[f].color.g,allBgtxt[f].color.b,allBgtxt[f].color.a,btEditTxt.string,40];
            }
            var nArr = [];
            for(var g = 0;g<allNe.length;g++)
            nArr[g]=[allNe[g].x,allNe[g].y,0];
            
            var cArr = [];
            for(var h = 0;h<allCe.length;h++)
            cArr[h]=[allCe[h].x,allCe[h].y,2];
            
            var iArr = [];
            for(var i = 0;i<allIe.length;i++)
            iArr[i]=[allIe[i].x,allIe[i].y,1];
            
            //playerGenPosi
            var playerArr = [player.x,player.y];
            
            var fgArr=[[self.finground.x,self.finground.y,50,50,0,255,0,255,0,20/*目标章节*/]];//通过关卡A点
            var dgArr=[[10000,-700,20000,20,255, 100, 100, 255,1,0]];//死亡判定地面
            var f2gArr=[[0,-1000,0,0,0,0,255,255,2,0]];//通过关卡B点，自定义地图无此功能
            
            //chapterArr
            var cpArr =[newMap.chapterName];
            //txtSceneArr
            var tsArr =['...'];
            //randBlkData
            var rbArr = [[50, -200, 8000, 800, 1300, 100, 300, 300, 1300, 30, 30, 30, 255],];
            //groundArr
            var ggArr = gArr.concat(xgArr.concat(ygArr.concat(lgArr)));
            //spcGroundArr
            var sgArr = fgArr.concat(dgArr.concat(f2gArr));
            //enemyArr
            var enArr = nArr.concat(cArr.concat(iArr));
            
            
            var thisChapter = [[]];
            thisChapter[0][0]=cpArr;
            thisChapter[0][1]=tsArr;
            thisChapter[0][2]=btArr;
            thisChapter[0][3]=bbArr;
            thisChapter[0][4]=rbArr;
            thisChapter[0][5]=ggArr;
            thisChapter[0][6]=sgArr;
            thisChapter[0][7]=enArr;
            thisChapter[0][8]=playerArr;
            
            if(newMap.isNewMap){
                if(newMap.allMapData !== null)newMap.allMapData = newMap.allMapData.concat(thisChapter);
                else newMap.allMapData = thisChapter;
                
            }else{
                newMap.allMapData[newMap.mapDataPosition] = thisChapter[0];
            }
            cc.sys.localStorage.setItem('mapDatas', JSON.stringify(newMap.allMapData));
            cc.director.loadScene("newCreateMap");
        });
    },

    onLoad: function () {
        var self = this;
        self.printBlks();
        self.registButton();
        self.output();
    },
    
    
    update: function (dt) {
        var self = this;
        
    },
});
