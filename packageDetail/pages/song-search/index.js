// pages/song-search/index.js
import {getHotSearch , getSuggestSearch, getSearchResult} from '../../../service/search';
import debounce from '../../../utils/debounce'
import stringNodes from '../../../utils/stringTonodes'
const searchSuggestDebounce = debounce(getSuggestSearch,300)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:"",
    // currentType:1,
    hotList:[],
    suggestList:[],
    resultList:[],
    hasmore:true,
    suggestSongsNodes:[],
    historyList:[]
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotSearch();
    let historyList = wx.getStorageSync('history');
    this.setData({historyList})
  },


  // 网络请求
  getHotSearch:function () {
    // 默认热门搜索数据
    getHotSearch().then(res =>{
      this.setData({hotList : res.result.hots})
    })
  },
 
  // 事件处理
  // 输入内容时请求的搜索建议的结果数据
  handleToSuggestSearch:function(event){
    // 1.获取输入关键字
    let searchValue = event.detail;

    //2.保存关键字
    this.setData({searchValue})

    //3.判断关键字是否为空的逻辑
    if(!searchValue.length) {
      this.setData({suggestList : [] , resultList : []});
      searchSuggestDebounce.cancel();
      return
    }

    // 4.根据关键字获取数据
    searchSuggestDebounce(searchValue).then(res => {
      // 1.获取关键字搜索结果
      if(!res.result.allMatch) return
      const suggestList = res.result.allMatch;
      this.setData({suggestList});

      // 2.转成nodes节点
      const suggestKeywords = suggestList.map(item => item.keyword);
      const suggestSongsNodes = [];
      for(const keyword of suggestKeywords){
        const nodes = stringNodes(keyword , this.data.searchValue);
        suggestSongsNodes.push(nodes);
      }
      this.setData({suggestSongsNodes});
    })
  },

  // 搜索确定后请求的结果数据
  handleToSearchResult(event){
    // if(event.detail == "") this.setData({ currentType : 1})
    this.getResultHistory(event.detail);
  },
  // 点击获取搜索结果
  handleClickToResult(event){
    let keyword = event.currentTarget.dataset.keyword;
    this.getResultHistory(keyword);
    this.setData({ value : keyword});
  },
  // 搜索结果以及添加历史记录
  getResultHistory:function(keyword) {
    getSearchResult(keyword).then(res => {
      // this.setData({ currentType : 3})
      this.setData({searchValue: keyword})
      this.setData({ resultList : res.result.songs});
    });

    // 添加历史记录

    let historyList = this.data.historyList
    // console.log(historyList)
    historyList.unshift(keyword);
    historyList = [...new Set(historyList)];
    // 历史记录最多有10个，多余的替换掉最后一个
    if(historyList.length > 10){
      historyList.length === 10;
    }
    wx.setStorageSync('history', historyList);
    this.setData({historyList});
  },
  // 聚焦输入框
  handleFocusSearch(){
    // this.setData({ currentType : 0})
  },
  // 清除输入框
  handleClearSearch:function(){
    // this.setData({ currentType : 1})
  },
  // 清除本地存储
  hanldeDeleteStorage:function(){
    try {
      wx.removeStorageSync('history')
    } catch (err) {
      console.log(err);
    }
    this.setData({historyList : []})
  },

  // 上拉加载
  onReachBottom:function(){
    let length = this.data.resultList.length;
    if(this.data.hasmore){
      getSearchResult(this.data.value,length).then(res => {
        this.setData({ hasmore : res.result.hasMore})
        let songs = res.result.songs;
        let list = this.data.resultList;
        list = list.concat(songs);
        this.setData({resultList : list});
      })
    }
  }
})