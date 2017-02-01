
CommonJS 和 AMD 是用于 JavaScript 模块管理的两大规范，前者定义的是模块的同步加载，主要用于 NodeJS ；而后者则是异步加载，通过 RequireJS 等工具适用于前端。随着 npm 成为主流的 JavaScript 组件发布平台，越来越多的前端项目也依赖于 npm 上的项目，或者自身就会发布到 npm 平台。因此，让前端项目更方便的使用 npm 上的资源成为一大需求。

web 开发中常用到的静态资源主要有 JavaScript、CSS、图片、Jade 等文件，webpack 中将静态资源文件称之为模块。 webpack 是一个 module bundler (模块打包工具)，其可以兼容多种 js 书写规范，且可以处理模块间的依赖关系，具有更强大的 js 模块化的功能。Webpack 对它们进行统一的管理以及打包发布，其官方主页用下面这张图来说明 Webpack 的作用.

## webpack 介绍

webpack 更 Gulp 的作用相同，是项目构建工具。

### webpack 和 Gulp 的区别

> Gulp 出现的比较早，更适合于做任务型的，可以处理任何的网站静态网站、SPA、Node.js 项目代码，Gulp 里面就是一堆的任务；
> Webpack 一般全部用来处理 SPA 应用，就 React、Vue.js、AngularJS 使用。

所以使用的场景不一样，因为内部的原理不同。

### webpack 官网文档

官网地址：http://webpack.github.io/docs/

### webpack 的优势

> 对 CommonJS 、 AMD 、ES6 的语法做了兼容
> 对 js、css、图片等资源文件都支持打包
> 串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如提供对 CoffeeScript、ES6的支持
> 有独立的配置文件 webpack.config.js
> 可以将代码切割成不同的 chunk，实现按需加载，降低了初始化时间
> 支持 SourceUrls 和 SourceMaps，易于调试
> 具有强大的 Plugin 接口，大多是内部插件，使用起来比较灵活
> webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快

## webpack 的使用

新建项目

在项目根目录下运行：

``` bash
    $ npm init -y
```

src 中的开发文件，dist 是打包后的文件

### 安装

``` bash
    $ npm install webpack -g
    $ npm install webpack -save-dev
    $ npm install react -save
```

### 配置文件

> webpack.develop.config.js

``` js
    // webpack 的开发配置文件
    // 编写配置文件，要有最基本的文件入口和输出文件配置信息等
    // 里面还可以加loader和各种插件配置使用
    var path = require('path');
    module.exports = {
        // 单页面 SPA 的入口文件
        entry:path.resolve(__dirname,'src/js/app.js'),
        // 构建之后的文件输出位置配置
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        }
    };
```

### 运行

``` bash
  $ webpack --config webpack.develop.config.js
```

### 进行版本控制

``` bash
  $ git init
  $ git status
  $ git add -A
  $ git commit -m "项目目录结构及 webpack 初步配置"
```

---

## webpack 启动过程演进

把运行命令配置到 npm 的 script 中。  package.json

``` js
  "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "develop": "webpack --config webpack.develop.config.js",
      "publish": "webpack --config webpack.publish.config.js"
  }
```

执行 ：

``` bash
  $ npm run develop
```

### 更好的方式实现动启动

如果需要一直输入 npm run develop 确实是一件非常无聊的事情，我们可以把让他安静的运行，让我们设置 webpack-dev-server

除了提供模块打包功能，Webpack 还提供了一个基于 Node.js Express 框架的开发服务器，它是一个静态资源 Web 服务器，对于简单静态页面或者仅依赖于独立服务的前端页面，都可以直接使用这个开发服务器进行开 发。在开发过程中，开发服务器会监听每一个文件的变化，进行实时打包，并且可以推送通知前端页面代码发生了变化，从而可以实现页面的自动刷新。

更好的方式实现自动启动：webpack 官方提供的一个第三个的插件，自动监听代码变化，帮我们重新构建，把 webpack 和 express 封装了

``` bash
  $ npm install webpack-dev-server -save-dev
```

调整 npm 的 package.json scripts 部分中开发命令的配置

``` js
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "develop": "webpack-dev-server --config webpack.develop.config.js --devtool eval --progress --colors --hot --content-base src",
    "publish": "webpack --config webpack.publish.config.js"
  }
```

