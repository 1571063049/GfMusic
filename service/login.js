import {gfLoginRequest} from './request'
export function getLoginCode(){
  return new Promise((resolve,reject) => {
    wx.login({
      timeout: 1000,
      success: (res)=> {
        const code = res.code;
        resolve(code)
      },
      fial: (err)=> {
        reject(err)
      }
    })
  })
}
export function codeToToken(code){
  return gfLoginRequest.post("/login",{code})
}

export function checkToken(token){
  return gfLoginRequest.post("/auth", {}, true)
}

export function postFavorMusicRequest(){
  return gfLoginRequest.post("/api/favor", {}, true)
}

export function checkSession(){
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail:()=>{
        resolve(false)
      }
    })
  })
}

export function getUserInfo(){
  return new Promise((resolve,reject) => {
    wx.getUserProfile({
      desc: 'UersInfo',
      success: (res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject
      }
    })
  })
}