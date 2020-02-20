let url = require('url')

let request = {
    get method(){// 通过ctx来取，因为ctx上有req,所以能取到
        return this.req.method
    },
    get path(){
        return url.parse(this.req.url).pathname
    }
}

module.exports = request