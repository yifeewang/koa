//4.解析文件上传
const koa = require('koa');
const fs = require('fs').promises;
const path = require('path');
const uuid = require('uuid');

const app = new koa();
const static = require('./koa-static');
const bodyParser = require('./koa-bodyparser')

app.use(static(__dirname));

Buffer.prototype.split = function(sep){
    let arr = []
    let len = Buffer.from(sep).length
    let offset = 0
    let current
    
    while((current = this.indexOf(sep, offset)) !== -1){
        arr.push(this.slice(offset, current))
        offset = current + len
    }
    arr.push(this.slice(offset))
    return arr
}

//form post
app.use(async (ctx, next) => {
    if(ctx.path === '/form' && ctx.method === 'POST') {
        await new Promise((resolve,reject) => {
            let arr = []
            ctx.req.on('data', (chunk) => {
                arr.push(chunk)
            })
            ctx.req.on('end', async () => {
                let alldata = Buffer.concat(arr)
                let bundary = '--' + ctx.req.headers['content-type'].split('=')[1]
                let contentArr = alldata.split(bundary).slice(1,-1)
                await Promise.all(contentArr.map(async line => {
                    let fields= {}
                    let [head, body] = line.split('\r\n\r\n')
                    head = head.toString()
                    let key = head.match(/name=".+"/)[1]
                    if(!head.includes('filename')){
                        body = body.toString()
                        fields[key] = body
                    }else{
                        let absPath = path.resolve(__dirname, 'upload', uuid.v4())
                        let ct = body.slice(head.lenth + 4, -2)
                        await fs.writeFile(absPath,ct)
                        fields[key] = absPath
                    }
                    ctx.request.fields = fields
                }))
            })
        })
        ctx.body =  ctx.request.fields
    }else{
        ctx.body = 'not found'
    }
})
app.listen(3000)