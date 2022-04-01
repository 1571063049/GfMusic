// pages/song-detail/index.js
// 导入全局状态管理
import {rankingStore ,  AllsongListMap , playerStore} from '../../../store/index'
import {getSongdetail} from '../../../service/music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songDetail:{},
    songtype:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let idx = options.idx;
    let id = options.id;
    this.setData({ songtype : options.type})
    if(options.type == "menu"){
      getSongdetail(id).then( res => {
        this.setData({ songDetail : res.playlist})
      })
    }else if(options.type == "song"){
      // 获取共享数据
      const songListMap = AllsongListMap;
      let songListitem = songListMap[idx];
      rankingStore.onState(songListitem,(res) => {
        this.setData({songDetail : res});
      })
    }
  },

  // 事件监听
  // 点击播放歌曲传入当前歌曲播放列表以及索引
  handleSongPlayerClick:function(event){
    const index = event.currentTarget.dataset.index;
    const list = this.data.songDetail.tracks
    playerStore.setState("currentSongIndex",index)
    playerStore.setState("currentSongList",list)
  },
  
})