> webpack-dev-server - 在 localhost:8080 建立一个 Web 服务器
> --devtool eval - 为你的代码创建源地址。当有任何报错的时候可以让你更加精确地定位到文件和行号
> --progress - 显示合并代码进度
> --colors -- hot，命令行中显示颜色！
> --content-base  指向设置的输出目录//这点一定是我们的发布目录

在 src 下面，新建一个 index.html 文件，

``` html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>webpack 使用</title>
  </head>
  <body>
      <div id="app"></div>
  </body>
  <script src="bundle.js"></script>
  </html>
```

执行 `npm run develop` 之后我们发现执行没有结束，启动着监听，并在 8080 端口开启了一个服务器。

如果修改了 app.js 文件，会自动执行构建，刷新浏览器会发生变化。

**在 index.html 访问的时候，会访问  bundle.js 文件，为什么，因为 webpack-dev-server 生成的 bundle 在内存中，放到内存中构建快**

总的来说，当你运行 npm run develop 的时候，会启动一个 Web 服务器，然后监听文件修改，然后自动重新合并你的代码。真的非常简洁！

注意:

> 用 webpack-dev-server 生成 bundle.js 文件是在内存中的，并没有实际生成
> 如果引用的文件夹中已经有 bundle.js 就不会自动刷新了，你需要先把 bundle.js 文件手动删除
> 用 webstorm 需要注意，因为他是自动保存的，所以可能识别的比较慢，你需要手动的 ctrl+s 一下

### 浏览器自动刷新

修改 webpack.develop.config.js 的入口文件配置，修改 entry 部分如下：

``` js
    var path = require('path');
    module.exports = {
        // 单页面 SPA 的入口文件
        entry:[
            // 实现浏览器自动刷新
            'webpack/hot/dev-server',
            'webpack-dev-server/client?http://localhost:8080',
            path.resolve(__dirname,'src/js/app.js')
        ],
        // 构建之后的文件输出位置配置
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        }
    };
```

修改了配置文件，重新启动，执行 `npm run develop` .

---

## 常用加载器

Loader：这是webpack准备的一些预处理工具

在构建项目之前做一些预处理操作，比如 ES6 转 ES5，Sass、Less

### 编译 JSX 和 ES6 到 ES5 语法的加载器

安装：

``` bash
  $ npm install babel-loader --save-dev
  $ npm install babel-core babel-preset-es2015 babel-preset-react --save-dev
```

babel-loader: 转换器，编译 JSX 语法和 ES6 语法到 ES5 语法。

修改开发配置环境: webpack.develop.config.js

``` js
    module: {
        loaders: [
            {
                test: /\.jsx?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
                loader: 'babel', // 加载模块 "babel" 是 "babel-loader" 的缩写
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
```

一个 React Hello, World! app.js 文件

```
    // 项目入口文件
    import React, {Component} from 'react';
    import ReactDOM from 'react-dom';
    ReactDOM.render(
        <div>
            Hello World!
        </div>,
        document.getElementById('app')
    );
```

### 加载 CSS

webpack 允许像加载任何代码一样加载 CSS。可以选择需要的方式，但是可以为每个组件把所有的 CSS 加载到入口主文件中来做任何事情。

加载 CSS 需要 css-loader 和 style-loader，他们做两件不同的事情:

> css-loader 会遍历 CSS 文件，然后找到 url() 表达式然后处理他们
> style-loader 会把原来的 CSS 代码插入页面中的一个 style 标签中

#### 安装

``` bash
  $ npm install css-loader style-loader --save-dev
```

新建文件夹：components

新增：_base.css Hello.css Hello.js  Hello.sass 文件

#### 修改配置文件：

``` js
  // 可以在 js 中引用 css 的加载器
  {
      test: /\.css$/,
      loader: 'style!css' // 如果同时使用多个加载器，中间用 ! 连接，加载器的执行顺序是从右向左
  }
```

！用来定义loader的串联关系，"-loader"是可以省略不写的，多个loader之间用“!”连接起来

#### Css加载策略

1、在主入口文件中，比如 src/app.js 你可以为整个项目加载所有的 CSS

``` js
  import  './project-styles.css';
```

> CSS 就完全包含在合并的应用中，再也不需要重新下载。

2、懒加载（推荐）

如果想发挥应用中多重入口文件的优势，可以在每个入口点包含各自的 CSS。

> 把模块用文件夹分离，每个文件夹有各自的 CSS 和 JavaScript 文件。
> 再次，当应用发布的时候，导入的 CSS 已经加载到每个入口文件中。

3、定制组件css

