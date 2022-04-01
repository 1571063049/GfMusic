import gfRequest from './request'
export function getHotSearch(){
  return gfRequest.get('/search/hot')
}

export function getSuggestSearch(keywords){
  return gfRequest.get('/search/suggest',{
    keywords,
    type:"mobile"
  })
}

export function getSearchResult(value,offset = 0){
  return gfRequest.get('/search',{
    keywords:value,
    offset
  })

}