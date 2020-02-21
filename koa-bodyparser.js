module.exports = () => {// 包装一层函数是为了可以传参，函数默认返回真正的中间件函数 async函数
    return  async (ctx, next) => {
        await new Promise((resolve, reject) => {
            let arr = []
            ctx.req.on('data', (chunk) => {
                arr.push(chunk)
            })
            ctx.req.on('end', () => {
                console.log(Buffer.concat(arr));
                
                ctx.request.body = Buffer.concat(arr)
                resolve()
            })
        })
        await next()
    }
}