可以根据这个策略为每个组件创建 CSS 文件，可以让组件名和 CSS 中的 class 使用一个命名空间，来避免一个组件中的一些 class 干扰到另外一些组件的 class。如下图：

4、使用内联样式取代 CSS 文件

在 “React Native” 中不再需要使用任何 CSS 文件，只需要使用 style 属性，可以把你的 CSS 定义成一个对象，那样就可以根据项目重新来考略你的 CSS 策略。

### 加载sass

下载依赖

``` dash
  $ npm install sass-loader -save-dev
```

修改配置文件

``` js
  // 可以在 js 中引用 sass 的加载器
  {
      test: /\.scss$/,
      loader: 'style!css!sass'
  }
```

安装sass-loader之后运行运行 `npm run develop` 时报错

解决：

``` bash
  $ npm install node-sass -save-dev
```

### 图片处理

> 直到 HTTP/2 才能在应用加载的时候避免设置太多 HTTP 请求。
> 根据浏览器不同必须设置并行请求数，如果在 CSS 中加载了太多图片的话，可以自动把这些图片转成 BASE64 字符串然后内联到 CSS 里来降低必要的请求数，这个方法取决于图片大小。
> 需要为应用平衡下载的大小和下载的数量，不过 Webpack 可以让这个平衡十分轻松适应。

下载载依赖

``` bassh
  $ npm install url-loader  file-loader --save-dev
```

修改配置文件:

``` js
  {
      test: /\.(png|jpg|gif|jpeg)$/,
      loader: 'url?limit=25000'
  },
  // 处理字体
  {
      test: /\.(eot|woff|ttf|woff2|svg)$/,
      loader: 'url?limit=25000'
  }
```

> 加载器会把需要转换的路径变成 BASE64 字符串，在其他的 webpack 书中提到的这方面会把 CSS 中的 “url()” 像其他 require 或者 import 来处理。
> 意味着如果我们可以通过它来处理我们的图片文件。
> url-loader 传入的 limit 参数是告诉它图片如果不大于 25KB 的话要自动在它从属的 css 文件中转成 BASE64 字符串。

大图片处理

在代码中是一下情况：

```  css
  div.img {
      background: url(../image/xxx.jpg)
  }
  //或者
  var img = document.createElement("img");
  img.src = require("../image/xxx.jpg");
  document.body.appendChild(img);
```

``` js
  // 可以这样配置
  module: {
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=10000&name=build/[name].[ext]'
      }]
  }
```

针对上面的两种使用方式，loader 可以自动识别并处理。根据 loader 中的设置，webpack 会将小于指点大小的文件转化成 base64 格式的 dataUrl，其他图片会做适当的压缩并存放在指定目录中。

---

## webpack 的部署策略

### 修改 npm 的 package.json 文件

"publish": " webpack --config webpack.publish.config.js  -p",

指向生产的配置文件，并且加上了webpack的cli的-p,他会自动做一些优化

### 分离应用和第三方

何时应该分离？

当应用依赖其他库尤其是像 React JS 这种大型库的时候，需要考虑把这些依赖分离出去，这样就能够让用户在更新应用之后不需要再次下载第三方文件。

当满足下面几个情况的时候你就需要这么做了：

1、当你的第三方的体积达到整个应用的 20% 或者更高的时候。
2、更新应用的时候只会更新很小的一部分
3、你没有那么关注初始加载时间，不过关注优化那些回访用户在你更新应用之后的体验。
4、有手机用户。

修改 webpack.publish.config.js 文件

``` js
  var path = require('path');
  var node_modules = path.resolve(__dirname, 'node_modules');
  module.exports = {
      entry: path.resolve(__dirname,'src/js/app.js'),
      output: {
          path: path.resolve(__dirname, 'build'),
          filename: 'bundle.js',
      },
      // ...
      plugins: [
          new CleanPlugin(['dist']),
          // 分离第三方应用插件,name属性会自动指向entry中vendros属性，filename属性中的文件会自动构建到output中的path属性下面
          new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendors.js'}),
          // 可以新建多个抽离样式的文件，这样就可以有多个css文件了。
          new ExtractTextPlugin("app.css"),
          new webpack.DefinePlugin({
              //去掉react中的警告，react会自己判断
              'process.env': {
                  NODE_ENV: '"production"'
              }
          })
      ]
  }
```

可以看到，其实生产环境的配置和开发的配置没有太大的不同，主要是把不需要的东西给去掉了

``` bash
  $ npm  run  publish
```

