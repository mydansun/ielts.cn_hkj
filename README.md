# ielts.cn_hkj

可以在 https://ielts.neea.cn/ 自动刷新可用考位信息。

1. 支持普通考试和签证类考试两种类型。
2. 支持同时查询多个城市和日期。
3. 开源&安全，无需你的用户名和密码。

## 使用方法

在现代浏览器手动新建一个书签，随便写个名字，网址中**粘贴**下面的代码，然后保存。

```javascript
javascript:(function (r) {
    !!r ? r() : (function (d) {
        s = d.createElement('script');
        s.setAttribute('src', 'https://cdn.jsdelivr.net/gh/mydansun/ielts.cn_hkj/dist/ielts.min.js?v=' + Date.parse(new Date()));
        s.setAttribute('charset', 'utf-8');
        d.getElementsByTagName('head')[0].appendChild(s)
    })(document)
})(window.onlyke)
```

![iShot_2023-04-01_19.14.28.jpg](https://s2.loli.net/2023/04/02/8G9uIwDsU5qV2H3.jpg)

然后正常登录雅思报名网站，在个人中心页面点击你刚才添加的书签即可。

![iShot_2023-04-01_19.09.41.jpg](https://s2.loli.net/2023/04/02/mjxus1GidlSZpTV.jpg)
