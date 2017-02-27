/**
 * 存储的数据：
 * mapDatas:[
 * [
 *  [chapterArr],
 *  [txtSceneArr],
 *  [bgtxtArr],
 *  [bgblkArr],
 *  [randBlkData],
 *  [groundArr],
 *  [spcGroundArr],
 *  [enemyArr],
 *  [playerGenPosi]
 * ]
 * ,
 * ...]
 * 
 * **/
var newMap = require('newMapData');

var chapterData = require('chapterData');
var gameData = require('gameData');

cc.Class({
    extends: cc.Component,

    properties: {
        mapShowLay:cc.Node,
        mapShow:cc.Node,
        
        newMapName:cc.EditBox,
        createNew:cc.Node,
        
        ret:cc.Node,
    },
    deleteMap:function(nodeButton,position){
        nodeButton.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.log('del '+position);
            newMap.allMapData.splice(position,1);
            cc.sys.localStorage.setItem('mapDatas', JSON.stringify(newMap.allMapData));
            cc.director.loadScene("newCreateMap");
        });
    },
    editMap:function(nodeButton,position){
        nodeButton.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.log('edt '+position);
            newMap.mapDataPosition = position;
            newMap.isNewMap = false;
            cc.director.loadScene("createMap");
        });
    },
    playMap:function(nodeButton,position){
        nodeButton.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.log('ply '+position);
            cc.log(newMap.allMapData[position][2]);
            chapterData.chapterArr[19] = newMap.allMapData[position][0],
            chapterData.bgtxtArr[19] = newMap.allMapData[position][2],
            chapterData.bgblkArr[19] = newMap.allMapData[position][3],
            chapterData.randBlkData[19] = newMap.allMapData[position][4][0],
            chapterData.groundArr[19] = newMap.allMapData[position][5],
            chapterData.spcGroundArr[19] = newMap.allMapData[position][6],
            chapterData.enemyArr[19] = newMap.allMapData[position][7],
            chapterData.playerGenPosi[19] = newMap.allMapData[position][8],
            
            gameData.onChapter=19;
            cc.director.loadScene("mainGameScene");
        });
    },
    loadMaps:function(){
        var self = this;
        //cc.sys.localStorage.setItem('mapDatas', JSON.stringify(newMap.allMapData));
        newMap.allMapData = JSON.parse(cc.sys.localStorage.getItem('mapDatas'));
        if(newMap.allMapData != null){
            for(var a=0;a<newMap.allMapData.length;a++){
                var mapRow = cc.instantiate(self.mapShow);
                self.mapShowLay.addChild(mapRow);
            
                var chapterName = mapRow.getChildByName('name');
                chapterName = chapterName.getComponent(cc.Label);
                chapterName.string = newMap.allMapData[a][0][0];//地图名
            
                var del = mapRow.getChildByName('del');
                self.deleteMap(del,a);
            
                var edit = mapRow.getChildByName('edit');
                self.editMap(edit,a);
            
                var play = mapRow.getChildByName('play');
                self.playMap(play,a);
            }
            
            
        }
        
    },
    
    registerButton:function(){
        var self = this;
        self.createNew.on(cc.Node.EventType.TOUCH_END,function(event){
            newMap.chapterName = self.newMapName.string;
            newMap.isNewMap = true;
            
            cc.director.loadScene("createMap");
        });
        
        self.ret.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.director.loadScene("mainMenu");
        });
    },
    
    onLoad: function () {
        var self = this;
        self.registerButton();
        self.loadMaps();
    },

    update: function (dt) {
        
    },
});
