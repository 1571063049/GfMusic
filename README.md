# 音乐小程序

##  qqMusic 小程序

### 使用技术
- #### 原生微信小程序开发、vant、gf-event-store

### 项目经过分包以及其他优化的包大小

![image](https://user-images.githubusercontent.com/84273837/187820987-787f94e3-9e42-4875-9ebf-83a508a09790.png)
![image](https://user-images.githubusercontent.com/84273837/187819056-c991fa8e-df58-4413-9557-4f5446011be8.png)

### 项目主界面展示

![image](https://user-images.githubusercontent.com/84273837/187819219-70d8c86d-901a-4169-9388-5ae9d3b45a19.png)

#### 歌曲推荐、热门歌单、推荐歌单

![image](https://user-images.githubusercontent.com/84273837/187821055-73d9b6c5-9114-4044-9bc4-8f46d7c75cec.png) 

#### 新歌、原创、飙升 歌单

![image](https://user-images.githubusercontent.com/84273837/187821093-5cbb7393-216b-45cc-b908-e9129948de4e.png)

#### 歌曲播放

![image](https://user-images.githubusercontent.com/84273837/187821061-be1e1c25-1def-4b9c-948a-d29ee495f419.png)

#### 歌曲播放歌词

![image](https://user-images.githubusercontent.com/84273837/187821143-b8a87956-46bb-41c6-a117-be970ff1d32e.png)

### 搜索界面

![image](https://user-images.githubusercontent.com/84273837/187822770-49f2d92a-23eb-4480-bea1-d060bf408fe0.png)


### 项目mv界面展示

![image](https://user-images.githubusercontent.com/84273837/187819226-99261cee-6cf0-4d77-b98b-52f79593d60e.png)

### 构建

#### 1.采用清晰的目录文件和简洁页面结构进行整体布局
- baseurl 是任何项目都可以使用到的组件
- components 存放的是当前项目用到的公共组件

![image](https://user-images.githubusercontent.com/84273837/187816341-fb86443d-5a91-457f-b4bf-8af1cdebb919.png)

#### 2.使用了大量的组件封装进行代码的优化


#### 3.项目进行了机型的适配和封装了一些全局的工具函数


**获取不同的手机的宽度、高度、头部高度、机型的宽高比例 ———— 适配机型方便布局**

```js
 const contentHeight = screenHeight - navBarHeight - statusBarHeight
```

解决头部状态栏(包含时间、电量等)高度，不同的机型高度不一致;
**轮播图高度进行适配:**

- 采用图片进行宽度不变width:100%，高度自适应，正常没问题，但是图片的高度会根据不同的机型的宽度而变化,同时微信小程序swiper-item默认有一个高度150px，就会导致图片高度和swiper-item高度不一致，以至于布局混乱

  解决方案:

  - 功底图片高度和宽度，但是却不能自适应，甚至会影响整体布局
  - 通过动态获取节点高度————动态获取图片的高度，将swiper-item的高度设置成图片加载时的高度,
  - 通过wx.createSelectorQuery()可以获取到在不同机型下图片的宽度，而图片的高度又是根据宽度自适应，就完美解决了

- 图片高度下面默认会有3px像素小间隙，通过在swiper-item(父盒子) 中设置 display:flex

**防抖、节流、日期格式化以及数量格式化函数、strinToNodes函数、歌词解析函数....**

富文本转化函数: strinToNodes函数

```JS
strinToNodes(字符串变成nodes对象)————富文本
如图所示: 微信小程序给我们提供了一个组件。<rich-text>富文本组件，里面就有nodes属性，值是一个数组
const node = {
    name: "span",
    attrs: {
        style: "color : #26d7a2 ; font-size : 32rpx; font-weight:600",
    },
    children: [
        {
            type: "text",
            text: key1,
        },
    ],
    const nodes = push(node)
    const nodes = push(othernode)
```

  	通过遍历输入的文字(字符串)将其转换成如上格式，匹配到的文字展示 #26d7a2 ; font-size : 32rpx; font-weight:600" 样式
  	没有匹配到的可以显示默认，也可是设置自定义，也是如上，只不过加入同一个数组中，因为富文本nodes的值是一个数组，里面放入不同匹配到的对象

};

#### 4.实现了歌词同步滚动,滑动进度条播放歌曲,模糊搜索,富文本等音乐基本功能

- **歌词同步:**

  - 对后台返回的歌词数据进行解析，变成一个数组，通过微信小程序提供的 onTimeUpdate 来监听 时间的变化		来获取当前的歌词以及当前的索引		

  - 通过页面进行滚动 style="transform: translateY({{ - currentIndex * 52}}rpx)" 
    	根据当期歌词的索引 来决定显示当前歌词 甚至根据当前的索引设置样式			
  

- **滑动进度条播放歌曲:**

  - 监听滑动条——改变事件handleSliderChange以及滑动条——滑动事件handleSliderChanging

    - 如果是滑动条——改变事件handleSliderChange:
      			1.先获取滑动条的事件返回的value值，根据value来获取歌词跳转之后播放的时间 const currentTime = this.data.durationTime * value / 100;(s)
      			2.暂停播放audioContext.pause()
      			3.通过audioContext内置的seek方法进行指定播放歌曲时间audioContext.seek(currentTime / 1000)(ms)
      			2.记录最新的sliderValue值，this.setData({sliderValue : value , isSlidering : false})
      			5.记录当前歌词的时间，并修改currentTime
      		如果是滑动条——滑动事件handleSliderChanging：
      			1.先获取滑动条的事件返回的value值，根据value来获取歌词获取跳转之后的播放的时间 const currentTime = this.data.durationTime * value / 100;(s)
      			2.将isSlidering的值设置为true,并根据slider变化的值来改变currentTime的值，slider变化会触发上面handleSliderChange方法
      			3.保存当前时间this.setData({currentTime , isSlidering : true })
            
- **搜索富文本:**

![image](https://user-images.githubusercontent.com/84273837/187818112-0b4bec0c-23c3-4335-b905-554214e5421a.png)

- #### 结合strinToNodes函数实现

官方关于富文本的nodes的属性介绍

![image](https://user-images.githubusercontent.com/84273837/187817882-63783c4d-9f7a-4fe2-9525-b0d4827a290e.png)

富文本nodes工具函数封装

![image](https://user-images.githubusercontent.com/84273837/187817812-356a4507-e0dc-480b-80eb-bcf24dd28c18.png)

官方富文本文档: https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html

- ##### 模糊搜索: 采用首字母拼音即可搜索到数据，而不需完整字段

#### 5.对axios请求采用class对请求进行二次封装

![image](https://user-images.githubusercontent.com/84273837/187818399-1cfc39ef-abb9-4a24-8a99-4603a6dc78a5.png)


#### 6.使用自己编写的gf-event-store轻量级状态管理库作为该项目的全局状态管理方案

- 通过监听事件和派发事件 实现消息传递

- 采用发布者+订阅者  +  结合数据劫持实现 数据响应式	

- 两个结合实现 全局状态管理

gf-event-store 

#### 7.最后对项目进行分包处理来优化项目

- 分包就是一种对于项目的优化，对于首屏加载的优化，让用户在启动小程序时加载主包，也就是tabBar页面的文件，其他暂时不需要的文件暂时不下载	
- 预加载也是对于项目的优化，优化页面的跳转加载

![image](https://user-images.githubusercontent.com/84273837/187817325-4ddbf576-5ac0-4a40-adf4-1f01bd55147a.png)
![image](https://user-images.githubusercontent.com/84273837/187817490-318b0802-969a-4a9d-a978-7c9798873791.png)

分包以及代码优化后大小如下

![image](https://user-images.githubusercontent.com/84273837/187819056-c991fa8e-df58-4413-9557-4f5446011be8.png)


官方地址: https://developers.weixin.qq.com/miniprogram/dev/framework/