``` html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>webpack 使用</title>
  </head>
  <body>
      <div id="app"></div>
  </body>
  <script src="bundle.js"></script>
  <script src="vendors.js"></script>
  </html>
```

注意：记住要把这些文件都加入到你的 HTML 代码中，但在上面这种引入后，在浏览器打开之后报错，是因为引入顺序的问题

将上面 index.html 文件中的两个 js 文件引入顺序调换，如下

``` html
  <!DOCTYPE html>
  <!-- ... -->
  <script src="vendors.js"></script>
  <script src="bundle.js"></script>
  </html>
```

### 和 gulp 的集成

``` js
  // gulp 的任务是控制执行流程，webpack 的任务是处理复杂引用的依赖
  var gulp = require('gulp');
  // 删除文件和目录
  var del = require('del');
  // 按顺序执行
  var gulpSequence = require('gulp-sequence');
  // 引入webpack的本地模块
  var webpack = require("webpack");
  // 引入wbpack的配置文件
  var webpackConfig = require("./webpack.publish.config.js");
  gulp.task('default', ['sequence'], function() {
      console.log("项目构建成功");
  });
  // 流程控制
  gulp.task('sequence', gulpSequence('clean','webpack'));
  // 删除文件和文件夹
  gulp.task('clean', function(cb) {
      //del('dist);// 如果直接给dist的目录，项目启动的顺序还有清除结果会报错，所以要写的更详细一些
      del(['dist/js','dist/css','dist/img','dist/*.html']);
      setTimeout(function(){
          return cb();
      },3000)

  });
  //写一个任务，在gulp中执行webpack的构建
  // gulp 负责任务流程部分的操作，webpack 负责复杂模块系统的引用分离工作
  gulp.task('webpack', function(cb) {
      setTimeout(function(){
          // 执行webpack的构建任务
          webpack(webpackConfig, function (err, stats) {
              if (err){
                  console.log("构建任务失败");
              }else{
                  cb();
              }
          });
      },3000)
  });
```

### 合并成单文件

一般情况下只有在下面的情况下才使用单入口模式：

1、应用很小
2、很少会更新应用
3、你不太关心初始加载时间

> gulp + webpack 构建多页面前端项目

http://cnodejs.org/topic/56df76559386fbf86ddd6916

---

## 常用插件

### 压缩插件 webpack.optimize.UglifyJsPlugin, 这个插件是webpack自带的.

在配置文件中加入以下代码：

``` js
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
      })
  ]
```

### 提取css插件

在 webpack 中编写 js 文件时，可以通过 require 的方式引入其他的静态资源，可通过 loade r对文件自动解析并打包文件。通常会将 js  文件打包合并，css文件会在页面的header中嵌入style的方式载入页面。但开发过程中我们并不想将样式打在脚本中，最好可以独立生成css文 件，以外链的形式加载。这时extract-text-webpack-plugin插件可以帮我们达到想要的效果。需要使用npm的方式加载插件，然后 参见下面的配置，就可以将js中的css文件提取，并以指定的文件名来进行加载。

``` bash
  $ npm install extract-text-webpack-plugin --save-dev
```

只能把 css 抽出来，但是 sass 的样式不能分离出来。

``` js
  var ExtractTextPlugin = require("extract-text-webpack-plugin");
  plugins: [
    new ExtractTextPlugin("app.css")
  ]
```

### 自动创建 index.Html 页面插件

html-webpack-plugin

``` js
  var HtmlWebpackPlugin = require('html-webpack-plugin');
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/template.html',
        htmlWebpackPlugin: {
            "files": {
                "css": ["app.css"],
                "js": ["vendors.js", "bundle.js"]
            }
        },
        // 压缩 html 文档
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        }
    })
  ]
```

### 优化第三方包

``` js
  plugins: [
    new webpack.DefinePlugin({
        //去掉react中的警告，react会自己判断
        'process.env': {
            NODE_ENV: '"production"'
        }
    })
  ]
```

### 自动打开浏览器插件

open-browser-webpack-plugin

https://github.com/baldore/open-browser-webpack-

> webpack.develop.config.js

``` js
  // 自动打开浏览器插件
  var OpenBrowserPlugin = require('open-browser-webpack-plugin');
  plugins: [
      new OpenBrowserPlugin({url: 'http://localhost:8080/', browser: 'chrome'})
  ]
```

### 提取 js 公共部分插件

提取公共文件: CommonsChunkPlugin

