//koa小实践   注意：koa里面异步必须要封装成promise，进行async await
const koa = require('./koa');
const fs = require('fs');
const path = require('path')

const app = new koa();

const body = ctx => {
    return new Promise((resolve, reject) => {
        let arr = []
        ctx.req.on('data', (chunk) => {
            arr.push(chunk)
        })
        ctx.req.on('end', () => {
            resolve(Buffer.concat(arr).toString())
        })
    })
}

//form  get
app.use(async (ctx, next) => {
    if(ctx.path === '/form' && ctx.method === 'GET') {
        ctx.set('Content-Type', 'text/html; charset=utf-8')
        ctx.body = fs.createReadStream(path.join(__dirname, '/index.html'))
    }else{
        await next()
    }
})
//form post
app.use(async (ctx, next) => {
    if(ctx.path === '/form' && ctx.method === 'POST') {
        ctx.body = await body(ctx)
    }else{
        ctx.body = 'xxxxxxxxx'
    }
})
app.listen(3000)