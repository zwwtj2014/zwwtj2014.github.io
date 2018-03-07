---
title: '【webpack】: 记一次jsbundle体积优化'
date: 2018-03-07 20:05:26
tags:
- webpack
- javascript
categories:
- webpack
keywords:
- webpack
- jsbundle体积优化
- library
- libraryTarget
- externals
description: 记录了一次利用`output.library & output.libraryTarget & externals`优化jsbundle体积的过程
---

## 背景
最近接到一个任务是帮忙优化jsbundle的体积，项目是用ts开发，多入口。在分析之后发现每个bundle都打了同一份代码(这份代码是其它组提供的ts，编译出来的js在3k左右)，而且是不经常变动的。

最初想到的就在打包的时候通过[`CommonChunkPlugin`](https://webpack.js.org/plugins/commons-chunk-plugin/)或者[`Dll & DllReference`](https://webpack.js.org/plugins/dll-plugin/)插件来把这块提取出来，代码拆分做成一个独立的js，但是这样有个问题：就是每次其他组把这块代码更新的时候需要在工程里再跑一遍打包构建的过程，这就涉及到一个组更新了代码需要另外的组打包构建，在某些场景下是不可接受的。

---

## 方案

在考虑了之后，决定将这部分公共的代码以**库**的方式提供出来，在提供给别人之后，打成单独的jsbundle，让别人在页面引。这就涉及到两次打bundle，那这两次打的bundle如何打通呢？

> **output.library + out.libraryTarget + externals的方式**

#### out.library & out.libraryTarget
**[library](https://webpack.js.org/configuration/output/#output-library): **配合libraryTarget使用。可以简单的看做这个库暴露给别人用的时候，关键词是啥。类比jQuery。
**[libraryTarget](https://webpack.js.org/configuration/output/#output-librarytarget): **配合如何去暴露library。支持下面几种:
- 通过var以变量的方式暴露出去。**默认配置**
 > ```
  { 
    library: 'clam'
  }
 > ```
 > 打出来的jsbundle就是 `var clam = /**_entry_return_*/;` 直接在页面引的话可能就直接挂window上了。

- 通过`assign`可以将return挂载到已经存在的某个变量上。

- 通过其它一些变量的方式暴露出去。可以配置`this`,`global`,`commonjs`,`window`,这些配置加上library，就可以把对应的库**挂载**到这些变量上。对应的就是:
 > `this`  => `this['clam'] = /**_entry_return_*/`
 `global` => `global['clam'] = /**_entry_return_*/`
 `window` => `window['clam'] = /**_entry_return_*/`
 `commonjs` => `exports['clam'] = /**_entry_return_*/`

通过上述两个配置就解决了打库文件的文件，**但是当时不想把太多的东西挂载到window上，就利用了assign的方式挂载在一个变量底下。**即：
>```js{
   library: `$VAR['clam']`,
   libraryTarget: `assign`
}```

---

#### externals
使用assign的方式只会，返回值会挂载在$VAR['clam']上，在打包的时候需要**建立起与这个"库"的连接**并且**排除这个bundle**就好。这个时候就该[externals](https://doc.webpack-china.org/configuration/externals/#object)出场了。

externals的配置主要就是为了解决上述说的两个问题：
 - 打的bundle里排除指定的库
 - 建立与这个库的"连接"

具体的配置可以看下[官方文档](https://doc.webpack-china.org/configuration/externals/)，不同的配置方式只是应对不同的场景，作用还是上面提到的两点。

比如我们利用`output.library & output.libraryTarget`发布的包名叫Lib，使用的方式是`import {xxx} from 'Lib';`其所有的实现都已经挂载了$VAR['clam'] 上，那我们可以像下面这样配置externals：
```js
externals:{
  'Lib': `$VAR['clam']`
}
```

这样生成的jsbundle里如下的方式：
```js
...
var xxx = webpack_require(`$VAR['clam']`);
...
```

---

## 总结

这篇记录主要记录了一次利用`output.library & output.libraryTarget & externals`来以库的方式将每个bundle的js减少3k还是不错的。

具体怎么打一个库可以看看[创建Library](https://doc.webpack-china.org/guides/author-libraries)文档。不同的配置可以将你的库打成一个**commonjs库**，**es2015库**甚至是一个**UMD库**。