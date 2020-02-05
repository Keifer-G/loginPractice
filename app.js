let Koa = require('koa');
let router = require("koa-router")();  //这里来直接获取实例
let views = require('koa-views');  // 要渲染html等文件必须要使用这个模块
let cors = require('koa-cors');  // 解决跨域问题
let bcryptjs = require('bcryptjs');  // 密码加密
let jwt = require('jsonwebtoken'); //生成token
let bodyParser = require('koa-bodyparser');
let mongoose = require("mongoose");
let Schema = require('mongoose').Schema;

let app = new Koa();  // 实例化koa框架

app.use(bodyParser());  // 使用中间件bodyparser
app.use(cors({
    origin: function (ctx) {
        return '*'; // 允许任何域名的请求
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));  // 使用中间件
app.use

// 连接数据库
mongoose.connect("mongodb://127.0.0.1:27017/old",{ useUnifiedTopology: true ,useNewUrlParser: true}); //建立链接 因为默认是27017端口号可以省略，如果更改了就需要写上去

let db = mongoose.connection;  // 检测链接是否成功
db.on("error",()=>{
    console.log("链接失败")
})
db.once("open",()=>{
    console.log('链接成功')
})

let UserSchema = new Schema({  // 实例化填写数据规范
    userName:String,
    password:String
}); 
let userModel = mongoose.model('users',UserSchema); // 第一个字符串是要操作的集合，第二个是应用规范

// -------------------------------------
app.use(views(__dirname+'/pages/'),{
    extension:'html'  // 写入需要渲染的文件位置，以及文件格式
})

router.get('/',async ctx=>{ //默认位置
    await ctx.render('register')    
})

// 登陆内容
router.post('/',async ctx=>{
    let User = ctx.request.body;
    //console.log(ctx.request.header.cookie); 
    let _token = ctx.request.header.cookie;

    let findResult = await userModel.findOne({'userName': User['name']},err=>{if(err)console.log(err)});
    if(!findResult){
        await ctx.render('registernone')
    }else if(findResult.userName === User['name'] && bcryptjs.compareSync(User['password'], findResult.password)){

        await ctx.render('gogogo')

        // console.log(findResult);
    }else{
        await ctx.render('registerfail')
    }
})


// 注册内容
router.post('/login',async ctx=>{
    
    let User = ctx.request.body;

    let salt = bcryptjs.genSaltSync(10);
    let hash = bcryptjs.hashSync(User['password'], salt);
    
    let newUser = {
        userName : User['name'],
        password : hash
    }
    // 将数据放入数据库'
    let findResult = await userModel.find({'userName': User['name']})  // await这个后获得的就是data值，所以使用一个变量来进行存储，来解决如果在里面await ctx报错，和在外面没有data值的问题
    //console.log(findResult.length)
    if(findResult.length>=1){
        await ctx.render('loginfail');
    }else{
        userModel.create(newUser,err=>{
            if(err){
                console.log('数据储存失败')
            }
        })
        await ctx.render('loginsuccess')
        //console.log(hash)
     }

})

router.get('/loginsuccess',async ctx=>{
    await ctx.render('loginsuccess')
})

router.get('loginfail',async ctx=>{
    await ctx.render('loginfail')
})

router.get('/login',async ctx=>{
    await ctx.render('login')
});

router.get('/gogogo',async ctx=>{
    await ctx.render('gogogo')
})

router.get('registerfail',async ctx=>{
    await ctx.render('registerfail')
})

router.get('registernone',async ctx=>{
    await ctx.render('registernone')
})

app
    .use(router.routes())  //启动路由，一定要加，不然无法生效路由
    .use(router.allowedMethods());  // 可配置也可不配置

app.listen(3000);