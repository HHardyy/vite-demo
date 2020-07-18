const _s = require('koa-static')
const path = require('path')

exports._serveStaticPlugin = ({ _app, _root }) => { 
  // 在哪里运行，就以哪个目录作为静态服务
  _app.use(_s(_root))
  // 以public作为静态服务
  _app.use(_s(path.join(_root, 'public')))
}