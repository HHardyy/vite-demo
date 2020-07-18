const path = require('path');
const fs = require('fs').promises;
const defaultExportRE = /((?:^|\n|;)\s*)export default/

function resolveVue(_root) {
  // commonjs规范
  const compilerPkgPath = path.join(_root, 'node_modules', '@vue/compiler-sfc/package.json');
  const compilerPkg = require(compilerPkgPath);
  const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main)
  const resolvePath = (name) => path.resolve(_root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`);
  const runtimeDomPath = resolvePath('runtime-dom');
  const runtimeCorePath = resolvePath('runtime-core');
  const reactivityPath = resolvePath('reactivity');
  const sharedPath = resolvePath('shared');

  return {
    compiler: compilerPath,
    '@vue/runtime-dom': runtimeDomPath,
    '@vue/runtime-core': runtimeCorePath,
    '@vue/reactivity': reactivityPath,
    '@vue/shared': sharedPath,
    vue: runtimeDomPath
  }
}

exports._vuePlugin = ({ _app, _root }) => { // ast
  _app.use(async (ctx, next) => {
    if (!ctx.path.endsWith('.vue')) {
      return next();
    }
    const filePath = path.join(_root, ctx.path);
    const content = await fs.readFile(filePath, 'utf8');

    let { parse, compileTemplate } = require(resolveVue(_root).compiler);
    let { descriptor } = parse(content); // 解析文件内容
    if (!ctx.query.type) { // App.vue
      let code = ``;
      if (descriptor.script) {
        let content = descriptor.script.content;
        let replaced = content.replace(defaultExportRE, '$1const __script =');
        code += replaced;
      }
      if (descriptor.template) { // /App.vue?type=template
        const templateRequest = ctx.path + `?type=template`
        code += `\nimport { render as __render } from ${JSON.stringify(
          templateRequest
        )}`;
        code += `\n__script.render = __render`
      }
      ctx.type = 'js'
      code += `\nexport default __script`;
      ctx.body = code;
    }
    if (ctx.query.type == 'template') {
      ctx.type = 'js';
      let content = descriptor.template.content;
      const { code } = compileTemplate({ source: content });
      ctx.body = code;
    }
  })
}