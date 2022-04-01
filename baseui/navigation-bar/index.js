// baseui/navigation-bar/index.js
const globalData = getApp().globalData;
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    title:{
      type:String,
      value:""
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: globalData.statusBarHeight,
    navBarHeight: globalData.navBarHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleNavigationBack:function(){
      this.triggerEvent("click")
    }
  }
})
