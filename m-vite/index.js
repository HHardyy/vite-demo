const Koa = require('koa')
const { _vuePlugin } = require('./plugins/vuePlugin')
const { _htmlRewritePlugin} = require('./plugins/htmlRewritePlugin')
const { _moduleResolvePlugin } = require('./plugins/moduleResolvePlugin')
const { _moduleRewritePlugin } = require('./plugins/moduleRewritePlugin')
const { _serveStaticPlugin } = require('./plugins/serveStaticPlugin')

const createServer = () => {
  const _app = new Koa()
  const _root = process.cwd()


  // 建立一个执行上下文
  const _ctx = {
    _app,
    _root
  }

  // 建立一个插件集合
  const _plugons = [
    _htmlRewritePlugin,
    _moduleRewritePlugin,  // 重写import
    _moduleResolvePlugin,  // 解析带有@module的资源
    _vuePlugin,
    _serveStaticPlugin     // 静态服务
  ]

  _plugons.forEach(_p => _p(_ctx))

  return _app
}

module.exports = createServer