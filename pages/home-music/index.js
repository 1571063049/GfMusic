// pages/home/index.js
// 导入全局状态管理
import { playerStore, rankingStore } from '../../store/index'

import {getBanner , getHotMenu } from '../../service/music';
import queryRect from '../../utils/query-rect';
import throttle from '../../utils/throttle';
const throttleQueryRect = throttle(queryRect,100,{trailing:true});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    swiperHeight:150,
    recommendSongList:[],
    hotMenuList:[],
    recommendMunuList:[],
    topList:{0:{}, 2:{}, 3:{}},
    currentSong: {},
    currentLyric:"",
    isPlaying:false,
    playState:"play",
    playAnimationState:'running'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求页面数据
    this.getPageData();
    // 发起共享数据的请求
    rankingStore.dispatch('getAllTopSongListdata');
    // 从store获取共享的数据
    rankingStore.onState("hotSongList",(res) => {
      // 调用该方法时，默认会传入全局state中recommendSongList的值，当它的值发生变化时，又会传入一次值
      if(!res.tracks) return 
      const recommendSongList = res.tracks.slice(0,6);
      this.setData({ recommendSongList}) 
    });
    rankingStore.onStates(["newSongList","originSongList","upSongList"],({
      newSongList,
      originSongList,
      upSongList
    })=>{
      if(newSongList) this.getNewTopListHandle(0,newSongList)
      if(originSongList) this.getNewTopListHandle(2,originSongList)
      if(upSongList) this.getNewTopListHandle(3,upSongList)
    });
    // 监听歌曲播放获取当前歌曲播放信息
    playerStore.onStates(["currentSong","currentLyric","isPlaying"] , ({
      currentSong,
      currentLyric,
      isPlaying
    }) => {
      if(currentSong) this.setData({currentSong})
      if(currentLyric) this.setData({currentLyric})
      if(isPlaying !== undefined) this.setData({
        isPlaying, 
        playState : isPlaying ? 'pause':'play',
        playAnimationState :  isPlaying ? 'running':'paused'
      })
    })
  },

  //=============================网络请求===========================
  getPageData(){
    // 请求轮播数据
    getBanner().then(res => {
        // setData在设置data的数据上,是同步的
        // s通过最新的数据对wxml进行渲染时，渲染的过程是异步的
        this.setData({ bannerList : res.banners})
      })

    // 请求热门歌单数据
    getHotMenu().then(res =>{
      this.setData({hotMenuList : res.playlists});
    });
    // 请求华语推荐歌单数据
    getHotMenu("华语").then(res =>{
      this.setData({recommendMunuList : res.playlists});
    });
  
  },
 

  // =============================事件处理===========================
  // 点击搜索框跳转
  handleToSearch:function(){
    wx.navigateTo({
      url: '/packageDetail/pages/song-search/index',
    })
  },

  //点击推荐歌曲头部更多跳转
  handlerecommendHeaderClick(){
    wx.navigateTo({
      url: '/packageDetail/pages/song-detail/index?type=song&idx=1',
    })
  },
  // 点击播放歌曲传入当前歌曲播放列表以及索引
  handleSongPlayerClick:function(event){
    const index = event.currentTarget.dataset.index;
    const list = this.data.recommendSongList
    playerStore.setState("currentSongIndex",index)
    playerStore.setState("currentSongList",list)
  },
 
  
  // =============================事件监听===========================
 // 图片加载动态获取图片高度
  handleSwiperImageLoaded:function(){
    throttleQueryRect('.swiper-img').then(res =>{
      const rect = res[0]
      this.setData({ swiperHeight: rect.height })
    })
  },
  // 共享数据监听获取topList数据
  getNewTopListHandle(idx , res){ 
    // return (res) => {
      // if(!res.tracks) return
      if(Object.keys(res).length === 0) return
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const  songList = res.tracks.slice(0,3)
      const toplistobj = {name , coverImgUrl , playCount , songList}
      const newtoplsit = {...this.data.topList,[idx]:toplistobj}
      this.setData({ topList : newtoplsit})
    // },
  },
  // play-bar播放歌曲
  handleMusicPlay:function(event){
    // 阻止事件传递(冒泡)
    // 方法一 (html中，小程序不支持)
    // Propagation   繁殖
    // event.stopPropagation()
    // 方法二
    // catchtap="handleMusicPlay"
    playerStore.dispatch("AudioContextIsPlayListenerAction",{isPlaying : !this.data.isPlaying});
  },
  handleToMusicPlayerDetail:function(){
    let id = this.data.currentSong.id;
    wx.navigateTo({
      url: '/packagePlayer/pages/player-detail/index?id='+id,
    })
  },

  //页面销毁 
  onUnload:function(){
    // rankingStore.offState("hotSongList",this.getNewTopListHandle);
  },
})
