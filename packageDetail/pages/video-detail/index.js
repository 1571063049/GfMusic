// pages/video-detail/index.js
import {getMvDetail , getMvAddress , getMvRelated} from '../../../service/video'
import {audioContext} from '../../../store/player-store'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MvDetail:{},
    MvAddress:{},
    MvRelated:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMvDetaildata(options.id);
    audioContext.pause(()=>{
      
    });
  },

  // 封装请求的方法
  getMvDetaildata(id){
      // 获取mv详情
    getMvDetail(id).then(res => {
      this.setData({ MvDetail : res.data})
    });

    // 获取mv播放地址
    getMvAddress(id).then(res => {
      this.setData({ MvAddress : res.data})
    });
    
    // 获取相关视频
    getMvRelated(id).then(res => {
      this.setData({ MvRelated : res.data})
    });
   
  },
  
  
})