// app.js
import {getLoginCode , codeToToken , checkToken , checkSession} from './service/login';
import {TOKEN_KEY} from './constants/token_key-const'
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    navBarHeight: 44,
    statusBarHeight:0,
    typeAspectRatio:0
  },
  onLaunch: function() {
    // 1.小程序初始化时获取平屏幕的宽度和高度（vh,vm）（设备信息）
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.typeAspectRatio = info.screenHeight / info.screenWidth;

    //2.让默认用户登录
    // 让同步（await）变成异步
    this.loginActionExpire();

    // 3.获取用户信息
    
  },
  loginActionExpire: async function(){
    const token = wx.getStorageSync(TOKEN_KEY);
    //  token有没有过期
    const isTokenExpire = await checkToken(token);
    console.log(isTokenExpire)
    const isSessionExpire = await checkSession();
    // 判断session_key有没有过期
    if(!token || isTokenExpire.errorCode || !isSessionExpire){
      this.loginAction();
    }
  },

  loginAction: async function () {
    // 获取code
    const code = await getLoginCode();
    
    // 发送code到服务器，获取token
    const result = await codeToToken(code);
    const token = result.token;
    wx.setStorageSync(TOKEN_KEY, token);
  }
})
