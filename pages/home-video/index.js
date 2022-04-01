// pages/video/index.js
import {getTopMV} from '../../service/video'
Page({
    data:{
      topMvList:[],
      hasMoremv:false,
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // const res = await getTopMV(0);
    // this.setData({ topMvList : res.data});
    // this.data.hasMoremv = res.hasMore;
    this.getTopMVdata(0);
  },


  // =============================网络请求===========================
  // 该方法的逻辑值得你多去学学(gf!)
  async getTopMVdata(offset){
    if(!this.data.hasMoremv && offset !=0) return;
    else{
      // 展示加载动画
      wx.showNavigationBarLoading();
      // 真正请求数据
      // try{
      //   var res = await getTopMV(offset);
      // } catch(err) { console.log(err); }
      const res = await getTopMV(offset);
      let newData = this.data.topMvList;
      if(offset === 0){
        newData = res.data;
      }else{
        newData = newData.concat(res.data);
      }
      // 设置数据
      this.setData({topMvList : newData});
      this.setData({hasMoremv : res.hasMore});
      // 隐藏页面上方加载动画
      wx.hideNavigationBarLoading();
    }
  },

  // =============================事件监听===========================
  // 点击推荐歌曲头部跳转
  handleItemClick(event){
    // console.log(event);
    let id = event.currentTarget.dataset.item.id;
    wx.navigateTo({
      // url: '../../pages/video-detail/index?id='+id,
      url: `/packageDetail/pages/video-detail/index?id=${id}`,
    })
  }, 
  // 其他的生命周期回调函数
  // 下拉刷新
  onPullDownRefresh(){
    // const res = await getTopMV(0);
    // this.setData({ topMvList : res.data});
    this.getTopMVdata(0);
    // 停止下拉刷新动画 
    wx.stopPullDownRefresh();
  },
  // 上拉加载
  onReachBottom(){
    // if(this.data.hasMoremv){
      // const res = await getTopMV(this.data.topMvList.length);
      // this.setData({topMvList : this.data.topMvList.concat(res.data)});
      // this.data.hasMoremv = res.hasMore;
    // }
    this.getTopMVdata(this.data.topMvList.length);
  },


})