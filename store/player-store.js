import { HYEventStore } from "hy-event-store"
import {getMusicPlayerdata , getMusicLyricdata} from '../service/player'
import {parseLyric} from '../utils/parsing-lyrics'

// const audioContext = wx.createInnerAudioContext() //audioContext
const audioContext = wx.getBackgroundAudioManager(); 

const playerStore = new HYEventStore({
  state:{
    id:0,
    isFirstPlay:true,
    isStoping:false,

    currentSong:{},
    durationTime:0,
    musicLyrics:[],

    isPlaying:false,
    playModesIndex:0, //0循环播放  1单曲循环  2.随机播放

    currentTime:0,
    currentLyric:"",
    currentIndex:0,

    currentSongList:[],
    currentSongIndex:0
  },  
  actions:{
    // isRefresh 单曲循环切换时，强制刷新，默认不刷新
    playMusicDataSongIdAction(ctx,{id , isRefresh = false}){
      // 判断播放的是否为同一首歌曲，如果是则继续播放，如果不是，则播放
      if(ctx.id == id && !isRefresh){
        this.dispatch("AudioContextIsPlayListenerAction" , {isPlaying : true})
        return
      }
      
     

      ctx.id = id
      //0.设置初始的播放状态
      ctx.isPlaying = true;
      ctx.currentSong = {};
      ctx.durationTime = 0; 
      ctx.musicLyrics = [];
      ctx.currentTime = 0;
      ctx.currentLyric = "";
      ctx.currentIndex = 0;
      
      // 1.根据id请求数据
      // 请i去歌曲详情
      getMusicPlayerdata(id).then(res => {
        const currentSong = res.songs[0]
        ctx.currentSong = currentSong;
        ctx.durationTime = currentSong.dt
        audioContext.title = currentSong.name;
      })
      // 请求歌词详情
      getMusicLyricdata(id).then(res => {
        const lyricString = res.lrc.lyric;
        const musicLyrics = parseLyric(lyricString);
        ctx.musicLyrics = musicLyrics;
      })

      //2.播放对应id的歌曲
      audioContext.stop(); 
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.title = id;
      audioContext.autoplay = true;
      

      // 监听audioContext的一些事件
      // 是否是第一次播放，如果不是，则不需要再给audioContext添加监听事件
      if(ctx.isFirstPlay){
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false;
      }
    },

    setupAudioContextListenerAction(ctx){
      // 1.监听歌曲能否播放
      audioContext.onCanplay(()=>{
        audioContext.play();
      });

      //2.监听歌曲事件改变
      audioContext.onTimeUpdate(()=>{
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000;
        ctx.currentTime = currentTime;
        // 3.根据时间去查找相应的歌词变化
        const musicLyrics = ctx.musicLyrics;
        let i = 0
        for(; i < musicLyrics.length; i++){
          if(currentTime < musicLyrics[i].time){
            break
          }                                                                                                             
        }
        // 设置当前的而索引以及歌词
        const currentIndex = i -1;
        if(currentIndex < 0) return  //无歌词
        if(ctx.currentIndex != currentIndex){
          const currentLyric = musicLyrics[i-1].text;
          ctx.currentLyric = currentLyric;
          ctx.currentIndex = currentIndex
        }   
      })

      //3.监听歌曲是否播放完
      audioContext.onEnded(()=>{
        this.dispatch("AudioContextPlayModesListenerAction")
      });

      // 监听歌曲的播放与暂停以及结束
      // 播放
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      });
      // 暂停
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      // 结束
      // 一旦发生了onStop()事件(即点击右侧按钮关闭)，则会清空audioContext中的src以及title等等
      audioContext.onStop(() => {
        ctx.isPlaying = false;
        ctx.isStoping = true;
      })
    },

    // currentTime 是否传入当前播放的时间(一般为暂停滑动时，滑动播放进度条，点开播放时需要传入)，默认为undefined
    //  isPlaying传入当前释放播放的状态，一般传入（! +  boolean）,默认播放
    AudioContextIsPlayListenerAction(ctx , {currentTime = -1, isPlaying = true}){
      //1.监听歌曲的是否播放
      ctx.isPlaying = isPlaying
      // 如果正在播放且结束歌曲，让歌曲重新播放    
      if (ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name;
      }
      if(ctx.isPlaying){
        if(currentTime != -1){
          audioContext.seek(currentTime / 1000) 
        }else{
          audioContext.play()
        }
      }else{
        audioContext.pause()
      }
      
    },

    AudioContextPlayModesListenerAction(ctx , isNext = true){
      // playModesIndex:0, //0循环播放  1单曲循环  2.随机播放

      // 1.获取歌曲当前索引
      let index = ctx.currentSongIndex;

      // 2.根据歌曲播放的模式以索引获取下一首歌曲
      switch(ctx.playModesIndex){
        //0循环播放
        case 0:
          // index = isNext ? index + 1 : index -1
          if(isNext)index++
          else index --;
          if(index === -1) index = ctx.currentSongList.length - 1;
          if(index === ctx.currentSongList.length) index =  0;
          break;
        //1单曲循环
        case 1:
          break;
          // 2.随机播放
        case 2:
          let randomIndex = Math.floor(Math.random() * ctx.currentSongList.length)
            while(randomIndex != index){
              index = randomIndex
              break;
            };
          break;
      }
      // 3.获取最新的歌曲以及索引
      let currentSong = ctx.currentSongList[index]
      if(!currentSong){
        currentSong = ctx.currentSong;
      }else{
        //记录最新的索引 
        ctx.currentSongIndex = index;
      }

      // 4播放新的歌曲
      this.dispatch("playMusicDataSongIdAction" , {id : currentSong.id , isRefresh : true })

    }
  }
});
export {
  audioContext,
  playerStore
}