``` js
  plugins: [
      // 分离第三方应用插件,name属性会自动指向 entry 中 vendros 属性，filename 属性中的文件会自动构建到 output 中的 path 属性下面
      new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendors.js'}),
  ]
```

### ProvidePlugin插件

自动添加引用插件，全局暴露插件，直接使用

### 删除目录插件

clean-webpack-plugin

``` js
  var CleanPlugin = require("clean-webpack-plugin");
  plugins: [
    new CleanPlugin(['dist']),
  ]
```

### 拷贝文件插件

copy-webpack-plugin

### 合并配置文件插件

> webpack-config

https://github.com/mdreizin/webpack-config

---

## 开发阶段代码风格控制 eslint

安装：

``` bash
  $ npm install eslint -g
  $ npm install eslint-loader -save-dev
```

``` js
  module : {
    preLoaders: [
        {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ],
  }
```

## 其它知识点

### webpack中的非入口文件（异步加载）

这个是重点要配合 chunkname 属性，react-router 的动态路由会用到

http://react-china.org/t/webpack-output-filename-output-chunkfilename/2256/2

基本上都是在 require.ensure 去加载模块的时候才会出现，chunkFileName，个人理解是 cmd 和 amd 异步加载而且没有给入口文件时，会生成了 no-name 的 chunk，所以 chunkFileName一般都会是 [id].[chunkhash].js, 也就是这种 chunk 的命名一般都会是 0.a5898fnub6.js.

### Resolve属性

webpack 在构建包的时候会按目录的进行文件的查找，resolve 属性中的 extensions 数组中用于配置程序可以自行补全哪些文件后缀：

``` js
  resolve: {
      //查找module的话从这里开始查找
      root: '/pomy/github/flux-example/src', //绝对路径
      //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
      //注意一下, extensions 第一个是空字符串! 对应不需要后缀的情况.
      extensions: ['', '.js', '.json', '.scss',’jsx’],

      //模块别名定义，方便后续直接引用别名，无须多写长长的地址
      alias: {
          AppStore : 'js/stores/AppStores.js',//后续直接 require('AppStore') 即可
          ActionType : 'js/actions/ActionType.js',
          AppAction : 'js/actions/AppAction.js'
      }
  }
```

### Externals属性

外部依赖不需要打包进 bundle，当我们想在项目中 require 一些其他的类库或者 API ，而又不想让这些类库的源码被构建到运行时文件中，这在实际开发中很有必要。
比如：在页面里通过 script 标签引用了 jQuery：`<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>`，所以并不想在其他 js 里再打包进入一遍，比如你的其他 js 代码类似：

其实就是不是通过require或者import引入的，而是直接写在html中的js地址。

``` js
    // 配置了这个属性之后 react 和 react-dom 这些第三方的包都不会被构建进 js 中，那么我们就需要通过 cdn 进行文件的引用了
    // 前边的这个名称是在项目中引用用的，相当于 import React from 'react1' 中的 react
    externals: {
        'react1': 'react',
        'react-dom1': 'react-dom',
        '$1': 'jQuery'
    },
```

这样用了 externals 属性时不用分离插件了，作用是这里引的插件不会被 webpack 所打包。要么用 cdn 要么需要 webpack 打包。

### 开发环境中使用压缩文件

http://fakefish.github.io/react-webpack-cookbook/Optimizing-rebundling.html

不使用就会把 react 再处理一遍

### noParse属性

module.noParse 是 webpack 的另一个很有用的配置项，如果确定一个模块中没有其他新的依赖项就可以配置这个像，webpack 将不再扫描这个文件中的依赖。

``` js
  module: {
    noParse: [/moment-with-locales/]
  }
```

### 多文件入口

http://fakefish.github.io/react-webpack-cookbook/Multiple-entry-points.html


### 强制从新加载文件

http://fakefish.github.io/react-webpack-cookbook/Optimizing-caching.html

### Chunk

代码分离：

http://webpack.github.io/docs/code-splitting.html

### 懒加载

(1)、在 react 中如何使用

http://fakefish.github.io/react-webpack-cookbook/Lazy-loaded-entry-points.html

(2)、在 react-router 中用到动态加载路由可以实现

### 在服务器端用 webpack

Node 和webpack 集成用到的中间件：http://www.tuicool.com/articles/IvQb2ey
Node 和webpack 集成过程中遇到的坑如何解决：http://www.tuicool.com/articles/zEZneuq

不推荐用 webpack 构建 Node 代码

### 热加载组件

http://fakefish.github.io/react-webpack-cookbook/Hot-loading-components.html

