/*
* 结构：
*
* name: '随便取一个',
* entry: '入口脚本',
* plugins: {
*   template: '注入的html模板',
*   filename: '生成的html的文件名'
* },
*
* 注意：所有目录在'/root/src'开始
*/

var routes = [{
  name: 'index',
  entry: './index/start.tsx',
  plugins: {
    template: './../templates/index.html',
    filename: 'index.html'
  }
}]

module.exports = routes;