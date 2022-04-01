// components/top-list/index.js
import { playerStore } from '../../store/player-store'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    },
    index:{
      type:Number,
      value:0
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
    ClickMvPlay(){
      let mvid = this.properties.item.mvid
      wx.navigateTo({
        url: `/packageDetail/pages/video-detail/index?id=${mvid}`,
      })
    },
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
