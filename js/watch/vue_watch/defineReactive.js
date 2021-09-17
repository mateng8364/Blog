// import {Dep} from './Dep'

const Dep = require('./Dep').Dep;


function defineReactive(obj, key, val, callback) {
  let value = val
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      value = newVal
      dep.notify()
    }
  })
  callback && callback(value)
}

module.exports = { defineReactive }


