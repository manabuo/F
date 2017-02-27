module.exports = {
    //每经过一章都会存档一次，玩家死亡次数会保存进去
    //换言之，如果玩家中途退出，则不会保存
    
    //当前进行章节
    onChapter:0,
    
    //当次玩家死亡次数
    playerDeadCount : 0,
    //
    genEnemyLen : 0,
    
    //玩家死亡位置
    playerDeadPosi : [[]],
    
    //播放音乐控制
    isPlayingBgm : false,
    playingChapter: 0,
    playingBgm : 0,
    
    stopSign:false,
};