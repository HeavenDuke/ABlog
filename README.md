# ABlog

我的个人博客网站源码

* 基于KoaJS构建
* 数据库采用mongodb
* 缓存采用redis

#### 部署方式

安装mongodb:
```plain
sudo apt-get install mongodb-server
```
安装imagemagick
```plain
sudo apt-get install build-essentials
sudo apt-get install imagemagick
```
安装redis
```plain
sudo apt-get install redis-server
sudo apt-get install redis-tools
```
安装nodejs(注意版本应支持ES6)与npm

安装bower
```plain
sudo npm install -g bower
```
部署基本数据(在项目根目录下执行)
```plain
node models/deploy/seed.js
```

安装必要的组件(在项目根目录下执行):
```plain
npm install
bower install
```

安装nginx与passenger，按照fusion-passenger官网指引配置相关参数

用域名或ip访问博客即可。