// 正则表达式(字符串匹配利器) 截取字符串 tilePattern
const timeRegExp = /\[(\d{2}):(\d{2}).(\d{2,3})\]/

export function parseLyric(lyricStrings) {
  const lyrics = [];
  const lineStrings = lyricStrings.split('\n');  //以'\n'为分界线
  for(const lineString of lineStrings){
    const timeResult = timeRegExp.exec(lineString);  //exec()找到匹配的文本，返回一个数组
    if(!lineString) continue
    // 获取时间
    const minute = timeResult[1] * 60 * 1000;
    const second = timeResult[2] * 1000; 
    const millsecond = timeResult[3];//有两位，也有三位
    const millsecondTime = timeResult[3];
    millsecond = millsecondTime.length === 2 ? millsecondTime * 10 :  millsecondTime * 1
    const time = minute + second + millsecond; 
    // 获取文本
    // const text = lineString.replace(timeResult[0],"");  //将[03:54.125] 替换 “"
    const text = lineString.replace(timeRegExp,""); //replace 接收两个参数（string,正则表达式）
    const lyricItem = {time , text}
    lyrics.push(lyricItem);
  }
  return lyrics
}