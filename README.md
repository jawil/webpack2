# Webpack2 升级指南和特性摘要

## `resolve.root`, `resolve.fallback`, `resolve.modulesDirectories`

上述三个选项将被合并为一个标准配置项：resolve.modules. 更多关于resolve的信息信息可查阅 [resolving](https://webpack.js.org/configuration/resolve/).

``` diff
  resolve: {
-   root: path.join(__dirname, "src")
+   modules: [
+     path.join(__dirname, "src"),
+     "node_modules"
+   ]
  }
```

## `resolve.extensions`

该配置项将不再要求强制转入一个空字符串，而被改动到了resolve.enforceExtension下， 更多关于resolve的信息信息可查阅 [resolving](https://webpack.js.org/configuration/resolve/).

## `resolve.*`

更多相关改动和一些不常用的配置项在此不一一列举，大家如果在实际项目中用到可以到[resolving]( [resolving](https://webpack.js.org/configuration/resolve/))中进行查看.

## `module.loaders` 将变为 `module.rules`

旧版本中loaders配置项将被功能更为强大的rules取代，同时考虑到新旧版本的兼容，之前旧版本的`module.loaders`的相关写法仍旧有效，loaders中的相关配置项也依旧可以被识别。

新的loader配置规则会变得更加通俗易用，因此官方也非常推荐用户能及时按`module.rules`中的相关配置进行调整升级。

``` diff
  module: {
-   loaders: [
+   rules: [
      {
        test: /\.css$/,
-       loaders: [
+       use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
-           query: {
+           options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader", // Do not use "use" here
        options: {
          // ...
        }
      }
    ]
  }
```

## 链式loaders

同webpack1.X中类似，loaders继续支持链式写法，可将相关正则匹配到的文件资源数据在几个loader之间进行共享传递，详细使用说明可见 [rule.use](https://webpack.js.org/configuration/module/#rule-use)。

在wepback2中，用户可通过`use`项来指定需要用到的loaders列表（官方推荐），而在weback1中，如果需要配置多个loaders则需要依靠简单的` !`符来切分，这种语法出于新旧兼容的考虑，只会在`module.loaders`中生效。

``` diff
  module: {
-   loaders: {
+   rules: {
      test: /\.less$/,
-     loader: "style-loader!css-loader!less-loader"
+     use: [
+       "style-loader",
+       "css-loader",
+       "less-loader"
+     ]
    }
  }
```

##`module`名称后自动自动补全 `-loader`的功能将被移除

在配置loader时，官方不再允许省略`-loader`扩展名，loader的配置写法上将逐步趋于严谨。

``` diff
  module: {
    rules: [
      {
        use: [
-         "style",
+         "style-loader",
-         "css",
+         "css-loader",
-         "less",
+         "less-loader",
        ]
      }
    ]
  }
```

当然，如果你想继续保持之前的省略写法，你写可以在`resolveLoader.moduleExtensions`中开启默认扩展名配置，不过这种做法并不被推荐。

``` diff
+ resolveLoader: {
+   moduleExtensions: ["-loader"]
+ }
```

可以从这里查看 [#2986](https://github.com/webpack/webpack/issues/2986)此次变更的原因；

## `json-loader`无需要独立安装

当我们需要读取json格式文件时，我们不再需要安装任何loader，webpack2中将会内置  [json-loader](https://github.com/webpack/json-loader)，自动支持json格式的读取（喜大普奔啊）。

``` diff
  module: {
    rules: [
-     {
-       test: /\.json/,
-       loader: "json-loader"
-     }
    ]
  }
```

[为何需要默认支持json格式](https://github.com/webpack/webpack/issues/3363)官方的解释是为了在webpack, node.js and browserify三种构建环境下提供无差异的开发体验。

## `loader`配置项将默认从`context`中读取

在webpack 1中的一些特殊的loader在读取对应资源时，需要通过`require.resolve`指定后才能指定生效。从webpack 2后，配置loader在直接从`context`中进行读取，这就解决了一些在使用“npm链接”或引用模块之外的`context`造成的模块重复导入的问题。

配置中可以删除如下代码：

``` diff
  module: {
    rules: [
      {
        // ...
-       loader: require.resolve("my-loader")
+       loader: "my-loader"
      }
    ]
  },
  resolveLoader: {
-   root: path.resolve(__dirname, "node_modules")
  }
```

## `module.preLoaders` 和 `module.postLoaders`  将被移除

``` diff
  module: {
-   preLoaders: [
+   rules: [
      {
        test: /\.js$/,
+       enforce: "pre",
        loader: "eslint-loader"
      }
    ]
  }
```

之前需要用到preLoader的地方可以改到rules的enfore中进行配置。

## `UglifyJsPlugin`中的 `sourceMap`配置项将默认关闭

`UglifyJsPlugin`中的`sourceMap` 默认项将从 `true`变为 `false`。

这就意味着当你的js编译压缩后，需要继续读取原始脚本信息的行数，位置，警告等有效调试信息时，你需要手动开启`UglifyJsPlugin` 的配置项：`sourceMap: true` 。

``` diff
  devtool: "source-map",
  plugins: [
    new UglifyJsPlugin({
+     sourceMap: true
    })
  ]
```

## `UglifyJsPlugin` 的警告配置将默认关闭

`UglifyJsPlugin`中的 `compress.warnings` 默认项将从 `true`变为 `false`。

这就意味着当你想在编译压缩的时候查看一部分js的警告信息时，你需要将`compress.warnings` 手动设置为 `true`。

``` diff
  devtool: "source-map",
  plugins: [
    new UglifyJsPlugin({
+     compress: {
+       warnings: true
+     }
    })
  ]
```

## `UglifyJsPlugin` 不再支持让 `Loaders` 最小化文件的模式了

`UglifyJsPlugin` 将不再支持让 Loaders 最小化文件的模式。`debug` 选项已经被移除。Loaders 不能从 webpack 的配置中读取到他们的配置项。

loade的最小化文件模式将会在webpack 3或者后续版本中被彻底取消掉.

为了兼容部分旧式loader，你可以通过 `LoaderOptionsPlugin` 的配置项来提供这些功能。

``` diff
  plugins: [
+   new webpack.LoaderOptionsPlugin({
+     minimize: true
+   })
  ]
```

## `DedupePlugin` 已经被移除

`webpack.optimize.DedupePlugin` 不再需要. 从你以前的配置移除这个配置选项.

## `BannerPlugin` 配置项将有所改变

`BannerPlugin` 将不再允许接受两个参数，而是只提供一个对象配置项.

``` diff
  plugins: [
-    new webpack.BannerPlugin('Banner', {raw: true, entryOnly: true});
+    new webpack.BannerPlugin({banner: 'Banner', raw: true, entryOnly: true});
  ]
```

## `OccurrenceOrderPlugin` 将被内置加入

不需要再针对`OccurrenceOrderPlugin`进行配置

``` diff
  plugins: [
-   new webpack.optimize.OccurrenceOrderPlugin()
  ]
```

## `ExtractTextWebpackPlugin`配置项将有所改变

[ExtractTextPlugin](https://github.com/webpack/extract-text-webpack-plugin) ] 1.0.0 在webpack v2将无法使用，你需要重新指定安装`ExtractTextPlugin` 的webpack2的适配版本.

`npm install --save-dev extract-text-webpack-plugin@beta`

 更新后的`ExtractTextPlugin`版本会针对wepback2进行相应的调整。

### `ExtractTextPlugin.extract`的配置书写方式将调整

```diff
module: {
  rules: [
    test: /.css$/,
-    loader: ExtractTextPlugin.extract("style-loader", "css-loader", { publicPath: "/dist" })
+    loader: ExtractTextPlugin.extract({
+      fallbackLoader: "style-loader",
+      loader: "css-loader",
+      publicPath: "/dist"
+    })
  ]
}
```

### `new ExtractTextPlugin({options})`的配置书写方式将调整

```diff
plugins: [
-  new ExtractTextPlugin("bundle.css", { allChunks: true, disable: false })
+  new ExtractTextPlugin({
+    filename: "bundle.css",
+    disable: false,
+    allChunks: true
+  })
]
```

## 全量动态加载资源将默认失效

只有使用一个表达式的资源依赖引用(i. e.` require(expr)`)，现在将创建一个空的context，而不是一个context的完整目录。

当在es2015的模块化中无法工作时，请最好重构这部分的代码，如果无法进行修改这部分代码，你可以在`ContextReplacementPlugin`中来提示编译器做出正确处理。

###Cli使用自定义参数作为配置项传入方式将做调整

如果你随意将自定义参数通过cli传入到配置项中，如：

`webpack --custom-stuff`

``` js
// webpack.config.js
var customStuff = process.argv.indexOf("--custom-stuff") >= 0;
/* ... */
module.exports = config;
```

你会发现这将不会被允许，cli的执行将会遵循更为严格的标准。

取而代之的是用一个接口来做传递参数配置。这应该是新的代替方案，未来的工具开发也可能依赖于此。

`webpack --env.customStuff`

``` js
module.exports = function(env) {
  var customStuff = env.customStuff;
  /* ... */
  return config;
};
```

查看更多介绍 [CLI](https://webpack.js.org/api/cli/).

##`require.ensure` 和 `AMD require`将采用异步式调用

`require.ensure`和`amd require`将默认采用异步的加载方式来调用，而非之前的当模块请求加载完成后再在回调函数中同步触发。

`require.ensure`**将基于原生的**`Promise`**对象重新实现，当你在使用** `require.ensure` **时请确保你的运行环境默认支持Promise对象，如果缺少则推荐使用安装polyfill.**

## Loader的配置项将通过`options`来设置

在`webpack.config.js`中将不再允许使用自定义属性来配置loder，这直接带来的一个影响是：在`ts`配置项中的自定义属性将无法在被在webpack2中正确使用：

```js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }]
  },
  // does not work with webpack 2
  ts: { transpileOnly: false }
}
```

### 什么是 `options`?

这是一个非常好的提问，严格意义上来说，`custom property`和`options`均是用于webpack loader的配置方式，从更通俗的说法上看，`options`应该被称作`query`，作为一种类似字符串的形式被追加到每一个loader的命名后面，非常类似我们用于url中的查询字符串，但在实际应用中功能要更为[强大](https://github.com/webpack/loader-utils#parsequery):

```js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader?' + JSON.stringify({ transpileOnly: false })
    }]
  }
}
```

options也可作为一个独立的字面对象量，在loader的配置中搭配使用。

```js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options:  { transpileOnly: false }
    }]
  }
}
```

## `LoaderOptionsPlugin` context

部分loader需要配置`context`信息， 并且支持从配置文件中读取。这需要loader通过用长选项传递进来，更多`loader`的明细配置项可以查阅相关文档。

为了兼容部分旧式的loader配置，也可以采用如下插件的形式来进行配置：

``` diff
  plugins: [
+   new webpack.LoaderOptionsPlugin({
+     options: {
+       context: __dirname
+     }
+   })
  ]
```

## `debug`

`debug`作为loader中的一个调试模式选项，可以在webpack1的配置中灵活切换。在webpack2中，则需要`loader`通过用长选项传递进来，更多loader的明细配置项可以查阅相关文档。

loder的`debug`模式在webpack3.0或者后续版本中将会被移除。

为了兼容部分旧式的loader配置，也可以采用如下插件的形式来进行配置：

``` diff
- debug: true,
  plugins: [
+   new webpack.LoaderOptionsPlugin({
+     debug: true
+   })
  ]
```

## Code Splitting with ES2015

在webpack1中，你需要使用`require.ensure`实现`chunks`的懒加载，如：

```javascript
require.ensure([], function(require) {
  var foo = require("./module");
});
```

在es2015的 loader中通过定义`import()`作为资源加载方法，当读取到符合ES2015规范的模块时，可实现模块中的内容在运行时动态加载。

webpack在处理`import()`时可以实现按需提取开发中所用到的模块资源，再写入到各个独立的chunk中。webpack2已经支持原生的 ES6 的模块加载器了，这意味着 webpack 2 能够理解和处理 `import`和`export`了。

`import()`支持将模块名作为参数出入并且返回一个`Promise`对象。

``` js
function onClick() {
  import("./module").then(module => {
    return module.default;
  }).catch(err => {
    console.log("Chunk loading failed");
  });
}
```

这样做的还有一个额外的好处就是当我们的模块加载失败时也可以被捕获到了，因为这些都会遵循`Promise`的标准来实现。

值得注意的地方：`require.ensure`的第三个参数选项允许使用简单的chunk命名方式，但是`import` API中将不被支持，如果你希望继续采用函数式的写法，你可以继续使用`require.ensure`。

```javascript
require.ensure([], function(require) {
  var foo = require("./module");
}, "custom-chunk-name");
```
（注： `System.import`将会被弃用，webpack中将不再推荐使用 `System.import`，官方也推荐使用`import`进行替换，详见 [v2.1.0-beta.28](https://github.com/webpack/webpack/releases/tag/v2.1.0-beta.28))

如果想要继续使用[Babel](http://babeljs.io/)中提供的`import`，你需要独立安装 [dynamic-import](http://babeljs.io/docs/plugins/syntax-dynamic-import/) 插件并且选择babel的`Stage 3`来捕获时的错误， 当然这也可以根据实际情况来操作而不做强制约束。

## Dynamic expressions动态表达式

现在`import()`中的传参可支持部分表达式的写法了，如果之前有接触过CommonJS中`require()`表达式写法，应该不会对此感到陌生,（它的操作其实和 CommonJS 是类似的，给所有可能的文件创建一个环境，当你传递那部分代码的模块还不确定的时候，webpack 会自动生成所有可能的模块，然后根据需求加载。这个特性在前端路由的时候很有用，可以实现按需加载资源）

`import()` 会针对每一个读取到的module创建独立的`separte chunk`。

``` js
function route(path, query) {
  return import(`./routes/${path}/route`)
    .then(route => new route.Route(query));
}
// This creates a separate chunk for each possible route
```

## 可以混用 ES2015 和 AMD 和 CommonJS

在 AMD 和 CommonJS 模块加载器中，你可以混合使用所有（三种）的模块类型（即使是在同一个文件里面）。

```javascript
// CommonJS consuming ES2015 Module
var book = require("./book");

book.currentPage;
book.readPage();
book.default === "This is a book";
```

```javascript
// ES2015 Module consuming CommonJS
import fs from "fs"; // module.exports map to default
import { readFileSync } from "fs"; // named exports are read from returned object+

typeof fs.readFileSync === "function";
typeof readFileSync === "function";
```

注：`es2015 balel` 的默认预处理会把 ES6 模块加载器转化成 CommonJS 模块加载。要是想使用 webpack 新增的对原生 ES6 模块加载器的支持，你需要使用 `es2015-webpack` 来代替，另外如果你希望继续使用babel，则需要通过配置babel项，使其不会强制解析这部分的module symbols以便webpack能正确使用它们，babel的配置如下：

**.babelrc**

```json
{
  "presets": [
    ["es2015", { "modules": false }]
  ]
}
```

## Hints

No need to change something, but opportunities

### Template strings模板字符串

webpack中的资源参数已经开始支持模板字符串了，这意味着你可以使用如下的配置写法：

``` diff
- require("./templates/" + name);
+ require(`./templates/${name}`);
```

###配置支持项支持Promise

webpack现在在配置文件项中返回`Promise`了，这就允许你在配置中可以进行一些异步的写法了，如下所示：

**webpack.config.js**

``` js
module.exports = function() {
  return fetchLangs().then(lang => ({
    entry: "...",
    // ...
    plugins: [
      new DefinePlugin({ LANGUAGE: lang })
    ]
  }));
};
```

### Loader匹配支持更多的高级写法

webpack中的loader配置支持如下写法：

``` js
module: {
  rules: [
    {
      resource: /filename/, // matches "/path/filename.js"
      resourceQuery: /querystring/, // matches "/filename.js?querystring"
      issuer: /filename/, // matches "/path/something.js" if requested from "/path/filename.js"
    }
  ]
}
```

### 更多的CLI参数项

如下有更多的CLI 参数项可用:

`--define process.env.NODE_ENV="production"` 支持直接配置`DefinePlugin`.

`--display-depth` 能显示每个entry中的module的资源深度

`--display-used-exports` 能显示每个module中依赖使用了哪些资源.

`--display-max-modules`能限制显示output中引用到的资源数量 (默认显示15个).

-p 指定当前的编译环境为生产环境，即修改：`process.env.NODE_ENV` 为 `"production"`

### Cacheable缓存项

Loaders现在将默认开启资源缓存了，如果你不希望loader读缓存则需要在配置中指明：

``` diff
  // Cacheable loader
  module.exports = function(source) {
-   this.cacheable();
    return source;
  }
```

``` diff
  // Not cacheable loader
  module.exports = function(source) {
+   this.cacheable(false);
    return source;
  }
```

### Complex options复合参数项写法

webpack1中的loader参数项中只支持`JSON.stringify-able`这种json字符串的写法；

webpack2中的loader参数项中已经可以支持任意的JS对象的写法了。

使用复合选项时会有一个限制，你需要配置一个`ident`作为项来保证能正确引用到其他的loader，这意味着通过配置我们可以在内联写法中去调用对应依赖的加载器，如下：

`require("some-loader??by-ident!resource")`

``` js
{
  test: /.../,
  loader: "...",
  options: {
    ident: "by-ident",
    magic: () => return Math.random()
  }
}
```

这种写法在平常开发中用的不算多，但是有一种场景下会比较有用，就是当我们的loader需要去生成独立的代码片段时，如，我们在使用s`tyle-loader`生成一个模块时，需要依赖前面的loader计算的结果。

``` js
// style-loader generated code (simplified)
var addStyle = require("./add-style");
var css = require("-!css-loader?{"modules":true}!postcss-loader??postcss-ident");

addStyle(css);
```

在这种复杂选项的使用时`ident`就有用武之地了。

## 结尾
webpack2无论是从优化资源配置项，到向es6 module，Promise等新标准接轨，再到编译环境和性能的优化，再到API设计的整体规范性上，相对V1的改进还是非常显著的，希望大家多多尝试，及时反馈交流，让webapck的生态圈变得日益活跃强大。


