# ielts.cn_hkj
可以在 https://ielts.neea.cn/ 实现雅思自动刷考位

更多介绍：http://mydansun.github.io/ielts.cn_hkj/

1. 可以监视普通考试和签证类考试两种类型
2. 最多支持一次监视当前所有可用城市和月份（雅思页面最多只能查询两个，并且普通用户使用F5刷新是没有用的）
3. 没有考位的场次可以点击提醒，后台将不断自动刷新，在有考位后会给予用户桌面提示和音乐提醒，然后你就可以报名啦
4. 使用安全，不用输入你的用户和密码

## 使用方法
在Chrome手动新建一个书签，随便写个名字，地址栏中粘贴下面的代码。
```javascript
javascript:(function(r){!!r?r():(function(d){s=d.createElement('script');s.setAttribute('src','https://raw.githubusercontent.com/mydansun/ielts.cn_hkj/master/ielts.js?v='+Date.parse(new Date()));s.setAttribute('charset','utf-8');d.getElementsByTagName('head')[0].appendChild(s)})(document)})(window.onlyke)
```
