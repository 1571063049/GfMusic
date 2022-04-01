// components/song-list/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    Menulist:{
      type:Object,
      value:[]
    },
    title:{
      type:String,
      value:""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenWidth : app.globalData.screenWidth
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMoreMenu(){
      wx.navigateTo({
        url: '/packageDetail/pages/menu-detail/index',
      })
    },
    // 给标签设置属性item进行传值
    // handleMoreMenu(event){
    //   console.log(event);
    //   const id = event.currentTarget.dataset.item.id;
    //   wx.navigateTo({
    //     url: '../../pages/song-detail/index?type=menu&id='+ id,
    //   })
    // }
  }
})
