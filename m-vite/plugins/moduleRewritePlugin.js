const { _readSteramBodyAsstring } = require('./utils')
const { parse } = require('es-module-lexer')
const MagicString =  require('magic-string') // 因为字符串具有不变性

const _rewriteImports = (source) => {
  let imports = parse(source)[0]  //得到import的位置 import Vue from  vue 的vue
  let m = new MagicString(source) // 将字符串转成对象  且带有方法overwrite
  if (imports.length) {  // 对import进行拦截
    for (let i = 0; i < imports.length; i++) {  
      let { s, e } = imports[i]
      let id = source.substring(s, e)  // vue 或者 ./App

      // 开头不是/ 或者 . 则需要重写
      if (/^[^\/\.]/.test(id)) {
        id = `/@modules/${id}`
        m.overwrite(s, e, id)
      }
    }
  }
  return m.toString() // 返回替换结果
}

exports._moduleRewritePlugin = ({ _app, _root }) => { 
  _app.use(async (ctx, next) => { 
    // 直接先往下一个中间件（静态服务）走 
    // =ctx.body = fs.createReadStream('./xxx)
    await next()

    // 取js文件
    if (ctx.body && ctx.response.is('js')) { 
      let _bodyString = await _readSteramBodyAsstring(ctx.body)
      const result = _rewriteImports(_bodyString)
      ctx.body = result
    }
  })
}