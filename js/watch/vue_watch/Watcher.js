// import {pushTarget, popTarget} from './Dep'
const { pushTarget, popTarget } = require('./Dep')

class Watcher {
  getter
  vm
  constructor(vm, expOrFn) {
    this.vm = vm
    this.getter = expOrFn
    this.get(vm)
  }
  get (vm) {
    pushTarget(this)
    const value = this.getter.call(vm, vm)
    popTarget()
    return value
  }
  addDep(dep) {
    dep.addSub(this)
  }

  update() {
    console.log('data发生改变，组件需要更新')
  }
}

module.exports = {Watcher}