# html-build

传统 html 站点打包工具

解决传统 html 站点，处理利用强缓存不便利的问题

## 解决方案

充分利用强缓存

1. 简单的解决方案，就是资源添加时间戳，也可以手动处理
2. 复杂但强大的解决方案，如下
   - 自动将资源添加 md5 命名后缀
   - 将静态资源上传到 cdn
   - 替换静态文件中引用的对应资源
   - 发布

## 使用

安装后，项目根目录配置cdn 配置，qnConfig.js, 即可自动打包处理

```bash
npm i -g @deepjs/html-build

html-build ~/html/xxx
# or
hb ~/html/xxx
```
