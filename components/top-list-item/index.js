// components/top-list-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{}
    },
    idx:{
      type:String,
      default:"1"
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
    handleToSongMenu(){
      // console.log('handleToSongMenu',this.data.item.id); //有值，则说明，data中默认会有传过来的item
      const idx = this.properties.idx;
        wx.navigateTo({
        url: '/packageDetail/pages/song-detail/index?type=song&idx='+idx,
      })
    },
   
  }
})
