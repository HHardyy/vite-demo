const fs = require('fs').promises
const path = require('path')
const _moduleGeg = /^\/@modules\//

const resolveVue = (_root) => { 
    // commonjs规范
    const compilerPkgPath = path.join(_root,'node_modules','@vue/compiler-sfc/package.json');  // 因为这个main对应的就是commonjs的规范
    const compilerPkg = require(compilerPkgPath); // 获取的是json中的内容
    // node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js
    const compilerPath = path.join(path.dirname(compilerPkgPath),compilerPkg.main)
  const resolvePath = (name) => path.resolve(_root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`);
  
    const runtimeDomPath = resolvePath('runtime-dom'); 
    const runtimeCorePath = resolvePath('runtime-core'); 
    const reactivityPath = resolvePath('reactivity');
    const sharedPath = resolvePath('shared');

    return {
        compiler:compilerPath,// 用于稍后后端进行编译的文件路径
        '@vue/runtime-dom':runtimeDomPath,
        '@vue/runtime-core':runtimeCorePath,
        '@vue/reactivity':reactivityPath,
        '@vue/shared':sharedPath,
        vue:runtimeDomPath
    }
}

exports._moduleResolvePlugin = ({ _app, _root }) => { 
  const vueResolved = resolveVue(_root)  // 根据运行目录解析出一个文件表，包含vue中的所有模块
  _app.use(async (ctx, next) => { 
    if (!_moduleGeg.test(ctx.path)) {  // /@module/vue
      return next()
    }
    const id = ctx.path.replace(_moduleGeg, '') //vue
    ctx.type = 'js'
    const _content = await fs.readFile(vueResolved[id], 'utf8')
    ctx.body = _content
  })
}