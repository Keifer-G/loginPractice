### 插件部分
- koa => node框架  
- koa-router => 路由  => let router = require('koa-router')(); => router.get('',ctx=>{ ctx.body=[内容] })

- koa-views => 模版引擎  => app.use(__dirname,{ extention : ejs }) / app.use(__dirname,{ map : { html:ejs } })  第二种后缀名就需要是html
- ejs => 模版引擎 👎这个

- koa-bodyparser => 获取前段post传输的内容  => app.use([引入名]()) => app.use('',async ctx=> { ctx.body = ctx.request.body })

- koa-static => 置入静态资源  => app.use(static(__dirname + '/static'))，但同时html文件的link也需要

- 高性能模版引擎art-template，支持ejs,选装俩，用这个👌
    - art-template
    - koa-art-template

    - 引入 const render = require('koa-art-template');
    
    - 使用
        render(app,{
            root:path.join(__dirname,'view'),  //=> 文件位置 => 需要引入path模块来使用path
            extname:'.art',  //=> 后缀名
            debug:process.env.NODE_ENV !== 'production'  //=> 是否开启调试模式
        });

- koa-session => 详情参见koa-session官方文档

### 业务逻辑插件
- bcryptjs-  => 密码加密

- gravatar => 全球公认头像（可以设置任何注册邮箱的头像）

- jsonwebtoken => 生成token

- koa-passport => 用于获取token

- passport-jwt => 用于验证token

- koa-cors => 后台解决跨域问题


