# 多语言翻译插件，谷歌翻译api

[![Current Version](https://vsmarketplacebadge.apphb.com/version/leizl.translate.svg)](https://marketplace.visualstudio.com/items?itemName=leizl.translate)
[![Install Count](https://vsmarketplacebadge.apphb.com/installs/leizl.translate.svg)](https://marketplace.visualstudio.com/items?itemName=leizl.translate)
[![Open Issues](https://vsmarketplacebadge.apphb.com/rating/leizl.translate.svg)](https://marketplace.visualstudio.com/items?itemName=leizl.translate)

## Quick start

* Run your command from the command palette by pressing (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and typing `Translate`.

![](https://github.com/leizelong/translate/blob/master/media/action_0.gif?raw=true)

## 适用场景，多语言文件（ts、js、commonJs、json）
### json 文件
* 源文件

``` json
{
  "zh": {
    "title1": "亥下歌",
    "t1": "力拔山兮气盖世",
    "t2": "时不时兮骓不适",
    "t3": "骓不逝兮可奈何",
    "t4": "虞兮虞兮奈若何",
    "t5": "山有木兮木有枝，心悦君兮君不知",
    "t6": "沅有芷兮澧有兰,思公子兮未敢言"
  }
}
```
* 翻译后

``` json
{
  "zh": {
    "title1": "亥下歌",
    "t1": "力拔山兮气盖世",
    "t2": "时不时兮骓不适",
    "t3": "骓不逝兮可奈何",
    "t4": "虞兮虞兮奈若何",
    "t5": "山有木兮木有枝，心悦君兮君不知",
    "t6": "沅有芷兮澧有兰,思公子兮未敢言"
  },
  "en": {
    "title1": "Haixiage",
    "t1": "Reach out to the world",
    "t2": "Feel unwell from time to time",
    "t3": "It&#39;s not going to die",
    "t4": "Yu Xi Yu Xi Naruo He",
    "t5": "The mountains have trees and trees have branches, but the heart is happy and you don’t know",
    "t6": "Yuan has Zhixi, Li has orchids, but Young Master Si dare not say anything"
  }
}
```

### ts、js文件
* 源文件

``` javascript
export default {
  "zh": {
    "title1": "凤求凰",
    "t1": "有一美人兮，见之不忘。",
    "t2": "一日不见兮，思之如狂。",
    "t3": "凤飞翱翔兮，四海求凰。",
    "t4": "无奈佳人兮，不在东墙。"
  }
};
```
* 翻译后

``` javascript 
export default {
  "zh": {
    "title1": "凤求凰",
    "t1": "有一美人兮，见之不忘。",
    "t2": "一日不见兮，思之如狂。",
    "t3": "凤飞翱翔兮，四海求凰。",
    "t4": "无奈佳人兮，不在东墙。"
  },
  "en": {
    "title1": "Feng Qiuhuang",
    "t1": "There is a beauty, and I will never forget it.",
    "t2": "If you don&#39;t see Xi in a day, you think like crazy.",
    "t3": "Feng Fei soars, seeking phoenix from all corners of the world.",
    "t4": "Helpless beauty is not in the east wall."
  }
};
```

## Contribution
[https://github.com/leizelong/translate](https://github.com/leizelong/translate)

## Issues 欢迎大家提出改进意见。
[https://github.com/leizelong/translate/issues](https://github.com/leizelong/translate/issues)

