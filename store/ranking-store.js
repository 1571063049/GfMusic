import {GFEventStore} from 'gf-event-store';
import {getTopList} from '../service/music'

const AllsongListMap = { 0: "newSongList" , 1:"hotSongList" , 2:"originSongList" , 3:"upSongList"}
const songListIdMap = [3779629,3778678,2884035,19723756]
const rankingStore = new GFEventStore({
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
        getTopList(songListIdMap[i]).then(res => {
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