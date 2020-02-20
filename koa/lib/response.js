let response = {
    _body: '',
    get body(){
        return this._body
    },
    set body(newValue){
        this._body = newValue
    },
    set(key, value){
        this.res.setHeader(key, value)
    }
}

module.exports = response