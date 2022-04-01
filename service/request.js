import {TOKEN_KEY} from '../constants/token_key-const'
const  token = wx.getStorageSync(TOKEN_KEY);

const BASE_URL = 'http://123.207.32.32:9001';
//不用部署
const LOGIN_BASE_URL = "http://123.207.32.32:3000";

// 用老师给的服务器的代码，自己部署
// const LOGIN_BASE_URL = "http://localhost:3000";
class GFrequest{
  constructor(baseURL , authHeader = {}){
    this.baseURL = baseURL;
    this.authHeader = authHeader;
  }
  request(url,method,params,isAuth = false , header = {}){
    const finalHeader = isAuth ? {...this.authHeader , ...header} : header
    return new Promise((reslove,reject)=>{
      wx.request({
        url:this.baseURL + url,
        method,
        data:params,
        header:finalHeader,
        success:(res) => reslove(res.data),
        fail:reject
      })
    })
  }
  post(url,params,isAuth = false,header){
    return this.request(url,'POST',params,isAuth,header)
  }
  get(url,params,isAuth = false,header){
    return this.request(url,'GET',params,isAuth,header)
  }
}
const gfRequest = new GFrequest(BASE_URL);
const gfLoginRequest = new GFrequest(LOGIN_BASE_URL , {token});

export default gfRequest
export {
  gfLoginRequest
}