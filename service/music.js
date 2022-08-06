import gfRequest from './request';
// 轮播
export function getBanner(){
  return gfRequest.get('/banner',{
    type:2
  })
}

/**
 * 获取榜单 0 飙升 1 热门 2 新歌 3 原创
 * @param {} idx  0->飙升榜[0~6]为歌曲推荐
 */
// 各种榜单（0 飙升 1 热门 2 新歌 3 原创）
export function getTopList(id){
  return gfRequest.get('/playlist/detail',{
    id
  })
}

/**
 * 请求歌单数据
 * @param {*} cat 类别
 * @param {*} limit 个数
 */
// 热门榜单
export function getHotMenu(cat = "全部",limit = 6){
  return gfRequest.get('/top/playlist',{
    cat,
    limit
  })
}

// 请求个人歌曲数据
export function getMoreSong(){
  return gfRequest.get('/personalized')
}


/**
 *4. 热门歌单分类
 * 说明 : 调用此接口,可获取歌单分类,包含 category 信息
 */
export function getMenuCategory(){
  return gfRequest.get('/playlist/hot')
}


/**
 * 说明 : 调用后可获取歌单详情动态部分,如评论数,是否收藏,播放数
 * 必选参数 id
 */
export function getSongdetail(id){
  return gfRequest.get("/playlist/detail",{
    id
  })
}
