const Emmiter = require('events')
const http = require('http')
const request = require('./request')
const response = require('./response')
const context = require('./context')
const Stream = require('stream')

module.exports = class Application extends Emmiter {
    constructor(){
        super()
        //Object.create(context) 类似于 创建一个 {}._proto_ = context
        //创建一个新的对象继承自context，如果更改this.context,并不会影响到context
        this.context = Object.create(context)
        this.request = Object.create(request)
        this.response = Object.create(response)
        this.middleWares = []
    }
    use(fn){
        this.middleWares.push(fn)
    }
    createContext(req, res){
        let ctx = Object.create(this.context)
        ctx.request = Object.create(this.request)
        ctx.response =Object.create(this.response)
        ctx.req = ctx.request.req = req
        ctx.res = ctx.response.res = res
        return ctx
    }
    compose(middleWares, ctx){
        function dispatch(index){
            if(index === middleWares.length) return Promise.resolve();
            //调用Promise.resolve() 是为了保证返回的是一个Promise,
            //如果用户调用next ,前面必须要加await，否则不会等待
            return Promise.resolve(middleWares[index](ctx, () => {dispatch(index+1)}))
        }
        return dispatch(0) //首先取出第一个中间件执行
    }
    handleRequest(req,res){
        let ctx = this.createContext(req, res)
        // this.fn(ctx)  函数组合成middlewares后就不需要这一步了
        //将函数组合成一个promise
        this.compose(this.middleWares, ctx).then(() => {
            let body = ctx.body
            if(body instanceof Stream){
                body.pipe(res)
            }else if(typeof body === 'object'){
                ctx.set("Content-Type", "application/json")
                res.end(JSON.stringify(body))
            }else if(typeof body === 'string' && body !== '' || Buffer.isBuffer(body)){
                res.end(body)
            }else{
                res.end('Not Fount')
            }
        })
    }
    listen(...args){
        const server = http.createServer(this.handleRequest.bind(this))
        server.listen(...args)
    }
}