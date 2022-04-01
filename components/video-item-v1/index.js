// components/video-item-v1/index.js
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
    // 监听组件点击
    hanldeItemVideoClick(){
      let id = this.data.item.id;
      wx.navigateTo({
        // url: 'pages/video-detail/index?id='+id,
        url:`/packageDetail/pages/video-detail/index?id=${id}`
      })
    }
  }
})
