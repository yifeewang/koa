//1.ctx
const Koa = require('./koa')
const fs = require('fs')

const app = new Koa() //产生一个app应用

app.use((ctx)=>{ //req res 是原生的，request response是封装的
    //原生
    console.log(111);
    console.log(ctx.req.method);
    console.log(ctx.request.req.method);
    //封装
    console.log(222);
    console.log(ctx.path);
    console.log(ctx.request.path);

    ctx.set('Content-Type', 'text/js-application')
    ctx.body = fs.createReadStream('./package.json')
})

app.listen(3000)