const { _readSteramBodyAsstring } = require('./utils');
exports._htmlRewritePlugin =({_app, _root}) => {
    const inject = `
        <script>
            window.process = {}
            process.env = {NODE_ENV:'development'}
        </script>
    `;

    // 这里可以给前端注入热更新脚本
    _app.use(async (ctx,next)=>{
        await next();
        if(ctx.response.is('html')){
          const html =await _readSteramBodyAsstring(ctx.body);

          ctx.body = html.replace(/<head>/,`$&${inject}`)
        }
    })
}
