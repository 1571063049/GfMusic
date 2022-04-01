import gfRequest from './request'
export function getMusicPlayerdata(ids) {
  return gfRequest.get('/song/detail',{
    ids
  })
}

export function getMusicLyricdata(id){
  return gfRequest.get('/lyric',{
    id
  })
}