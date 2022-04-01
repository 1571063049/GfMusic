// pages/song-detail/index.js
import {getMenuCategory , getHotMenu} from '../../../service/music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SongManuList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求歌单列表menu-detail数据 
    getMenuCategory().then(res =>{
      const tags = res.tags;
      const SongManuList = [];
      const promises = [];
      for(const index of tags.keys()){
        const name = tags[index].name;
        SongManuList[index] = {name , list:[]}
        promises.push(getHotMenu(name));
      }
      Promise.all(promises).then( menuLists => {
        for(const index of menuLists.keys()){
          const playlists = menuLists[index].playlists
          SongManuList[index].list = playlists;
        }
        this.setData({SongManuList});
      })
    });
  },

  // 请求方法封装
  
})