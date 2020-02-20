//2.中间件middleware
const Koa = require('koa')

const app = new Koa() //产生一个app应用

const sleep = () => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log('sleep');
            resolve()
        }, 500);
    })
}

app.use(async (ctx, next)=>{ //next向下执行
    console.log(111);
    await next() //next函数内不会被包装成一个promise
    console.log(222);
    ctx.body = 'hello'
})
app.use(async (ctx, next)=>{
    console.log(333);
    await sleep() //需要等待一秒 才能给body赋值
    ctx.body = 'world'
    await next()
    console.log(444);
})
app.use(async (ctx, next)=>{
    console.log(555);
    await next()
    console.log(666);
})

app.listen(3000)