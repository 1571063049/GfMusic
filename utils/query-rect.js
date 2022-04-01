export default function(select){
  return new Promise((resolve)=>{
    const query = wx.createSelectorQuery();
    query.select(select).boundingClientRect();
    query.exec(resolve);
    // query.exec((res) => {
    //   resolve(res)
    // })
  })
} 