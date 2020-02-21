let context = {
}

function defineGetter(property, key) {//Object.defineProperty.get
    context.__defineGetter__(key, function(){
        //this指向外部拷贝的ctx ，外部ctx调用此方法，故可获取ctx上的request
        return this[property][key]
    })
}
function defineSetter(property, key) {//Object.defineProperty.set
    context.__defineSetter__(key, function(newValue){
        //this指向外部拷贝的ctx ，外部ctx调用此方法，故可获取ctx上的request
        this[property][key] = newValue
    })
}
defineGetter('request', 'method')
defineGetter('request', 'path')
defineGetter('response', 'body')
defineGetter('response', 'set')
defineGetter('request', 'get')

defineSetter('response', 'body')


module.exports = context