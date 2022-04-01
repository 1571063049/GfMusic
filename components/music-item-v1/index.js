// components/music-item-v1/index.js
import {playerStore} from '../../store/player-store'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToMusicPlayer:function () {
      let id = this.properties.item.id;
      wx.navigateTo({
        url: `/packagePlayer/pages/player-detail/index?id=`+ id,
      })
      // 根据id对歌曲的数据进行请求奇迹其他操作
      playerStore.dispatch("playMusicDataSongIdAction",{id})
    }
  }
})
