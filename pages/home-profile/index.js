// pages/home-profile/index.js
import {getUserInfo} from './../../service/login'
import {TOKEN_KEY} from '../../constants/token_key-const'
Page({

  
  data: {
    userInfo:{},
    isShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  handleGetUserProfile:async function () {
    const info = await getUserInfo()
    this.setData({userInfo:info.userInfo})
    this.setData({isShow : true})
  },

  handleGetUserPhoneNumber:function(event){
    console.log(event);
  }
})