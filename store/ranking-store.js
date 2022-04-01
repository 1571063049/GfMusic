import {HYEventStore} from 'hy-event-store';
import {getTopList} from '../service/music'

const AllsongListMap = { 0: "newSongList" , 1:"hotSongList" , 2:"originSongList" , 3:"upSongList"}
const rankingStore = new HYEventStore({
  state:{
    newSongList:{}, //新歌
    hotSongList:{}, //热门
    originSongList:{}, //原创
    upSongList:{}, //飙升
  },
  actions:{
    getAllTopSongListdata(context){
      // 0: 新歌榜 1: 热门榜 2: 原创榜 3: 飙升榜
      for(let i = 0; i < 4; i++){
        getTopList(i).then(res => {
          const songName = AllsongListMap[i]
          context[songName] = res.playlist
        })
      }
    }
  }
})
export {
  rankingStore,
  AllsongListMap
}