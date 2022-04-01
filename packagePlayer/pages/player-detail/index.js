// pages/player-detail/index.js
import {audioContext , playerStore} from '../../../store/index'

const  playModesName = ["order","repeat","random"]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',

    currentSong:{},
    durationTime:0,
    musicLyrics:[],

    currentTime:0,
    currentLyric:"",
    currentIndex:0,

    isPlaying:true,
    playModeName:'order',
    playModesIndex:0,
    playingName:'pause',

    contentHeight:0,
    currentPage:0,
    sliderValue:0,
    lyricisShow:true,
    isSlidering:false,
    lyricScrollTop:0,

  },


  onLoad: function (options) {
    // 1.获取id
    let id = options.id;
    this.setData({id});

    // 2.根据id动态获取数据
    // this.getPageData(id);
    // 监听hy-event-store来获取数据
    this.setupPlayerStoreListener();
   
    playerStore.dispatch("playMusicDataSongIdAction",{id})

    // 3.动态获取内容高度
    const global = getApp().globalData;
    const screenHeight = global.screenHeight;
    const navBarHeight = global.navBarHeight;
    const statusBarHeight = global.statusBarHeight;
    const contentHeight = screenHeight - navBarHeight - statusBarHeight;
    const typeAspectRatio = global.typeAspectRatio;
    this.setData({lyricisShow : typeAspectRatio >= 2 ? true : false , contentHeight})

  },
  // ============================事件处理=============================
  // 滑动swiper
  handleSwiperSlider:function(event){
    const current  = event.detail.current
    this.setData({currentPage : current})
  },
  // 点击slider
  handleSliderChange:function(event){
    // 1.获取slider变化的值
    const value = event.detail.value;
    // 2.根据slider变化的值获取歌曲播放位置的时间
    const currentTime = this.data.durationTime * value / 100;

    //3.通过audioContext.seek()来响应歌曲播放的位置，单位为s
    // audioContext.pause(); // 跳动之前将播放的歌曲进行暂停，以免播放跳动
    if(this.data.isPlaying){
      audioContext.seek(currentTime / 1000);
    }

    //4.记录最新的sliderValue的值
    this.setData({sliderValue : value , isSlidering : false})

    // 记录滑动最新的currentTime的值
    this.setData({currentTime : currentTime})
  },
  // 滑动slider
  handleSliderChanging:function(event){
    // 1.获取slider滑动时刻的值
    const value = event.detail.value;
    
    // 2.将isSlidering的值设置为true,并根据slider变化的值来改变currentTime的值
    const currentTime = this.data.durationTime * value / 100;
    this.setData({currentTime , isSlidering : true })
  },
  // 切换播放模式
  handleSwitchModes:function(){
    // 计算最新playModesIndex
    let playModesIndex = this.data.playModesIndex + 1;
    if(playModesIndex === 3) playModesIndex = 0;

    // 设置playerStore中的playModeIndex
    playerStore.setState("playModesIndex",playModesIndex)
  },
  // 播放上一首普歌曲
  handlePrevSongPlay:function(){
    playerStore.dispatch("AudioContextPlayModesListenerAction",false)
  },
  // 播放下一首普歌曲
  handleNextSongPlay:function(){
    playerStore.dispatch("AudioContextPlayModesListenerAction")
  },
  // 歌曲的播放与暂停
  handleisPlaying:function(){
    playerStore.dispatch("AudioContextIsPlayListenerAction" , {
      currentTime :this.data.currentTime,
      isPlaying : !this.data.isPlaying
    })
  },
  // 返回上一个页面
  NavigationBack:function(){
    wx.navigateBack()
  },
  // ============================数据监听=============================
  setupPlayerStoreListener:function(){
    // 1.监听currentSong/durationTime/musicLyrics的变化
    playerStore.onStates(["currentSong","durationTime","musicLyrics"],({  
      currentSong,
      durationTime,
      musicLyrics
    }) => {
      if(currentSong !== undefined) this.setData({currentSong})
      if(durationTime !== undefined) this.setData({durationTime})
      if(musicLyrics !== undefined) this.setData({musicLyrics})
    })
    // 2.监听currentTime/currentLyric/currentIndex的变化
    playerStore.onStates(["currentTime","currentLyric","currentIndex"],({
      currentTime,
      currentLyric,
      currentIndex
    }) => {
      // 时间变化
      if(currentTime && !this.data.isSlidering) {
        const sliderValue =  audioContext.currentTime / audioContext.duration * 100
        this.setData({currentTime , sliderValue})
      }
      // 歌词变化
      if(currentLyric) this.setData({currentLyric})
      if(currentIndex){
        const lyricScrollTop =  - currentIndex * 70
        this.setData({currentIndex , lyricScrollTop })
      }
    }
    )
    // 3。监听播放模式相关的数据
    playerStore.onStates(["isPlaying","playModesIndex"], ({
      isPlaying, 
      playModesIndex
    }) =>{
      if(isPlaying !== undefined) this.setData({
        isPlaying, 
        playingName: isPlaying ? 'pause' : 'resume'})
      if(playModesIndex !== undefined) {
        this.setData({playModesIndex , playModeName : playModesName[playModesIndex]})
      }
    })
  },
  onUnload: function () {
    
  },

})