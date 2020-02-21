const path = require('path')
const fs = require('fs')


module.exports = (dirname) => {
    return async (ctx, next) => {
        const absPath = path.join(dirname,ctx.path)
        try {
            const statObj = fs.statSync(absPath)
            if(statObj.isFile()){
                ctx.body = fs.readFileSync(absPath,'utf-8')
            }else{
                ctx.body = 'jahaha'
            }
        } catch (error) {
            
            await next()
        }
    }
}