//koa小实践   注意：koa里面异步必须要封装成promise，进行async await
const koa = require('./koa');
const fs = require('fs');
const path = require('path');

const app = new koa();
const static= require('./koa-static');
const bodyParser = require('./koa-bodyparser');
const BODYPARSER = require('koa-bodyparser'); //第三方模块
// 中间件特点 1。可以扩展一些属性和方法 2。可以增加一些公共属性 3。决定是否向下执行
// app.use(bodyParser());

//静态服务中间件，如果这个文件存在 我就讲这个文件返回
app.use(static(path.resolve(__dirname,'koa')));

//form  get
app.use(async (ctx, next) => {
    console.log(222);
    if(ctx.path === '/form' && ctx.method === 'GET') {
        ctx.set('Content-Type', 'text/html; charset=utf-8')
        ctx.body = fs.createReadStream(path.join(__dirname, '/index.html'))
    }else{
        await next()
    }
})
//form post
app.use(async (ctx, next) => {
    console.log(333);
    if(ctx.path === '/form' && ctx.method === 'POST') {
        ctx.body = ctx.request.body
    }else{
        ctx.body = 'not found'
    }
})
app.listen(3000)