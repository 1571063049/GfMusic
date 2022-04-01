import  gfRequest from './request';
// mv排行
export function getTopMV(offset,limit = 10){
  return gfRequest.get('/top/mv',{
    offset,
    limit
  })
}

// mv详情
export function getMvDetail(id){
  return gfRequest.get('/mv/detail',{
    mvid:id
  })
}
// mv播放地址
export function getMvAddress(id){
  return gfRequest.get('/mv/url',{
    id
  })
}

// mv相关视频
export function getMvRelated(id){
  return gfRequest.get('/related/allvideo',{
    id
  })
}